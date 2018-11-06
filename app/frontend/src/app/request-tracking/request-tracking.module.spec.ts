import { RequestTrackingModule } from './request-tracking.module';

describe('RequestTrackingModule', () => {
  let requestTrackingModule: RequestTrackingModule;

  beforeEach(() => {
    requestTrackingModule = new RequestTrackingModule();
  });

  it('should create an instance', () => {
    expect(requestTrackingModule).toBeTruthy();
  });
});
