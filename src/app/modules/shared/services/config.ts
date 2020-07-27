import { environment } from "@env/environment";

export class Config {
  //CapchainX Endpoint
  public static API_ENDPOINT = environment.API_ENDPOINT;

  //AWS Settings
  public static AWS_ACCESS_KEY_ID = environment.AWS_ACCESS_KEY_ID;
  public static AWS_SECRET_ACCESS_KEY = environment.AWS_SECRET_ACCESS_KEY;
  public static AWS_REGION = environment.AWS_REGION;
  public static AWS_S3_BUCKET = environment.AWS_S3_BUCKET;

  //Ethereum Settings
  public static ETHEREUM_PROVIDER = environment.ETHEREUM_PROVIDER;
  public static ETHERSCAN_URL = environment.ETHERSCAN_URL;
}