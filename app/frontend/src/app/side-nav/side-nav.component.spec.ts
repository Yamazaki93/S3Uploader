import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavComponent } from './side-nav.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { DomService } from '../infrastructure/services/dom.service';
import { AwsAccountsModule } from '../aws-accounts/aws-accounts.module';
import { JobViewModule } from '../job-view/job-view.module';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule, AwsAccountsModule, JobViewModule],
      declarations: [ SideNavComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should delegate to DOMService to create component on openAddAccount', () => {
    let dom = TestBed.get(DomService) as DomService;
    let spy = spyOn(dom, 'appendComponentToBody').and.callThrough();

    component.openAddAccount();

    expect(spy).toHaveBeenCalled();
  });
});
