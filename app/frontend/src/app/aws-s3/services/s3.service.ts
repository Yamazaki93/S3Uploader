import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { S3Item } from '../s3-item';
import * as uuid from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnalyticsService } from 'src/app/infrastructure/services/analytics.service';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  RefreshingObjects: EventEmitter<{ parents: string[] }> = new EventEmitter<{ parents: string[] }>();
  ItemsEnumerated: EventEmitter<{ parents: string[], items: S3Item[] }> = new EventEmitter<{ parents: string[], items: S3Item[] }>();
  ItemAdded: EventEmitter<{ parents: string[], item: S3Item }> = new EventEmitter<{ parents: string[], item: S3Item }>();
  DownloadPath: Observable<string>;
  private _cachedItems: { [key: string]: S3Item[] } = {}
  private _downloadPath = new BehaviorSubject('');
  constructor(
    private electron: ElectronService,
    private analytics: AnalyticsService
  ) {
    this.DownloadPath = this._downloadPath.asObservable();
  }

  init() {
    this.electron.onCD('S3-BucketsListed', (event: string, arg: any) => {
      let buckets: S3Item[] = []
      arg.buckets.forEach(b => {
        buckets.push({
          type: 'bucket',
          name: b.Name
        });
      });
      this.ItemsEnumerated.emit({
        parents: [arg.account],
        items: buckets
      });
    });
    this.electron.onCD('S3-ObjectListed', (event: string, arg: any) => {
      let items = []
      if (arg.objects) {
        items = arg.objects.map(_ => {
          return {
            name: _.Key,
            type: 'file',
            size: _.Size,
            Etag: _.ETag,
            LastModified: _.LastModified,
            Metadata: _.Metadata,
            ContentType: _.ContentType,
            StorageClass: _.StorageClass,
          };
        });
      }
      if (arg.folders) {
        items = items.concat(arg.folders.map(_ => {
          return {
            type: 'folder',
            name: _.Prefix.substring(0, _.Prefix.length - 1).split('/').pop(),
            Etag: _.ETag,
            LastModified: _.LastModified,
            Metadata: _.Metadata,
            ContentType: _.ContentType,
            StorageClass: _.StorageClass
          }
        }));
      }
      this._cachedItems[arg.parents.join('/')] = items;
      this.ItemsEnumerated.emit({
        parents: arg.parents,
        items: items
      });
    });
    this.electron.onCD('S3-OperationFailed', (event: string, arg: any) => {
      this.ItemsEnumerated.emit({
        parents: arg.parents,
        items: []
      });
    });
    this.electron.onCD('S3-UploadSuccessful', (event: string, arg: any) => {

    });
    this.electron.onCD('S3-BulkUploadCompleted', (event: string, arg: any) => {
      let params = this.getS3Parameters(arg.parents);
      this.listObjects(params.account, params.bucket, params.prefix);
    });
    this.electron.onCD('S3-BulkUploadFailed', (event: string, arg: any) => {
      let params = this.getS3Parameters(arg.parents);
      this.listObjects(params.account, params.bucket, params.prefix);
    });
    this.electron.onCD('Settings-SettingsChanged', (event: string, arg: any) => {
      this._downloadPath.next(arg['download-path']);
    });
    this.electron.onCD('S3-ListingObjects', (event: string, arg: any) => {
      this.RefreshingObjects.emit(arg);
    });
  }

  getCachedItems(key: string): S3Item[] {
    let items = this._cachedItems[key];
    if (items) {
      return items;
    } else {
      return [];
    }
  }

  listBuckets(account: string) {
    this.electron.send('S3-ListBuckets', { account: account });
  }
  listObjects(account: string, bucket: string, prefix = "") {
    this.electron.send('S3-ListObjects', { account: account, bucket: bucket, prefix: prefix });
  }

  requestDownload(account: string, bucket: string, key: string): string {
    let id = uuid.v4();
    this.electron.send('S3-RequestDownload', { jobID: id, account: account, bucket: bucket, key: key, saveTo: this._downloadPath.value });
    this.analytics.logEvent('S3', 'RequestDownload');
    return id.toString();
  }

  requestBulkUpload(account: string, bucket: string, prefix: string, items: Array<{ filePath: string, newPath: string }>) {
    let files = items.map(item => {
      let id = uuid.v4();
      return {
        account: account,
        bucket: bucket,
        filePath: item.filePath,
        newPath: item.newPath,
        jobID: id,
      }
    });
    this.electron.send('S3-RequestBulkUpload', {
      files: files,
      parents: [account, bucket].concat(prefix.split('/')) 
    });
    this.analytics.logEvent('S3', 'RequestBulkUpload');
  }

  browseDownloadPath() {
    this.electron.send('Settings-BrowseDownloadPath', {});
  }

  resetDownloadPath() {
    this.electron.send('Settings-ResetDownloadPath', {});
  }
  changeUploadPromptSetting(val: boolean) {
    this.analytics.logEvent('S3', 'ChangeUploadPromptSetting : ' + val);
    this.electron.send('Settings-Set', { key: 'prompt-upload', value: val });
  }
  private getS3Parameters(parents: string[]): { account: string, bucket: string, prefix: string } {
    if (parents.length < 2) {
      return null;
    }
    let account = parents[0];
    let bucket = parents[1];
    let prefix = (parents.slice(2, parents.length)).join('/');
    return { account: account, bucket: bucket, prefix: prefix ? prefix + '/' : "" };
  }
}
