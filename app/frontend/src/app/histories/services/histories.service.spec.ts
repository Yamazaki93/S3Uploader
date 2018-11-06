import { TestBed, inject } from '@angular/core/testing';

import { HistoriesService } from './histories.service';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { MockElectron } from 'src/app/infrastructure/mock-electron.service';

describe('HistoriesService', () => {
  let electron: MockElectron;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoriesService, {provide: ElectronService, useClass: MockElectron}]
    });
    electron = TestBed.get(ElectronService) as MockElectron;
  });

  it('should be created', inject([HistoriesService], (service: HistoriesService) => {
    expect(service).toBeTruthy();
  }));
  it('should emit new Histories when History-Changed', inject([HistoriesService], (service: HistoriesService) => {
    service.init();
    let items = [];
    service.Histories.subscribe(_ => {
      items = _;
    });
    electron.send('History-Changed', {
      histories: [
        {
          type: 'hi',
          name: 'hi',
          time: new Date()
        }
      ]
    });
    expect(items.length).toBe(1);
  }));
  it('should send History-Add on S3-UploadSuccessful', inject([HistoriesService], (service: HistoriesService) => {
    service.init();
    electron.send('S3-UploadSuccessful', {
      parents: [],
      filename: "test"
    });
    expect(electron.messageWasSent('History-Add')).toBeTruthy();
  }));
  it('should send History-Add on S3-DownloadSuccessful', inject([HistoriesService], (service: HistoriesService) => {
    service.init();
    electron.send('S3-DownloadSuccessful', {
      saveTo: 'test',
      filename: "test"
    });
    expect(electron.messageWasSent('History-Add')).toBeTruthy();
  }));
  it('should send History-Clear on clear history', inject([HistoriesService], (service: HistoriesService) => {
    service.init();
    service.clearHistory();
    expect(electron.messageWasSent('History-Clear')).toBeTruthy();
  }));
});
