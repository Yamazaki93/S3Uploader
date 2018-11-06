import { InfrastructureModule } from './infrastructure.module';

describe('InfrastructureModule', () => {
  let infrastructureModule: InfrastructureModule;

  beforeEach(() => {
    infrastructureModule = new InfrastructureModule();
  });

  it('should create an instance', () => {
    expect(infrastructureModule).toBeTruthy();
  });
});
