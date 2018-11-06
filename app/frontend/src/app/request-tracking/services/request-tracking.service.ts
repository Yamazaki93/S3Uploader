import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestTrackingService {

  RequestCounts: Observable<any>;
  private _requests: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(
    private electron: ElectronService
  ) { 
    this.RequestCounts = this._requests.asObservable();
  }

  init() {
    this.electron.onCD('RequestTracking-Updated', (event, arg) => {
      this._requests.next(arg.requests.S3.generic);
    });
  }
  resetRequests(){
    this.electron.send('RequestTracking-Reset', {});
  }
}
