import { Component, OnInit, EventEmitter } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics-consent',
  templateUrl: './analytics-consent.component.html',
  styleUrls: [
    '../prompt.scss',
    './analytics-consent.component.scss'
  ]
})
export class AnalyticsConsentComponent implements OnInit {

  toClose = new EventEmitter(); 
  private optIn = true;
  constructor(
    private analytics: AnalyticsService
  ) { }

  ngOnInit() {
  }

  confirm() {
    this.analytics.changeOpt(this.optIn);
    this.toClose.emit();
  }
  openHelp() {
    this.analytics.openGoogleAnalyticsHelp();
  }
}
