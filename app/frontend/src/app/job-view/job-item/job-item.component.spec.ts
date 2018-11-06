import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { JobItemComponent } from './job-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JobType } from '../job-type';
import { JobStatus } from '../job-status';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobService } from '../job.service';

describe('JobItemComponent', () => {
  let component: JobItemComponent;
  let fixture: ComponentFixture<JobItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobItemComponent],
      imports: [NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct icon based on jobType', () => {
    component.jobType = JobType.Download;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ion-ios-cloud-download')).not.toBeNull();
  });

  it('should display correct percentage number', () => {
    component.percentage = 60;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.progress-bar').style.width).toBe('60%');
    expect(fixture.nativeElement.querySelector('.progress-percentage span').innerHTML).toContain('60%');
  });

  it('should display correct source destination', () => {
    component.source = 'test1';
    component.destination = 'test2';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.job-desc .desc-text')[0].innerHTML).toContain(component.source);
    expect(fixture.nativeElement.querySelectorAll('.job-desc .desc-text')[1].innerHTML).toContain(component.destination);
  });
  it('should show spinner and hide outline when running', () => {
    component.jobStatus = JobStatus.Running;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.job-icon app-spinner')).not.toBe(null);
    expect(fixture.nativeElement.querySelector('.job-icon .outline')).toBe(null);
  });
  it('should not show spinner and show outline when not running', () => {
    component.jobStatus = JobStatus.Completed;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.job-icon app-spinner')).toBe(null);
    expect(fixture.nativeElement.querySelector('.job-icon .outline')).not.toBe(null);

  });

  it('should show success style on success', () => {
    component.jobStatus = JobStatus.Completed;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.job-icon .outline').classList).toContain('success');
    expect(fixture.nativeElement.querySelector('.job-icon i').classList).toContain('success');
  });
  it('should show failed style on failed', () => {
    component.jobStatus = JobStatus.Failed;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.job-icon .outline').classList).toContain('failed');
    expect(fixture.nativeElement.querySelector('.job-icon i').classList).toContain('failed');
  });
  it('should hide progress bar and progress when not running', () => {
    component.jobStatus = JobStatus.Failed;
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      expect(fixture.nativeElement.querySelector('.progress-bar')).toBeNull();
      expect(fixture.nativeElement.querySelector('.progress')).toBeNull();
    });
  });
  it('should emit toDelete on clicking delete-btn', () => {
    let emit = false;
    component.toDelete.subscribe(() => {
      emit = true;
    });
    component.jobStatus = JobStatus.Completed;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('#delete-job-btn').click();
    fixture.detectChanges();

    expect(emit).toBeTruthy();
  });
  it('should emit toOpen when onOpenFileLocation', () => {
    let emit = false;
    component.toOpen.subscribe(() => {
      emit = true;
    });
    component.jobStatus = JobStatus.Completed;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('#open-folder-btn').click();

    expect(emit).toBeTruthy();
  });

  it('should emit toStop when onStopJob', () => {
    let emit = false;
    component.toStop.subscribe(() => {
      emit = true;
    });
    fixture.nativeElement.querySelector('#stop-job-btn').click();

    expect(emit).toBeTruthy();
  });
  it('should display message when job failed', () => {
    component.jobStatus = JobStatus.Failed;
    component.message = "error";

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.message')).not.toBeNull();
  });
});
