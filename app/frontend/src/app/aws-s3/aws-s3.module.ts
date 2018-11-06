import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ConfirmUploadComponent } from './confirm-upload/confirm-upload.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InfrastructureModule,
    SimpleNotificationsModule,
    FormsModule
  ],
  declarations: [ConfirmUploadComponent],
  entryComponents: [ConfirmUploadComponent]
})
export class AwsS3Module { }
