import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { ElectronService } from './electron.service';
import { MockElectron } from '../mock-electron.service';

describe('AnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService, {provide: ElectronService, useClass: MockElectron}]
    });
  });

  it('should be created', inject([AnalyticsService], (service: AnalyticsService) => {
    expect(service).toBeTruthy();
  }));
});
