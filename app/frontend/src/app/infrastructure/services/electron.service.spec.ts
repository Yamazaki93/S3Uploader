import { TestBed, inject } from '@angular/core/testing';
import { ElectronService } from './electron.service';

let fakeElectron = {
  ipcRenderer: {
    send(event: string, arg: any) {

    },
    on(event: string, handler: any) {
    }
  }
};
// trust me, electron is there!
(window as any).electron = fakeElectron;

describe('ElectronService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService]
    });
  });

  it('should be created', inject([ElectronService], (service: ElectronService) => {
    expect(service).toBeTruthy();
  }));
  it('should not error out when electron is not available', inject([ElectronService], (service: ElectronService) => {
    service.onCD('test', () => { });
    expect(service).toBeTruthy();
  }));
  it('should invoke ipcRenderer.send when send is called', inject([ElectronService], (service: ElectronService) => {
    let spy = spyOn(fakeElectron.ipcRenderer, 'send').and.callThrough();
    service.send('test', {});

    expect(spy).toHaveBeenCalled();
  }));
});
