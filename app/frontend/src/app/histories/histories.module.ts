import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryListComponent } from './history-list/history-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HistoryListComponent],
  exports: [HistoryListComponent]
})
export class HistoriesModule { }
