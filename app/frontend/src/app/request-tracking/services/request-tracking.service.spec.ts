import { TestBed, inject } from '@angular/core/testing';

import { RequestTrackingService } from './request-tracking.service';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { MockElectron } from 'src/app/infrastructure/mock-electron.service';

describe('RequestTrackingService', () => {
  let electron: MockElectron;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTrackingService, { provide: ElectronService, useClass: MockElectron }]
    });

    electron = TestBed.get(ElectronService) as MockElectron;
  });

  it('should be created', inject([RequestTrackingService], (service: RequestTrackingService) => {
    expect(service).toBeTruthy();
  }));
  it('should send RequestTracking-Reset on resetRequests', inject([RequestTrackingService], (service: RequestTrackingService) => {
    service.resetRequests();

    expect(electron.messageWasSent('RequestTracking-Reset')).toBeTruthy();
  }));

  it('should emit updated request counts on RequestTracking-Updated', inject([RequestTrackingService], (service: RequestTrackingService) => {
    let requests = {};
    service.init();
    service.RequestCounts.subscribe(_ => {
      requests = _;
    })
    electron.send('RequestTracking-Updated', {
      requests: {
        S3: {
          generic: {
            "0": 10
          }
        }
      }
    });

    expect(requests['0']).toBe(10);
  }));
});
