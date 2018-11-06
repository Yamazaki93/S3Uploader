import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronService } from './services/electron.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { BusyScreenComponent } from './busy-screen/busy-screen.component';
import { DomService } from './services/dom.service';
import { TooltipDirective } from './tooltip-directive/tooltip.directive';
import { TooltipComponent } from './tooltip/tooltip.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { UpdaterService } from './services/updater.service';
import { AnalyticsConsentComponent } from './analytics-consent/analytics-consent.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ElectronService,
    DomService,
    UpdaterService
  ],
  declarations: [
    SpinnerComponent,
    BusyScreenComponent,
    TooltipDirective,
    TooltipComponent,
    CheckboxComponent,
    AnalyticsConsentComponent
  ],
  exports: [
    SpinnerComponent,
    BusyScreenComponent,
    TooltipDirective,
    CheckboxComponent
  ],
  entryComponents:[
    TooltipComponent,
    AnalyticsConsentComponent
  ]
})
export class InfrastructureModule { }
