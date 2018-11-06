import { AwsS3Module } from './aws-s3.module';

describe('AwsS3Module', () => {
  let awsS3Module: AwsS3Module;

  beforeEach(() => {
    awsS3Module = new AwsS3Module();
  });

  it('should create an instance', () => {
    expect(awsS3Module).toBeTruthy();
  });
});
