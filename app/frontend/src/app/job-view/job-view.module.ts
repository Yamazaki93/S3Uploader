import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from './job-list/job-list.component';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { JobItemComponent } from './job-item/job-item.component';

@NgModule({
  imports: [
    CommonModule,
    InfrastructureModule
  ],
  declarations: [JobListComponent, JobItemComponent],
  exports: [JobListComponent]
})
export class JobViewModule { }
