import { TestBed, inject } from '@angular/core/testing';
import { AccountsService } from './accounts.service';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { MockElectron } from 'src/app/infrastructure/mock-electron.service';

describe('AccountsService', () => {
  let electron: MockElectron;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountsService,
        { provide: ElectronService, useClass: MockElectron }
      ]
    });
    electron = TestBed.get(ElectronService) as MockElectron;
  });

  it('should be created', inject([AccountsService], (service: AccountsService) => {
    expect(service).toBeTruthy();
  }));
  it('should send AWS-InitAccount on accounts added', inject([AccountsService], (service: AccountsService) => {
    service.init();
    electron.send('Settings-SettingsChanged', { accounts: ['hi'] });
    expect(electron.messageWasSent('AWS-InitAccount')).toBeTruthy();
  }));
  it('should not send AWS-InitAccount if account already initialized', inject([AccountsService], (service: AccountsService) => {
    service.init();
    electron.send('AWS-AccountInitialized', { account: 'hi' });
    electron.send('Settings-SettingsChanged', { accounts: ['hi'] });
    expect(electron.messageWasSent('AWS-InitAccount')).toBeFalsy();
  }));
  it('should emit new account list on AWS-AccountInitialized', inject([AccountsService], (service: AccountsService) => {
    service.init();
    let accs = [];
    service.Accounts.subscribe(a => {
      accs = a;
    })
    electron.send('AWS-AccountInitialized', { account: 'hi' });
    expect(accs.length).toBe(1);
  }));
  it('should emit InitializingAccount on accounts added', inject([AccountsService], (service: AccountsService) => {
    service.init();
    let initializing = false;
    service.InitializingAccount.subscribe(_ => {
      initializing = true;
    })
    electron.send('Settings-SettingsChanged', { accounts: ['hi'] });

    expect(initializing).toBeTruthy();
  }));
  it('should send Application-OpenExternal on openAWSCredentialHelp', inject([AccountsService], (service: AccountsService) => {
    service.openAWSCredentialHelp();

    expect(electron.messageWasSent('Application-OpenExternal')).toBeTruthy();
  }));
  it('should emit account info on AWS-CredentialFound', inject([AccountsService], (service: AccountsService) => {
    let info;
    service.AccountTestResult.subscribe(_ => {
      info = _;
    });
    service.init();
    electron.send('AWS-CredentialFound', {account: 'hi'});

    expect(info.success).toBeTruthy();
    expect(info.account).toBe('hi');
  }));

  it('should send AWS-TestAccount on testAccount', inject([AccountsService], (service: AccountsService) => {
    service.testAccount('hi');

    expect(electron.messageWasSent('AWS-TestAccount')).toBeTruthy();
  }));

  it('should send Settings-AddAccount on addAccount', inject([AccountsService], (service: AccountsService) => {
    service.addAccount('hi');

    expect(electron.messageWasSent('Settings-AddAccount')).toBeTruthy();
  }));
});
