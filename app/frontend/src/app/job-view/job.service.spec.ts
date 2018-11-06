import { TestBed, inject } from '@angular/core/testing';

import { JobService } from './job.service';
import { Job } from './job';
import { JobType } from './job-type';
import { JobStatus } from './job-status';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { MockElectron } from '../infrastructure/mock-electron.service';
import { ElectronService } from '../infrastructure/services/electron.service';

describe('JobService', () => {
  let electron: MockElectron;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobService, {provide: ElectronService, useClass: MockElectron}]
    });
    electron = TestBed.get(ElectronService) as MockElectron;
  });

  it('should be created', inject([JobService], (service: JobService) => {
    expect(service).toBeTruthy();
  }));

  it('should emit current jobs on subscribe', inject([JobService], (service: JobService) => {
    let jobs;
    service.Jobs.subscribe(js => {
      jobs = js;
    });
    expect(jobs.length).toBeDefined();
  }));
  it('should create job on Jobs-Created', inject([JobService], (service: JobService) => {
    let jobs;
    service.Jobs.subscribe(js => {
      jobs = js;
    });
    service.init();
    electron.send('Jobs-Created', {id: 'hi', type: 'upload'});
    
    expect(jobs.length).toBe(1);
  }));
  it('should update job status', inject([JobService], (service: JobService) => {
    let jobs;
    service.Jobs.subscribe(js => {
      jobs = js;
    });
    service.createJob(JobType.Upload, "hi");
    service.updateJobStatus(jobs[0].id, JobStatus.Completed);
    expect(jobs[0].status).toBe(JobStatus.Completed);
  }));
  it('should fail job on failJob', inject([JobService], (service: JobService) => {
    let jobs;
    service.Jobs.subscribe(js => {
      jobs = js;
    });
    service.init();
    service.createJob(JobType.Upload, "hi");
    electron.send('Jobs-Failed', {id: 'hi', error: 'error'})
    expect(jobs[0].status).toBe(JobStatus.Failed);
    expect(jobs[0].message).toBe('error');
  }));
  it('should update job percentage', inject([JobService], (service: JobService) => {
    let jobs;
    service.Jobs.subscribe(js => {
      jobs = js;
    });
    service.createJob(JobType.Upload, "hi");
    service.updatePercentage(jobs[0].id, 10);
    expect(jobs[0].percentage).toBe(10);
  }));
  it('should send Application-ShowInFolder for jobs with localFile',  inject([JobService], (service: JobService) => {
    service.createJob(JobType.Download, "hi", "from", "to", "local");
    service.openJobFileLocation('hi');

    expect(electron.messageWasSent('Application-ShowInFolder', {path: "local"})).toBeTruthy();
  }));
  it('should send Jobs-Abort on stopJob',  inject([JobService], (service: JobService) => {
    service.createJob(JobType.Download, "hi", "from", "to", "local");
    service.stopJob('hi');

    expect(electron.messageWasSent('Jobs-Abort', {id: "hi"})).toBeTruthy();
  }));
});
