import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@NgModule({
  imports: [
    InfrastructureModule,
    CommonModule
  ],
  declarations: []
})
export class RequestTrackingModule { }
