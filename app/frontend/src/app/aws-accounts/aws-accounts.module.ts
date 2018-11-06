import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AddAccountComponent } from './add-account/add-account.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    InfrastructureModule,
  ],
  declarations: [AddAccountComponent],
  exports: [AddAccountComponent],
  entryComponents: [AddAccountComponent]
})
export class AwsAccountsModule { }
