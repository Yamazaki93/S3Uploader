import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../aws-accounts/services/accounts.service';
import { DomService } from '../infrastructure/services/dom.service';
import { AddAccountComponent } from '../aws-accounts/add-account/add-account.component';
import { Router } from '@angular/router';
import { UpdaterService, UpdaterStatus } from '../infrastructure/services/updater.service';
import { SubscriptionComponent } from '../infrastructure/subscription-component';
import { AnalyticsService } from '../infrastructure/services/analytics.service';
import { AnalyticsConsentComponent } from '../infrastructure/analytics-consent/analytics-consent.component';
import { AnalyticsTracked } from '../infrastructure/analytics-tracked';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: [
    '../page.scss',
    './welcome-page.component.scss'
  ]
})
@AnalyticsTracked("WelcomePageComponent")
export class WelcomePageComponent extends SubscriptionComponent implements OnInit {

  private updateAvailable = false;
  constructor(
    private accounts: AccountsService,
    private dom: DomService,
    private router: Router,
    private updater: UpdaterService,
    private analytics: AnalyticsService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.updater.updaterStatus.subscribe(s => {
      this.updateAvailable = s === UpdaterStatus.UpdateAvailable;
    }));
    this.recordSubscription(this.analytics.enabled.subscribe(en => {
      if(en === null) {
        let comp = this.dom.appendComponentToBody(AnalyticsConsentComponent);
        comp.instance.toClose.subscribe(s => {
          comp.destroy();
        });
      }
    }))
  }

  openAWSCredHelp() {
    this.accounts.openAWSCredentialHelp();
  }
  openAddAccountWindow() {
    let elem = this.dom.appendComponentToBody(AddAccountComponent);
    elem.instance.toClose.subscribe(_ => {
      elem.destroy();
    });
  }
  openAWSS3Pricing() {
    this.accounts.openAWSS3Pricing();
  }

  goToSettings() {
    this.router.navigateByUrl('/settings');
  }
}
