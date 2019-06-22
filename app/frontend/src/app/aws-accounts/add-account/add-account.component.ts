import { Component, OnInit, EventEmitter } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { trigger, transition, query, stagger, animate, keyframes, style } from '@angular/animations';
import { SubscriptionComponent } from 'src/app/infrastructure/subscription-component';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: [
    '../../infrastructure/prompt.scss',
    './add-account.component.scss'
  ],
  animations: [
    trigger('ngIfAnimation', [
      transition('void => *', [
        query(':self', stagger('300ms', [
          animate('0.3s ease-in', keyframes([
            style({ opacity: 0 }),
            style({ opacity: 1 }),
          ]))]), { optional: true }),
      ])
    ])
  ]
})
export class AddAccountComponent extends SubscriptionComponent implements OnInit {

  toClose = new EventEmitter();
  loading = false;
  private name = "";
  private url = "";
  private valid = false;
  private tested = false;
  constructor(
    private accounts: AccountsService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.accounts.AccountTestResult.subscribe(_ => {
      if(_.account === this.name) {
        this.tested = true;
        this.valid = _.success;
        this.loading = false;
      }
    }))
  }

  private close() {
    this.toClose.emit();
  }

  private openCredentialHelp() {
    this.accounts.openAWSCredentialHelp();
  }

  private testAccount() {
    if (this.name) {
      this.loading = true;
      this.accounts.testAccount(this.name, this.url);
    }
  }

  private onTextChange() {
    this.tested = false;
    this.valid = false;
  }

  private addAccount() {
    this.accounts.addAccount(this.name);
    this.toClose.emit();
  }
}
