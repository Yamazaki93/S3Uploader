import { Injectable } from '@angular/core';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriesService {

  Histories: Observable<{type: string, name: string, time: string, status: string}[]>;
  private _histories: BehaviorSubject<{type: string, name: string, time: string, status: string}[]> = new BehaviorSubject<{type: string, name: string, time: string, status: string}[]>([]);
  constructor(
    private electron: ElectronService
  ) { 
    this.Histories = this._histories.asObservable();
  }
  init() {
    this.electron.onCD('History-Changed', (event: string, arg: any) => {
      this._histories.next(arg.histories);
    });
    this.electron.onCD('S3-UploadSuccessful', (event: string, arg: any) => {
      this.handleUpload(arg, 'success');
    });
    this.electron.onCD('S3-UploadFailed', (event: string, arg: any) => {
      this.handleUpload(arg, 'failed');
    });
    this.electron.onCD('S3-DownloadSuccessful', (event: string, arg: any) => {
      this.handleDownload(arg, 'success');
    });
    this.electron.onCD('S3-DownloadFailed', (event: string, arg: any) => {
      this.handleDownload(arg, 'failed');
    });
  }
  clearHistory() {
    this.electron.send('History-Clear', {});
  }
  private handleUpload(arg: any, status: string){
    let to = arg.parents.join('/') + '/' + arg.filename;
    this.electron.send('History-Add', {
      type: 'upload',
      name: `${to}`,
      status: status
    });
  }
  private handleDownload(arg: any, status: string) {
    let to = arg.saveAs;
    this.electron.send('History-Add', {
      type: 'download',
      name: `${to}`,
      status: status
    })
  }
}
