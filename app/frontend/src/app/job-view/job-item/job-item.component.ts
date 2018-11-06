import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JobType } from '../job-type';
import { JobStatus } from '../job-status';
import { trigger, transition, query, stagger, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
  animations: [
    trigger('ngIfAnimation', [
        transition('* => void', [
            query('*', stagger('300ms', [
                animate('0.3s ease-in', keyframes([
                    style({opacity: 1}),
                    style({opacity: 0}),
                    ]))]), {optional: true}),
            ])
        ])
    ]
})
export class JobItemComponent implements OnInit {

  @Input() percentage = 50;
  @Input() set jobType(v: JobType) {
    this.setJobType(v);
  }
  @Input() source = '';
  @Input() destination = '';
  @Input() set jobStatus(v: JobStatus) {
    this.setJobStatus(v);
  }
  @Input() message = '';
  @Output() toDelete: EventEmitter<{}> = new EventEmitter();
  @Output() toOpen: EventEmitter<{}> = new EventEmitter();
  @Output() toStop: EventEmitter<{}> = new EventEmitter();
  private _jobtype = '';
  private _jobstatus = '';
  constructor() {
    this.jobType = JobType.Upload;
    this.jobStatus = JobStatus.Running;
  }

  ngOnInit() {
  }

  private setJobType(j: JobType) {
    if (j === JobType.Download) {
      this._jobtype = 'download';
    } else {
      this._jobtype = 'upload';
    }
  }

  private setJobStatus(j: JobStatus) {
    if (j === JobStatus.Completed) {
      this._jobstatus = 'c';
    } else if (j === JobStatus.Failed) {
      this._jobstatus = 'f';
    } else {
      this._jobstatus = 'r';
    }
  }
  private onDeleteJob(event) {
    this.toDelete.emit();
    event.stopPropagation();
  }
  private onOpenFileLocation(event) {
    this.toOpen.emit();
    event.stopPropagation();
  }
  private onStopJob(event) {
    this.toStop.emit();
    event.stopPropagation();
  }
}
