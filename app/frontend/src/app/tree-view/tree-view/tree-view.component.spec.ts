import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TreeViewComponent } from './tree-view.component';
import { TreeItemComponent } from '../tree-item/tree-item.component';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';
import { AwsAccountsModule } from 'src/app/aws-accounts/aws-accounts.module';
import { AccountsService } from 'src/app/aws-accounts/services/accounts.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AWSAccount } from 'src/app/aws-accounts/aws-account';
import { S3Service } from 'src/app/aws-s3/services/s3.service';
import { AwsS3Module } from 'src/app/aws-s3/aws-s3.module';
import { FolderNode, BucketNode, FileNode } from '../tree-node';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectionService } from '../services/selection.service';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;
  let accs: BehaviorSubject<AWSAccount[]>;
  let accSvc: AccountsService;
  let s3Svc: S3Service;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule, AwsAccountsModule, AwsS3Module, RouterTestingModule],
      declarations: [TreeViewComponent, TreeItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    accSvc = TestBed.get(AccountsService) as AccountsService;
    s3Svc = TestBed.get(S3Service) as S3Service;
    accs = new BehaviorSubject<AWSAccount[]>([]);
    accSvc.Accounts = accs.asObservable();
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display tree correctly', fakeAsync(() => {
    component.rootNodes = [
      {
        expand: true,
        subItems: [
          {
            expand: true,
            subItems: [
              {expand: true,}
            ]
          },
          {expand: true,}
        ],
      }
    ];
    fixture.detectChanges();
    tick();
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item')[0].querySelectorAll('.sub-items > app-tree-item').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item')[0].querySelectorAll('.sub-items > app-tree-item')[0].querySelectorAll('.sub-items > app-tree-item').length).toBe(1);
  }));

  it('should add new root node on new Accounts list', () => {
    accs.next([{ id: 'hi' }]);

    expect(component.rootNodes.length).toBe(1);
  });

  it('should not add duplicated account', () => {
    accs.next([{ id: 'hi' }]);
    accs.next([{ id: 'hi' }]);

    expect(component.rootNodes.length).toBe(1);
  });
  it('should show loading screen on loading', () => {
    component.loading = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-busy-screen')).not.toBeNull();
  });
  it('should set loading to false on Accounts changed', () => {
    component.loading = true;
    accs.next([]);

    expect(component.loading).toBeFalsy();
  });
  it('should set loading to true on InitialzingAccount', () => {
    component.loading = false;
    accSvc.InitializingAccount.emit();

    expect(component.loading).toBeTruthy();
  });
  it('should add items to correct node on ItemsEnumerated', fakeAsync(() => {
    component.rootNodes = [
      {
        expand: true,
        name: 'root',
        subItems: [
          {
            expand: true,
            name: 'child1',
            subItems: [
              {expand: true,}
            ]
          },
          { name: 'child2', expand: true}
        ],
      }
    ];
    s3Svc.ItemsEnumerated.emit({
      parents: ['root', 'child2'],
      items: [
        {
          type: 'bucket',
          name: 'hi',
        }
      ]
    });

    fixture.detectChanges();
    tick();
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item')[0].querySelectorAll('.sub-items > app-tree-item').length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item')[0].querySelectorAll('.sub-items > app-tree-item')[2].querySelectorAll('.sub-items > app-tree-item').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.tree-container > app-tree-item')[0].querySelectorAll('.sub-items > app-tree-item')[2].querySelectorAll('.sub-items > app-tree-item')[0].querySelectorAll('.tree-icon i')[1].classList).toContain('ion-ios-archive');
  }));
  it('should parse folder prefix correctly on ItemsEnumerated', fakeAsync(() => {
    component.rootNodes = [
      {
        name: 'root',
        subItems: [
          {
            name: 'child1',
          },
          { name: 'child2'}
        ],
      }
    ];
    s3Svc.ItemsEnumerated.emit({
      parents: ['root', 'child2'],
      items: [
        {
          type: 'folder',
          name: 'hi',
        }
      ]
    });
    let newFolder = component.rootNodes[0].subItems[1].subItems[0] as FolderNode;
    expect(newFolder.name).toBe('hi');
    expect(newFolder.bucket).toBe('child2');
    expect(newFolder.account).toBe('root');
    expect(newFolder.prefix).toBe('');
  }));
  it('should set item enumerated to false on ItemsEnumerated', fakeAsync(() => {
    component.rootNodes = [
      {
        name: 'root',
        subItems: [
          { name: 'child1' },
          { name: 'child2' }
        ],
      }
    ];
    s3Svc.ItemsEnumerated.emit({
      parents: ['root'],
      items: [
        {
          type: 'bucket',
          name: 'child1',
        },
        {
          type: 'bucket',
          name: 'child2',
        }
      ]
    });
    s3Svc.ItemsEnumerated.emit({
      parents: ['root', 'child2'],
      items: [
        {
          type: 'folder',
          name: 'hi',
        }
      ]
    });
    let newFolder = component.rootNodes[0].subItems[1].subItems[0] as FolderNode;
    let newBucket = component.rootNodes[0].subItems[1] as BucketNode;
    expect(newFolder.enumerated).toBeFalsy();
    expect(newBucket.enumerated).toBeFalsy();
  }));
  it('should add item in correct place on ItemAdded', fakeAsync(() => {
    component.rootNodes = [
      {
        name: 'root',
        subItems: [
          { name: 'child1' },
          { name: 'child2' }
        ],
      }
    ];
    s3Svc.ItemAdded.emit({parents: ['root', 'child1'], item: { type: 'file', name: 'hi'}});
    let newFile = component.rootNodes[0].subItems[0].subItems[0] as FileNode;

    expect(newFile.name).toBe('hi');
  }));
  it('should not add duplicated item on ItemAdded', fakeAsync(() => {
    component.rootNodes = [
      {
        name: 'root',
        subItems: [
          { name: 'child1' },
          { name: 'child2' }
        ],
      }
    ];
    s3Svc.ItemAdded.emit({parents: ['root'], item: { type: 'folder', name: 'child1'}});

    expect(component.rootNodes[0].subItems.length).toBe(2);
  }));
  it('should expand item on RequestSelect emit', fakeAsync(() => {
    component.rootNodes = [
      {
        name: 'root',
        subItems: [
          new FolderNode('root', 'test', '', 'child1'),
          { name: 'child2' }
        ],
      }
    ];
    let svc = TestBed.get(SelectionService) as SelectionService;

    svc.RequestSelect.emit({path: ['root', 'child1']});
    tick();
    expect(component.rootNodes[0].subItems[0].expand).toBeTruthy();
  }));
  it('should collapse all nodes on CollapseAll emit', fakeAsync(() => {
    component.rootNodes = [
      {
        expand: true,
        name: 'root',
        subItems: [
          {
            expand: true,
            name: 'child1',
            subItems: [
              {expand: true,}
            ]
          },
          { name: 'child2', expand: true}
        ],
      }
    ];
    let svc = TestBed.get(SelectionService) as SelectionService;

    svc.CollapseAll.emit();

    expect(component.rootNodes[0].expand).toBeFalsy();
    expect(component.rootNodes[0].subItems[0].expand).toBeFalsy();
    expect(component.rootNodes[0].subItems[1].expand).toBeFalsy();
  }));
});
