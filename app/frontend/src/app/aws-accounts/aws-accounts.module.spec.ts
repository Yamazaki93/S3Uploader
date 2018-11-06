import { AwsAccountsModule } from './aws-accounts.module';

describe('AwsAccountsModule', () => {
  let awsAccountsModule: AwsAccountsModule;

  beforeEach(() => {
    awsAccountsModule = new AwsAccountsModule();
  });

  it('should create an instance', () => {
    expect(awsAccountsModule).toBeTruthy();
  });
});
