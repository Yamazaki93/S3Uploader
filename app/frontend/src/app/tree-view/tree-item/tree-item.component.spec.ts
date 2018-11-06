import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeItemComponent } from './tree-item.component';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';
import { TreeNodeType, AccountNode, FolderNode, FileNode } from '../tree-node';
import { AwsS3Module } from 'src/app/aws-s3/aws-s3.module';
import { S3Service } from 'src/app/aws-s3/services/s3.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('TreeItemComponent', () => {
  let component: TreeItemComponent;
  let fixture: ComponentFixture<TreeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule, AwsS3Module, RouterTestingModule],
      declarations: [TreeItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display name correctly', () => {
    component.item = {
      name: "HI",
    }
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.tree-content').innerHTML).toContain('HI');
  });
  
  it('should display spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-spinner')).not.toBeNull();
  });
  it('should display correct tree node type', () => {
    component.item = {
      type: TreeNodeType.Account
    }
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.tree-icon')[1].querySelector('i').classList).toContain('ion-ios-contact');
  });
  it('should delegate to s3 service if item is S3ActionNode on refresh', () => {
    let s3 = TestBed.get(S3Service) as S3Service;
    let spy = spyOn(s3, 'listBuckets');
    component.item = new AccountNode('test');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.action-button').click();

    expect(spy).toHaveBeenCalledWith('test');
  });
  it('should delegate to s3 with correct prefix on refresh folder', () => {
    let s3 = TestBed.get(S3Service) as S3Service;
    let spy = spyOn(s3, 'listObjects');
    component.item = new FolderNode('hi', 'bucket', 'test', 'folder');

    fixture.detectChanges();
    fixture.nativeElement.querySelector('.action-button').click();

    expect(spy).toHaveBeenCalledWith('hi', 'bucket', 'test/folder/');
  });
  it('should set enumerated to true on first expand when item is folder', () => {
    let s3 = TestBed.get(S3Service) as S3Service;
    let spy = spyOn(s3, 'listObjects');
    component.item = new FolderNode('hi', 'bucket', 'test/', 'folder');

    fixture.detectChanges();
    fixture.nativeElement.querySelector('.tree-item .tree-icon > div').click();

    expect((component.item as FolderNode).enumerated).toBeTruthy();
  });

  it('should show dragged-over class on drag over when item is droppable', () => {
    let target = fixture.nativeElement.querySelector('.drop-target');
    component.item = new FolderNode('hi', 'buckt', 'test', 'folder');
    target.dispatchEvent(new Event('dragenter'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.drop-hint').classList).toContain('dragged-over');
  });

  it('should not show dragged-over class on drag leave when item is droppable', () => {
    let target = fixture.nativeElement.querySelector('.drop-target');
    component.item = new FolderNode('hi', 'buckt', 'test', 'folder');
    target.dispatchEvent(new Event('dragenter'));
    target.dispatchEvent(new Event('dragleave'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.drop-hint').classList).not.toContain('dragged-over');
  });
  it('should not show dragged-over class on drag over when item is not droppable', () => {
    let target = fixture.nativeElement.querySelector('.drop-target');
    component.item = new FileNode('hi', 'hi123', 'test.txt', 'test');
    target.dispatchEvent(new Event('dragenter'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.drop-hint').classList).not.toContain('dragged-over');
  });
  it('should not show dragged-over class after drop when item is droppable', () => {
    let target = fixture.nativeElement.querySelector('.drop-target');
    component.item = new FolderNode('hi', 'buckt', 'test', 'folder');
    target.dispatchEvent(new Event('dragenter'));
    target.dispatchEvent(new Event('drop'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.drop-hint').classList).not.toContain('dragged-over');
  });
  it('should navigate to browse route on click when item is Folder', () => {
    let router = TestBed.get(Router) as Router;
    component.item = new FolderNode('hi', 'hi', 'hi', 'hi');
    let spy = spyOn(router, 'navigateByUrl');

    fixture.nativeElement.querySelector('.tree-item').click();

    expect(spy).toHaveBeenCalled();
  });
  it('should navigate to browse route on click when item is File', () => {
    let router = TestBed.get(Router) as Router;
    component.item = new FileNode('hi', 'hi', 'hi', 'hi');
    let spy = spyOn(router, 'navigateByUrl');

    fixture.nativeElement.querySelector('.tree-item').click();

    expect(spy).not.toHaveBeenCalled();
  });
});
