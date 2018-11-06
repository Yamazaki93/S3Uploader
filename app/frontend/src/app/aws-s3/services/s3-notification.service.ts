import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';

@Injectable({
  providedIn: 'root'
})
export class S3NotificationService {

  constructor(
    private electron: ElectronService,
    private noti: NotificationsService
  ) { 

  }
  init() {
    this.electron.onCD('S3-OperationFailed', (event: string, arg: any) => {
      this.noti.error('Operation Failed', arg.error.message);
    });
    this.electron.onCD('S3-LocationNotFound', (event: string, arg: any) => {
      this.noti.error('Location Not Found', `Cannot find location ${arg.path}. You need to specify a download path under Settings`);
    });
  }
}
