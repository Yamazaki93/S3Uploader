import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';
import { SubscriptionComponent } from '../../infrastructure/subscription-component';
import { trigger, transition, stagger, animate, keyframes, style, query } from '@angular/animations';
import { Job } from '../job';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  animations: [
    trigger('ngIfAnimation', [
      transition('void => *', [
        query(':self', stagger('100ms', [
            animate('0.3s ease-in', keyframes([
                style({opacity: 0}),
                style({opacity: 1}),
                ]))]), {optional: true}),
        ]),
        transition('* => void', [
            query(':self', stagger('500ms', [
                animate('0.3s ease-in', keyframes([
                    style({opacity: 1}),
                    style({opacity: 0}),
                    ]))]), {optional: true}),
            ])
        ])
    ]
})
export class JobListComponent extends SubscriptionComponent implements OnInit {

  private jobList = []
  constructor(
    private jobs: JobService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.jobs.Jobs.subscribe(js => {
      this.jobList = js;
    }));
  }

  private trackJob(index: number, elem: Job) {
    return elem ? elem.id : null;
  }
  private deleteJob(j: Job) {
    this.jobList.splice(this.jobList.indexOf(j), 1);
  }
  private openJobFileLication(j: Job) {
    this.jobs.openJobFileLocation(j.id);
  }
  private stopJob(j: Job) {
    this.jobs.stopJob(j.id);
  }
}
