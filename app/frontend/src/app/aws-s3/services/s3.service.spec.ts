import { TestBed, inject } from '@angular/core/testing';

import { S3Service } from './s3.service';
import { MockElectron } from 'src/app/infrastructure/mock-electron.service';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { S3Item } from '../s3-item';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';

describe('S3Service', () => {
  let electron: MockElectron
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InfrastructureModule
      ],
      providers: [S3Service, { provide: ElectronService, useClass: MockElectron }]
    });
    electron = TestBed.get(ElectronService) as MockElectron;
  });

  it('should be created', inject([S3Service], (service: S3Service) => {
    expect(service).toBeTruthy();
  }));
  it('should send S3-ListBuckets on listBuckets', inject([S3Service], (service: S3Service) => {
    service.listBuckets("hi");
    expect(electron.messageWasSent('S3-ListBuckets', { account: "hi" })).toBeTruthy();
  }));
  it('should send S3-ListObjects on listObjects', inject([S3Service], (service: S3Service) => {
    service.listObjects("hi", "hi");
    expect(electron.messageWasSent('S3-ListObjects', { account: "hi", bucket: "hi", prefix: "" })).toBeTruthy();
  }));
  it('should send S3-RequestDownload on requestDownload', inject([S3Service], (service: S3Service) => {
    service.requestDownload("hi", "hi", "hi123");
    expect(electron.messageWasSent('S3-RequestDownload')).toBeTruthy();
  }));
  it('should emit new download path on Settings-SettingsChanged', inject([S3Service], (service: S3Service) => {
    let path = '';
    service.init();
    service.DownloadPath.subscribe(s => {
      path = s;
    })
    electron.send('Settings-SettingsChanged', { 'download-path': 'hi' })

    expect(path).toBe("hi");
  }));
  it('should send Settings-BrowseDownloadPath on browseDownloadPath', inject([S3Service], (service: S3Service) => {
    service.browseDownloadPath()
    expect(electron.messageWasSent('Settings-BrowseDownloadPath')).toBeTruthy();
  }));
  it('should send Settings-ResetDownloadPath on resetDownloadPath', inject([S3Service], (service: S3Service) => {
    service.resetDownloadPath()
    expect(electron.messageWasSent('Settings-ResetDownloadPath')).toBeTruthy();
  }));
  it('should emit ItemsEnumerated on ObjectListed', inject([S3Service], (service: S3Service) => {
    let items = [];
    service.ItemsEnumerated.subscribe(its => {
      items = its.items;
    });
    service.init();
    electron.send('S3-ObjectListed', {
      folders: [
        { Prefix: "hi/" }
      ],
      objects: [
        { Key: "abc" },
        { Key: "me" }
      ],
      parents: []
    });
    expect(items.length).toBe(3);
  }));
  it('should send S3-RequestUpload on requestUpload', inject([S3Service], (service: S3Service) => {
    service.requestUpload("hi", "hi", "path", "prefix");
    expect(electron.messageWasSent('S3-RequestUpload')).toBeTruthy();
  }));
  it('should call listObject on S3-UploadSuccessful', inject([S3Service], (service: S3Service) => {
    service.init();
    let spy = spyOn(service, 'listObjects');
    electron.send('S3-UploadSuccessful',
      { parents: ['hi', 'bucket', 'prefix'], filename: 'test.txt' });
    expect(spy).toHaveBeenCalled();
  }));
  it('should emit RefreshingObjects with correct parents on S3-ListingObjects', inject([S3Service], (service: S3Service) => {
    let parents = [];
    service.RefreshingObjects.subscribe(_ => {
      parents = _.parents;
    });
    service.init();
    electron.send('S3-ListingObjects', {parents: ['hi', '1', '2', '3']});

    expect(parents.length).toBe(4);
  }));

  it('should retrieve previous iterated items on getCachedItems', inject([S3Service], (service: S3Service) => {
    service.init();
    electron.send('S3-ObjectListed', {
      folders: [
        { Prefix: "hi/" }
      ],
      objects: [
        { Key: "abc" },
        { Key: "me" }
      ],
      parents: ['hi', '123']
    });

    expect(service.getCachedItems('hi/123').length).toBe(3);
  }));
});
