import { Component, OnInit } from '@angular/core';
import { DomService } from '../infrastructure/services/dom.service';
import { AddAccountComponent } from '../aws-accounts/add-account/add-account.component';
import { SelectionService } from '../tree-view/services/selection.service';
import { JobService } from '../job-view/job.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  constructor(
    private dom: DomService,
    private sel: SelectionService,
    private jobs: JobService
  ) { }

  ngOnInit() {
  }

  openAddAccount(){
    let elem = this.dom.appendComponentToBody(AddAccountComponent);
    elem.instance.toClose.subscribe(_ => {
      elem.destroy();
    });
  }
  onCollapseAll() {
    this.sel.CollapseAll.emit();
  }
  clearNotRunningJobs() {
    this.jobs.clearNotRunningJobs();
  }
}
