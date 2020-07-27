// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //CapchainX Endpoint
  API_ENDPOINT: 'https://staging.api.capchainx.com/',
  //API_ENDPOINT: 'https://demo9617938.mockable.io/',

  //AWS Settings
  AWS_ACCESS_KEY_ID: 'AKIAIBNMZ4OCMTOL5FNA',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_REGION: 'us-east-1',
  AWS_S3_BUCKET: 'tokenization.platform.test',

  //Ethereum Settings
  ETHEREUM_PROVIDER: "https://ropsten.infura.io/12YZaQce3DLe0Lerifkc",
  ETHERSCAN_URL: "https://ropsten.etherscan.io"
};
