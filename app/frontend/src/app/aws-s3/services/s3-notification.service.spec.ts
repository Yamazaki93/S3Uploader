import { TestBed, inject } from '@angular/core/testing';

import { S3NotificationService } from './s3-notification.service';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ElectronService } from '../../infrastructure/services/electron.service';
import { MockElectron } from '../../infrastructure/mock-electron.service';

describe('S3NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SimpleNotificationsModule.forRoot()],
      providers: [S3NotificationService, { provide: ElectronService, useClass: MockElectron }]
    });
  });

  it('should be created', inject([S3NotificationService], (service: S3NotificationService) => {
    expect(service).toBeTruthy();
  }));
  it('shuold delegate to NotificationsService on S3-OperationFailed', inject([S3NotificationService], (service: S3NotificationService) => {
    service.init();
    let noti = TestBed.get(NotificationsService) as NotificationsService;
    let electron = TestBed.get(ElectronService) as MockElectron;
    let spy = spyOn(noti, 'error');

    electron.send('S3-OperationFailed', {error: {}});

    expect(spy).toHaveBeenCalled();
  }));
  it('should delegate to NotificationsService on S3-LocationNotFound', inject([S3NotificationService], (service: S3NotificationService) => {
    service.init();
    let noti = TestBed.get(NotificationsService) as NotificationsService;
    let electron = TestBed.get(ElectronService) as MockElectron;
    let spy = spyOn(noti, 'error');

    electron.send('S3-LocationNotFound', {error: {}});

    expect(spy).toHaveBeenCalled();
  }));
});
