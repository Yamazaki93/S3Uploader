import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AWSAccount } from '../aws-account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  AccountTestResult: EventEmitter<{account: string, success: boolean}> = new EventEmitter<{account: string, success: boolean}>();
  InitializingAccount: EventEmitter<{}> = new EventEmitter();
  Accounts: Observable<AWSAccount[]>
  private _accounts = new BehaviorSubject<AWSAccount[]>([])
  private _validAccounts: AWSAccount[] = []
  constructor(
    private electron: ElectronService
  ) {
    this.Accounts = this._accounts.asObservable();
  }

  init() {
    this.electron.onCD('Settings-SettingsChanged', (event: string, arg: any) => {
      arg.accounts.forEach(a => {
        if (this._validAccounts.filter(_ => _.id === a).length === 0) {
          this.InitializingAccount.emit();
          this.electron.send('AWS-InitAccount', { account: a });
        }
      });
    });
    this.electron.onCD('AWS-AccountInitialized', (event: string, arg: any) => {
      this._validAccounts.push({
        id: arg.account
      });
      this._accounts.next(this._validAccounts);
    });
    this.electron.onCD('AWS-CredentialFound', (event: string, arg: any) => {
      this.AccountTestResult.emit({
        account: arg.account,
        success: true
      });
    });
    this.electron.onCD('AWS-CredentialNotFound', (event: string, arg: any) => {
      this.AccountTestResult.emit({
        account: arg.account,
        success: false
      });
    });
  }
  
  testAccount(account: string){
    this.electron.send('AWS-TestAccount', {account: account});
  }

  openAWSCredentialHelp(){
    this.electron.send('Application-OpenExternal', {address: "https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html"});
  }

  openAWSS3Pricing() {
    this.electron.send('Application-OpenExternal', {address: 'https://aws.amazon.com/s3/pricing/'});
  }

  addAccount(account: string){
    this.electron.send('Settings-AddAccount', {account: account});    
  }
}
