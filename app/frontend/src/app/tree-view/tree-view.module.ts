import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { TreeItemComponent } from './tree-item/tree-item.component';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    InfrastructureModule,
    RouterModule
  ],
  declarations: [TreeViewComponent, TreeItemComponent],
  exports: [TreeViewComponent]
})
export class TreeViewModule { }
