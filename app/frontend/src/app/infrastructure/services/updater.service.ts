import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from './electron.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UpdaterService {

  updateVersion: Observable<string> = new Observable<string>();
  updaterStatus: Observable<UpdaterStatus> = new Observable<UpdaterStatus>();
  updateDownloadProgress: EventEmitter<number> = new EventEmitter<number>();

  private _updaterStatus: BehaviorSubject<UpdaterStatus> = new BehaviorSubject<UpdaterStatus>(UpdaterStatus.NoUpdateAvailable);
  private _updateVersion: BehaviorSubject<string> = new BehaviorSubject<string>("");
  constructor(
    private electron: ElectronService,
    private noti: NotificationsService,
  ) {
    this.updaterStatus = this._updaterStatus.asObservable();
    this.updateVersion = this._updateVersion.asObservable();
  }
  init() {
    this.electron.onCD('Updater', (event, arg) => {
      if (arg.msg === 'update-available') {
        // tslint:disable-next-line:max-line-length
        let notification = this.noti.info("Update Available", "Click here to install update, the app will restart automatically to update", {
          timeOut: 5000
        });
        notification.click.subscribe(() => {
          this.electron.send('Updater', 'commence-download');
        });
        this._updateVersion.next(arg.version);
        this._updaterStatus.next(UpdaterStatus.UpdateAvailable);
      } else if (arg.msg === 'update-not-available') {
        this._updaterStatus.next(UpdaterStatus.NoUpdateAvailable);
      } else if (arg.msg === 'downloading-update') {
        this.updateDownloadProgress.emit(Math.floor(arg.percentage));
      } else if (arg.msg === 'download-complete') {
        this._updaterStatus.next(UpdaterStatus.InstallingUpdate);
        this.noti.info("Installing Update", "The download has completed, starting installation...", {
          timeOut: 7000
        });
        let that = this;
        setTimeout(() => {
          that.electron.send('Updater', 'commence-install-update');
        }, 7 * 1000);
      }
    });
    this.electron.onCD('Updater-Checking', (event, arg) => {
      if(arg.inProgress) {
        this._updaterStatus.next(UpdaterStatus.CheckingUpdate);
      }
    });
  }
  checkUpdate() {
    this.electron.send('Updater-Check', {});
  }
  installUpdate() {
    this._updaterStatus.next(UpdaterStatus.DownloadingUpdate);
    this.electron.send('Updater', 'commence-download');
  }

}


export enum UpdaterStatus {
  NoUpdateAvailable,
  CheckingUpdate,
  UpdateAvailable,
  DownloadingUpdate,
  InstallingUpdate,
}