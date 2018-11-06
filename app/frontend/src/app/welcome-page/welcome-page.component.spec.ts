import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePageComponent } from './welcome-page.component';
import { SideHeaderComponent } from '../side-header/side-header.component';
import { AwsAccountsModule } from '../aws-accounts/aws-accounts.module';
import { AccountsService } from '../aws-accounts/services/accounts.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HistoriesModule } from '../histories/histories.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { UpdaterService, UpdaterStatus } from '../infrastructure/services/updater.service';
import { EventEmitter } from '@angular/core';

describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WelcomePageComponent>;
  let updater: UpdaterService;
  let updaterStatus: EventEmitter<UpdaterStatus>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AwsAccountsModule, RouterTestingModule, HistoriesModule, InfrastructureModule, SimpleNotificationsModule.forRoot()],
      declarations: [ SideHeaderComponent, WelcomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    updater = TestBed.get(UpdaterService) as UpdaterService;
    updaterStatus = new EventEmitter<UpdaterStatus>();
    updater.updaterStatus = updaterStatus;
    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should delegate to AccountsService on open AWS links', () => {
    let svc = TestBed.get(AccountsService) as AccountsService;
    let spy1 = spyOn(svc, 'openAWSS3Pricing');
    let spy2 = spyOn(svc, 'openAWSCredentialHelp');

    component.openAWSCredHelp();
    component.openAWSS3Pricing();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('should navigate to /settings on clicking settings icon', () => {
    let svc = TestBed.get(Router) as Router
    let spy = spyOn(svc, 'navigateByUrl');
    fixture.nativeElement.querySelector('#settings-btn').click();

    expect(spy).toHaveBeenCalledWith('/settings');
  });
  it('should display badge on settings cog when udpate is available', () => {
    updaterStatus.emit(UpdaterStatus.UpdateAvailable);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.settings-icon .badge')).not.toBeNull();
  });
  it('should not display badge on settings cog when udpate is not available', () => {
    updaterStatus.emit(UpdaterStatus.NoUpdateAvailable);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.settings-icon .badge')).toBeNull();

  });
});
