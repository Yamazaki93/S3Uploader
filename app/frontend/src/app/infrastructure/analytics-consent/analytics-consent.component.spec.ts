import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsConsentComponent } from './analytics-consent.component';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InfrastructureModule } from '../infrastructure.module';
import { AnalyticsService } from '../services/analytics.service';
import { ElectronService } from '../services/electron.service';
import { MockElectron } from '../mock-electron.service';

describe('AnalyticsConsentComponent', () => {
  let component: AnalyticsConsentComponent;
  let fixture: ComponentFixture<AnalyticsConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      providers: [
        AnalyticsService,
        {provide: ElectronService, useClass: MockElectron}
      ],
      declarations: [ AnalyticsConsentComponent, CheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
