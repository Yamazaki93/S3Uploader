import { Component, OnInit } from '@angular/core';
import { TreeNode, TreeNodeType, AccountNode, BucketNode, FolderNode, FileNode } from '../tree-node';
import { AccountsService } from 'src/app/aws-accounts/services/accounts.service';
import { SubscriptionComponent } from 'src/app/infrastructure/subscription-component';
import { S3Service } from 'src/app/aws-s3/services/s3.service';
import { S3Item } from 'src/app/aws-s3/s3-item';
import { SelectionService } from '../services/selection.service';
import { AnalyticsTracked } from 'src/app/infrastructure/analytics-tracked';
import { AnalyticsService } from 'src/app/infrastructure/services/analytics.service';
import { IAccount } from '../../../../../model';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
@AnalyticsTracked("TreeViewComponent")
export class TreeViewComponent extends SubscriptionComponent implements OnInit {

  rootNodes: TreeNode[] = []
  loading = true;
  constructor(
    private awsAccounts: AccountsService,
    private s3Service: S3Service,
    private selection: SelectionService,
    private analytics: AnalyticsService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.awsAccounts.Accounts.subscribe(accs => {
      accs.forEach(a => {
        if (this.rootNodes.filter(_ => _.name === a.id).length === 0) {
          this.addAccount(a);
        }
      });
      this.loading = false;
    }));
    this.recordSubscription(this.awsAccounts.InitializingAccount.subscribe(_ => {
      this.loading = true;
    }));
    this.recordSubscription(this.s3Service.ItemsEnumerated.subscribe(result => {
      let parent = this.getNode({ subItems: this.rootNodes }, result.parents.slice());
      if (parent) {
        let node = parent.node;
        node.busy = false;
        node.subItems = [];
        node.subItems = result.items.map(_ => {
          return this.convertS3ItemToTreeNode(result.parents, _);
        });
        if(node.subItems.length) {
          this.sortNodes(node.subItems);
          node.expand = true;
        }
      }
    }));
    this.recordSubscription(this.s3Service.ItemAdded.subscribe(result => {
      let parent = this.getNode({ subItems: this.rootNodes }, result.parents.slice()).node;
      if (parent) {
        let existing = parent.subItems;
        let newNode = this.convertS3ItemToTreeNode(result.parents, result.item);
        if(existing && existing.filter(_ => _.name === newNode.name).length === 0) {
          parent.subItems.push(newNode);
          this.sortNodes(parent.subItems);
        } else if(!existing) {
          parent.subItems = [newNode];
        }
      }
    }));
    this.recordSubscription(this.selection.RequestSelect.subscribe(result => {
      let nodes = this.getNode({ subItems: this.rootNodes }, result.path.slice());
      let node = nodes.node as FolderNode;
      let parents = nodes.parents;
      if(node) {
        parents.forEach(n => {
          n.expand = true;
        });
        node.expand = true;
        if(!node.enumerated) {
          node.refresh(this.s3Service);
          node.enumerated = true;
        }
      }
    }));
    this.recordSubscription(this.selection.CollapseAll.subscribe(() => {
      this.rootNodes.forEach(rn => {
        this.collapseAll(rn);
      });
    }));
  }

  private collapseAll(node: TreeNode) {
    if(node.subItems) {
      node.subItems.forEach(n => {
        this.collapseAll(n);
      });
    }
    node.expand = false;
  }

  private convertS3ItemToTreeNode(parents: string[], item: S3Item): TreeNode {
    let node = {
      name: item.name,
      type: undefined
    }
    if(item.type === 'bucket') {
      return new BucketNode(parents[0], item.name);
    } else if(item.type === 'folder') {
      let prefixes = parents.slice();
      prefixes.splice(0, 2);
      return new FolderNode(parents[0], parents[1], prefixes.join('/'), item.name);
    } else if(item.type ==='file') {
      let prefixes = parents.slice();
      prefixes.splice(0, 2);
      prefixes.push(item.name);
      return new FileNode(parents[0], parents[1], prefixes.join('/'), item.name);
    }
    return node;
  }

  private addAccount(a: IAccount) {
    let node = new AccountNode(a);
    this.rootNodes.push(node);
    node.refresh(this.s3Service);
  }

  private listAccountBuckets(a: IAccount) {
    this.s3Service.listBuckets(a);
  }

  private getNode(start: TreeNode, path: string[], parents: TreeNode[] = []): {node: TreeNode, parents: TreeNode[]} {
    if (!path.length) {
      return {node: start, parents: parents};    
    } else {
      let itemName = path.shift();
      if (!itemName) {
        return {node: start, parents: parents};    
      } else if(!start.subItems) {
        return null;
      } else {
        let nextItem;
        for (let i = 0; i < start.subItems.length; i++) {
          if (start.subItems[i].name && start.subItems[i].name === itemName) {
            nextItem = start.subItems[i];
            break;
          }
        }
        if (!nextItem) {
          return null;
        } else {
          parents.push(nextItem);
          return this.getNode(nextItem, path, parents);
        }
      }
    }
  }

  private sortNodes(nodes: TreeNode[]) {
    nodes.sort((a, b) => {
      if(a.name > b.name) {
        return 1;
      } else if(a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
