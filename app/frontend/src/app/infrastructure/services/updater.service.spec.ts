import { TestBed, inject } from '@angular/core/testing';

import { UpdaterService } from './updater.service';
import { InfrastructureModule } from '../infrastructure.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

describe('UpdaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfrastructureModule,
        SimpleNotificationsModule.forRoot()
      ],
      providers: [UpdaterService]
    });
  });

  it('should be created', inject([UpdaterService], (service: UpdaterService) => {
    expect(service).toBeTruthy();
  }));
});
