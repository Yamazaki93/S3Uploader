import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RequestTrackingModule } from '../request-tracking/request-tracking.module';
import { RequestTrackingService } from '../request-tracking/services/request-tracking.service';
import { BehaviorSubject } from 'rxjs';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { S3Service } from '../aws-s3/services/s3.service';
import { FormsModule } from '@angular/forms';
import { HistoriesService } from '../histories/services/histories.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SimpleNotificationsModule.forRoot(), RouterTestingModule, RequestTrackingModule, AwsS3Module, FormsModule, InfrastructureModule],
      declarations: [SettingsPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should go to /home on click back btn', () => {
    let svc = TestBed.get(Router) as Router
    let spy = spyOn(svc, 'navigateByUrl');
    fixture.nativeElement.querySelector('#back-btn').click();

    expect(spy).toHaveBeenCalledWith('/home');
  });
  it('should delegate to requestTracking on clicking reset requests button', () => {
    let svc = TestBed.get(RequestTrackingService) as RequestTrackingService;
    let spy = spyOn(svc,'resetRequests');

    fixture.nativeElement.querySelector('#reset-request-btn').click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('should display current request counts', () => {
    let svc = TestBed.get(RequestTrackingService) as RequestTrackingService;
    let requests = new BehaviorSubject({});
    svc.RequestCounts = requests.asObservable();
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    requests.next({'0': 10});
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#request-counts > div > h5').innerHTML).toContain('10');
  });
  it('should delegate to s3 service on browseDownloadPath', () => {
    let svc = TestBed.get(S3Service) as S3Service;
    let spy = spyOn(svc, 'browseDownloadPath');

    fixture.nativeElement.querySelector('#browse-download-path-btn').click();

    expect(spy).toHaveBeenCalled();
  });
  it('should display updated download path', () => {
    let svc = TestBed.get(S3Service) as S3Service;
    let path = new BehaviorSubject("");
    svc.DownloadPath = path.asObservable();
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    path.next("hi");
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      expect(fixture.nativeElement.querySelector('#download-path-display').value).toBe('hi');
    });
  });
  it('should delegate to settings to reset download path', () => {
    let svc = TestBed.get(S3Service) as S3Service;
    let spy = spyOn(svc, 'resetDownloadPath');
    fixture.nativeElement.querySelector('#reset-download-path-btn').click();

    expect(spy).toHaveBeenCalled();
  });
  it('should delegate to histories to clear histories', () => {
    let svc = TestBed.get(HistoriesService) as HistoriesService;
    let spy = spyOn(svc, 'clearHistory');
    fixture.nativeElement.querySelector('#clear-history-btn').click();

    expect(spy).toHaveBeenCalled();
  });
});
