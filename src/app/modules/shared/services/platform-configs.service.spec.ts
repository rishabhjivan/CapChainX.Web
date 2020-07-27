import { TestBed, inject } from '@angular/core/testing';

import { PlatformConfigsService } from './platform-configs.service';

describe('PlatformConfigsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlatformConfigsService]
    });
  });

  it('should be created', inject([PlatformConfigsService], (service: PlatformConfigsService) => {
    expect(service).toBeTruthy();
  }));
});
