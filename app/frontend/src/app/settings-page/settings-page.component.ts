import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestTrackingService } from '../request-tracking/services/request-tracking.service';
import { SubscriptionComponent } from '../infrastructure/subscription-component';
import { S3Service } from '../aws-s3/services/s3.service';
import { HistoriesService } from '../histories/services/histories.service';
import { RequestUploadService } from '../aws-s3/services/request-upload.service';
import { UpdaterService, UpdaterStatus } from '../infrastructure/services/updater.service';
import { AnalyticsService } from '../infrastructure/services/analytics.service';
import { ElectronService } from '../infrastructure/services/electron.service';
import { AnalyticsTracked } from '../infrastructure/analytics-tracked';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: [
    '../page.scss',
    './settings-page.component.scss'
  ]
})
@AnalyticsTracked()
export class SettingsPageComponent extends SubscriptionComponent implements OnInit {

  private requestCounts: any;
  private promptUpload = true;
  private downloadPath = "";
  private updaterStatus = UpdaterStatus.NoUpdateAvailable;
  private UpdaterStatusEnum = UpdaterStatus;
  private updateVersion = "";
  private updateDownloadProgress = 0;
  private optInAnalytics = false;
  constructor(
    private router: Router,
    private s3: S3Service,
    private requestTracking: RequestTrackingService,
    private histories: HistoriesService,
    private upload: RequestUploadService,
    private updater: UpdaterService,
    private analytics: AnalyticsService,
    private electron: ElectronService,
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.requestTracking.RequestCounts.subscribe(_ => {
      this.requestCounts = _;
    }));
    this.recordSubscription(this.s3.DownloadPath.subscribe(d => {
      this.downloadPath = d;
    }));
    this.recordSubscription(this.updater.updaterStatus.subscribe(_ => {
      this.updaterStatus = _;
    }));
    this.recordSubscription(this.updater.updateVersion.subscribe(_ => {
      this.updateVersion = _;
    }));
    this.recordSubscription(this.updater.updateDownloadProgress.subscribe(_ => {
      this.updateDownloadProgress = _;
    }));
    this.recordSubscription(this.analytics.enabled.subscribe(_ => {
      this.optInAnalytics = _ === true;
    }));
    this.promptUpload = this.upload.toPrompt;
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
  resetRequests() {
    this.requestTracking.resetRequests();
  }
  resetDownloadPath() {
    this.s3.resetDownloadPath();
  }
  browseDownloadPath() {
    this.s3.browseDownloadPath();
  }
  clearHistories() {
    this.histories.clearHistory();
  }
  updatePrompt(val: boolean) {
    this.s3.changeUploadPromptSetting(val);
  }

  checkForUpdate() {
    this.updater.checkUpdate();
  }

  installUpdate() {
    this.updater.installUpdate();
  }

  changeAnalyticsOpt(optIn: boolean) {
    this.analytics.changeOpt(optIn);
  }
  openDataCollectionSupplement() {
    this.electron.send('Application-OpenSecondary', {address: '../app/frontend/dist/data.html'});
  }
  openIssuesPage() {
    this.electron.send('Application-OpenExternal', {address: 'https://github.com/Yamazaki93/codename-palladium'})
  }
  openBMC() {
    this.electron.send('Application-OpenExternal', { address: "https://www.buymeacoffee.com/mjCsGWDTS" });
  }
}

