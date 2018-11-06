import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionComponent } from 'src/app/infrastructure/subscription-component';
import { S3Service } from 'src/app/aws-s3/services/s3.service';
import { S3Item } from 'src/app/aws-s3/s3-item';
import { SelectionService } from 'src/app/tree-view/services/selection.service';
import { collectFiles } from 'src/app/collectfiles';
import { RequestUploadService } from 'src/app/aws-s3/services/request-upload.service';
import { AnalyticsTracked } from 'src/app/infrastructure/analytics-tracked';
import { AnalyticsService } from 'src/app/infrastructure/services/analytics.service';

@Component({
  selector: 'app-folder-browser',
  templateUrl: './folder-browser.component.html',
  styleUrls: [
    '../../page.scss',
    './folder-browser.component.scss'
  ]
})
@AnalyticsTracked()
export class FolderBrowserComponent extends SubscriptionComponent implements OnInit {

  busy = false;
  private draggedOver = false;
  private dragCount = 0;
  private items = [];
  private currentPath = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private s3: S3Service,
    private upload: RequestUploadService,
    private selection: SelectionService,
    private analytics: AnalyticsService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.route.url.subscribe(segments => {
      let segmentNames = segments.join('/');
      this.currentPath = segmentNames;
      this.items = this.s3.getCachedItems(this.currentPath);
    }));
    this.recordSubscription(this.s3.RefreshingObjects.subscribe(res => {
      let segmentNames = res.parents.join('/');
      if (this.currentPath === segmentNames) {
        this.busy = true;
      }
    }));
    this.recordSubscription(this.s3.ItemsEnumerated.subscribe(result => {
      let parents = result.parents.slice();
      let parentPath = parents.join('/');
      if (parentPath === this.currentPath) {
        this.busy = false;
        this.items = result.items;
      }
    }));

  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }

  refresh() {
    let params = this.getS3Parameters();
    this.s3.listObjects(params.account, params.bucket, params.prefix);
  }

  onClick(item: S3Item, event: any) {
    if (item.type === 'folder') {
      event.preventDefault();
      event.stopPropagation();
      let newPath = this.currentPath + '/' + item.name;
      this.router.navigateByUrl(`/browse/${newPath}`);
      this.selection.selectItem(newPath);
    }
  }

  requestDownload(item: S3Item, event: any) {
    if (item.type === 'file') {
      event.preventDefault();
      event.stopPropagation();
      let params = this.getS3Parameters();
      this.s3.requestDownload(params.account, params.bucket, params.prefix + item.name);
    }
  }

  private getSizeString(item: S3Item) {
    if (item && item.size) {
      let mb = item.size / 1024 / 1024;
      let kb = item.size / 1024;
      if (mb >= 1) {
        return `${Math.round(mb * 100) / 100} MB`
      } else {
        return `${Math.round(kb * 100) / 100} KB`
      }
    } else {
      return "0 KB";
    }
  }
  private drop(event) {
    this.dragCount = 0;
    this.draggedOver = false;
    if (event.dataTransfer) {
      // for (let f of event.dataTransfer.files) {
      //   let params = this.getS3Parameters();
      //   this.s3.requestUpload(params.account, params.bucket, f.path, params.prefix);
      // }
      let promises = []
      for (let f of event.dataTransfer.items) {
        var item = f.webkitGetAsEntry();
        if (item) {
          promises.push(collectFiles(item, "", []));
        }
      }
      Promise.all(promises).then(results => {
        let items = [];
        results.forEach(r => {
          items = items.concat(r);
        });
        let params = this.getS3Parameters();
        this.upload.requestUpload(params.account, params.bucket, params.prefix, items);
      })
    }
    event.preventDefault();
    return false;
  }
  private dragEnter(event) {
    this.draggedOver = true;
    this.dragCount += 1;
    event.preventDefault();
    return false;
  }
  private dragLeave(event) {
    this.dragCount -= 1;
    if (this.dragCount <= 0) {
      this.draggedOver = false;
      this.dragCount = 0;
    }
    event.preventDefault();
    return false;
  }

  private getS3Parameters(): { account: string, bucket: string, prefix: string } {
    let path = this.currentPath.split('/');
    if (path.length >= 2) {
      let account = path[0];
      let bucket = path[1];
      let prefix = (path.slice(2, path.length)).join('/');
      return { account: account, bucket: bucket, prefix: prefix ? prefix + '/' : "" };
    } else {
      return null;
    }
  }
}
