import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ElectronService } from './infrastructure/services/electron.service';
import { AwsAccountsModule } from './aws-accounts/aws-accounts.module';
import { HistoriesModule } from './histories/histories.module';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        InfrastructureModule,
        AwsAccountsModule,
        HistoriesModule,
        SimpleNotificationsModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should send Application-Initialize on construction', () => {
    let electron = TestBed.get(ElectronService) as ElectronService;
    let spy = spyOn(electron, 'send').and.callThrough();
    TestBed.createComponent(AppComponent);
    expect(spy).toHaveBeenCalled();
  });
});
