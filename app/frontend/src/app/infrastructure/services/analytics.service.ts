import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from './electron.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  enabled: Observable<boolean>
  private _enabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
  constructor(
    private electron: ElectronService
  ) {
    this.enabled = this._enabled.asObservable();
  }
  init() {
    this.electron.onCD('Settings-SettingsChanged', (event: string, arg: any) => {
      this._enabled.next(arg['analytics']);
      if (arg['analytics'] === true) {
        this.electron.send('Analytics-OptChanged', { enabled: true });
      } else if (arg['analytics'] === false) {
        this.electron.send('Analytics-OptChanged', { enabled: false });
      }
    });
  }
  changeOpt(enabled: boolean) {
    this.electron.send('Settings-Set', { key: 'analytics', value: enabled });
  }

  screenView(name: string) {
    this.electron.send('Analytics-ScreenView', { screenName: name });
  }

  exception(name: string, fatal = false) {
    this.electron.send('Analytics-Exception', { exceptionName: name, fatal: fatal });
  }

  logEvent(category: string, action: string) {
    this.electron.send('Analytics-Event', { category: category, action: action });
  }

  logOpenExternal(action: string) {
    this.electron.send('Analytics-Event', { category: "External", action: action });
  }
  openGoogleAnalyticsHelp() {
    this.electron.send('Application-OpenExternal', { address: "https://policies.google.com/technologies/partner-sites" });
  }
}
