import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as AWS from "aws-sdk";
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop';

import { Config } from '../../services/config';
import { Document } from '../../models/api/document';
import { DocumentStatus } from '../../services/document-status';
import { AlertsService } from '@alerts/services/alerts.service';

@Component({
  selector: 'document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {

  @Input() fileId: string;
  @Input() uploadedDocument: Document;
  @Input() companyId: number;
  @Output() fileChange = new EventEmitter();
  @Output() onActivate = new EventEmitter();
  public uploading: boolean = false;

  constructor(private alertsService: AlertsService) { }

  ngOnInit() {
    this.uploading = false;
  }

  getStatusLabel(statusKey) {
    return DocumentStatus[statusKey];
  }

  dropped(event: UploadEvent) {
    if (event.files.length > 0) {
      const droppedFile = event.files[0];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.uploadFile(file);
        });
      }
    }
  }

  fileEvent(fileInput: any) {
    const file = fileInput.target.files[0];
    this.uploadFile(file);
  }

  uploadFile(file: File) {
    this.uploading = true;
    var myComp = this;
    const AWSService = AWS;
    const bucketName = Config.AWS_S3_BUCKET;
    //I store this in a variable for retrieval later
    this.uploadedDocument.name = file.name;
    const fileExt = this.uploadedDocument.name.substr(this.uploadedDocument.name.lastIndexOf('.'));
    const date = new Date().toString();
    this.uploadedDocument.path = "uploads/documents/" + this.companyId + "/tokens-activation/document-" + this.uploadedDocument.id + "-" + date + fileExt;
    //Configures the AWS service and initial authorization
    AWS.config.update({
      apiVersion: '2006-03-01',
      region: Config.AWS_REGION,
      credentials: {
        accessKeyId: Config.AWS_ACCESS_KEY_ID,
        secretAccessKey: Config.AWS_SECRET_ACCESS_KEY,
      }
    });
    //adds the S3 service, make sure the api version and bucket are correct
    const s3 = new AWSService.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: bucketName}
    });
    s3.upload({ Key: this.uploadedDocument.path, Bucket: bucketName, Body: file, ACL: 'public-read'}, 
    function (err, data) {
      myComp.uploading = false;
      if (err) {
        myComp.uploadedDocument.name = '';
        myComp.uploadedDocument.path = '';
        myComp.alertsService.dispatchError('There was an error processing your file. Please try again.');
      } else {
        myComp.fileChange.emit(myComp.uploadedDocument);
      }
    });
  }

  activateDoc() {
    if (this.uploadedDocument.status == DocumentStatus.NOT_YET_UPLOADED
       || this.uploadedDocument.status == DocumentStatus.REJECTED)
       this.uploadedDocument.status = DocumentStatus.IN_PROGRESS;
    this.onActivate.emit(this.uploadedDocument);
  }

}
