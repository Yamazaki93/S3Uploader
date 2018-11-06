import { HistoriesModule } from './histories.module';

describe('HistoriesModule', () => {
  let historiesModule: HistoriesModule;

  beforeEach(() => {
    historiesModule = new HistoriesModule();
  });

  it('should create an instance', () => {
    expect(historiesModule).toBeTruthy();
  });
});
