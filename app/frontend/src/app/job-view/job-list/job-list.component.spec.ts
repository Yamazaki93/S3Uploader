import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { JobListComponent } from './job-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JobService } from '../job.service';
import { JobType } from '../job-type';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobItemComponent } from '../job-item/job-item.component';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';
import { JobStatus } from '../job-status';

describe('JobListComponent', () => {
  let component: JobListComponent;
  let fixture: ComponentFixture<JobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobListComponent, JobItemComponent],
      providers: [JobService],
      imports: [NoopAnimationsModule, InfrastructureModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display current jobs', () => {
    let jobSvc = TestBed.get(JobService) as JobService;
    jobSvc.createJob(JobType.Upload, "hi");
    jobSvc.createJob(JobType.Download, "hi123");
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      expect(fixture.nativeElement.querySelectorAll('app-job-item').length).toBe(2);
    });
  });
  it('should remove job on toDelete emit', fakeAsync(() => {
    let jobSvc = TestBed.get(JobService) as JobService;
    jobSvc.createJob(JobType.Download, "hi");
    jobSvc.updateJobStatus('hi', JobStatus.Completed);
    fixture.detectChanges();
    tick();
    fixture.nativeElement.querySelector('app-job-item #delete-job-btn').click();
    fixture.detectChanges();
    tick();
    expect(fixture.nativeElement.querySelectorAll('app-job-item').length).toBe(0);
  }));

  it('should open file location on toOpen emit', fakeAsync(() => {
    let jobSvc = TestBed.get(JobService) as JobService;
    let spy = spyOn(jobSvc, 'openJobFileLocation');
    jobSvc.createJob(JobType.Download, "hi", "from", "to");
    jobSvc.updateJobStatus('hi', JobStatus.Completed);
    fixture.detectChanges();
    tick();
    fixture.nativeElement.querySelector('app-job-item #open-folder-btn').click();
    fixture.detectChanges();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should request to stop job on toStop emit', fakeAsync(() => {
    let jobSvc = TestBed.get(JobService) as JobService;
    let spy = spyOn(jobSvc, 'stopJob');
    jobSvc.createJob(JobType.Download, "hi", "from", "to");
    fixture.detectChanges();
    tick();
    fixture.nativeElement.querySelector('app-job-item #stop-job-btn').click();
    fixture.detectChanges();
    tick();
    expect(spy).toHaveBeenCalled();
  }));
});
