import { Component, OnInit, Input } from '@angular/core';
import { TreeNode, TreeNodeType, S3ActionNode, BucketNode, FolderNode, AccountNode, FileNode } from '../tree-node';
import { S3Service } from 'src/app/aws-s3/services/s3.service';
import { Router } from '@angular/router';
import { RequestUploadService } from 'src/app/aws-s3/services/request-upload.service';
import { collectFiles } from 'src/app/collectfiles';
import { SubscriptionComponent } from 'src/app/infrastructure/subscription-component';

@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.scss']
})
export class TreeItemComponent extends SubscriptionComponent implements OnInit {

  @Input() item: TreeNode
  @Input() loading = false;
  private draggedOver = false;
  private _nodetype = '';
  private dragCount = 0;

  constructor(
    private s3: S3Service,
    private upload: RequestUploadService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.s3.RefreshingObjects.subscribe(res => {
      if(this.item && res.parents.join('/') === this.item.path) {
        this.item.busy = true;
      }
    }));
  }

  private onRefresh(event) {
    if ((this.item as S3ActionNode)) {
      this.item.subItems = [];
      (this.item as S3ActionNode).refresh(this.s3);
    }
    event.stopPropagation();
  }

  private onDblClick(event) {
    event.stopPropagation();
    if ((this.item as S3ActionNode)) {
      (this.item as S3ActionNode).action(this.s3);
    }
  }

  private onClick(event) {
    if (this.item instanceof BucketNode || this.item instanceof FolderNode) {
      let node = this.item as (BucketNode | FolderNode);
      node.expand = true;
      if (node && !node.enumerated) {
        node.refresh(this.s3);
        node.enumerated = true;
      }
      this.router.navigateByUrl(`/browse/${node.path}`);
    }
    event.stopPropagation();
  }

  private onExpand(event) {
    if (this.item) {
      this.item.expand = !this.item.expand;
      let node = this.item as (BucketNode | FolderNode | AccountNode);
      if (node && !node.enumerated) {
        node.refresh(this.s3);
        node.enumerated = true;
      }
    }
    event.stopPropagation();
  }

  private getNodeType() {
    if (this.item && this.item.type !== undefined) {
      if (this.item.type === TreeNodeType.Account) {
        return 'a';
      } else if (this.item.type === TreeNodeType.Bucket) {
        return 'b';
      } else if (this.item.type === TreeNodeType.Folder) {
        return 'f';
      } else {
        return 'fi';
      }
    } else {
      return 'c';
    }
  }

  private drop(event) {
    if (this.isDroppable()) {
      this.dragCount = 0;
      this.draggedOver = false;
      if (event.dataTransfer) {
        let node = this.item as (BucketNode | FolderNode);
        let promises = [];
        for (let f of event.dataTransfer.items) {
          var item = f.webkitGetAsEntry();
          if (item) {
            promises.push(collectFiles(item, "", []));
          }
        }
        Promise.all(promises).then(results => {
          let items = [];
          results.forEach(r => {
            items =items.concat(r);
          });
          node.dropAction(this.upload, items);
        })
      }
    }
    event.preventDefault();
    return false;
  }
  private dragEnter(event) {
    if (this.isDroppable()) {
      this.draggedOver = true;
      this.dragCount += 1;
    }
    event.preventDefault();
    return false;
  }
  private dragLeave(event) {
    if (this.isDroppable()) {
      this.dragCount -= 1;
      if (this.dragCount <= 0) {
        this.draggedOver = false;
        this.dragCount = 0;
      }
    }
    event.preventDefault();
    return false;
  }
  private isDroppable(): boolean {
    return this.item && (this.item.type === TreeNodeType.Bucket || this.item.type === TreeNodeType.Folder);
  }
}
