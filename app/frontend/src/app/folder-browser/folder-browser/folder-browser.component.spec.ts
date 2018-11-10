import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FolderBrowserComponent } from './folder-browser.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';
import { AwsS3Module } from 'src/app/aws-s3/aws-s3.module';
import { S3Service } from 'src/app/aws-s3/services/s3.service';
import { ElectronService } from 'src/app/infrastructure/services/electron.service';
import { MockElectron } from 'src/app/infrastructure/mock-electron.service';
import { TreeViewModule } from 'src/app/tree-view/tree-view.module';
import { SelectionService } from 'src/app/tree-view/services/selection.service';
import { FileInfoComponent } from '../file-info/file-info.component';


const routes: Route[] = [
  {
    path: 'browse', children: [
      {
        path: '**', component: FolderBrowserComponent
      },
    ]
  },
]

const mockRoute = {
  url: new BehaviorSubject([])
};

describe('FolderBrowserComponent', () => {
  let component: FolderBrowserComponent;
  let fixture: ComponentFixture<FolderBrowserComponent>;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AwsS3Module,
        InfrastructureModule,
        TreeViewModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [FolderBrowserComponent, FileInfoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        {
          provide: ElectronService,
          useClass: MockElectron
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router) as Router;
    fixture = TestBed.createComponent(FolderBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display folder path in route', fakeAsync(() => {
    mockRoute.url.next(['hi', '123']);
    fixture.detectChanges();
    tick();
    expect(fixture.nativeElement.querySelector('#path-display').innerHTML).toContain('hi/123');
  }));
  it('should display busy screen on busy', () => {
    component.busy = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-busy-screen')).not.toBeNull();
  });
  it('should set busy to true on RefreshingObjects', () => {
    mockRoute.url.next(['hi', '123']);
    fixture.detectChanges();
    let svc = TestBed.get(S3Service) as S3Service;
    svc.RefreshingObjects.emit({ parents: ['hi', '123'] });
    fixture.detectChanges();
    expect(component.busy).toBeTruthy();
  });
  it('should set busy to false on ItemsEnumerated matching currentPath', () => {
    mockRoute.url.next(['hi', '123']);
    component.busy = true;
    let svc = TestBed.get(S3Service) as S3Service;
    svc.ItemsEnumerated.emit({
      parents: ['hi', '123'],
      items: []
    });
    fixture.detectChanges();
    expect(component.busy).toBeFalsy();
  });
  it('should display items emitted on ItemsEnumerated', () => {
    mockRoute.url.next(['hi', '123']);
    let svc = TestBed.get(S3Service) as S3Service;

    svc.ItemsEnumerated.emit({
      parents: ['hi', '123'],
      items: [
        {
          name: "23",
          type: 'file',
          size: 1048576,
        }
      ]
    });

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.items-container .item').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.item-size').innerHTML).toContain('1 MB');
    expect(fixture.nativeElement.querySelector('.item-title').innerHTML).toContain('23');
    expect(fixture.nativeElement.querySelector('.item-icon i').classList).toContain('ion-ios-document');
  });
  it('should not display items emitted on ItemsEnumerated with mismatching path', () => {
    mockRoute.url.next(['hi', '123']);
    let svc = TestBed.get(S3Service) as S3Service;

    svc.ItemsEnumerated.emit({
      parents: ['hi'],
      items: [
        {
          name: "23",
          type: 'folder',
        }
      ]
    });

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.items-container .item').length).toBe(0);
  });

  it('should get previously displayed item from s3 service', () => {
    let svc = TestBed.get(S3Service) as S3Service;
    svc.init();
    mockRoute.url.next(['hi']);
    let elec = TestBed.get(ElectronService) as MockElectron;

    elec.send('S3-ObjectListed', {
      parents: ['hi'],
      objects: [
        {
          name: "23",
          type: 'folder',
        }
      ]
    });
    fixture = TestBed.createComponent(FolderBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.items-container .item').length).toBe(1);
  });
  it('should delegate to selectionService on click when item is folder', () => {
    mockRoute.url.next(['hi', '123']);
    let svc = TestBed.get(S3Service) as S3Service;
    let sel = TestBed.get(SelectionService) as SelectionService;
    let spy = spyOn(sel, 'selectItem');
    svc.ItemsEnumerated.emit({
      parents: ['hi', '123'],
      items: [
        {
          name: "23",
          type: 'folder',
          size: 1048576,
        }
      ]
    });

    fixture.detectChanges();
    fixture.nativeElement.querySelector('.items-container .item').click();
    expect(spy).toHaveBeenCalled();
  });
  it('should request downoad on double clicking an file item', () => {
    mockRoute.url.next(['hi', '123']);
    let svc = TestBed.get(S3Service) as S3Service;
    let spy = spyOn(svc, 'requestDownload');
    svc.ItemsEnumerated.emit({
      parents: ['hi', '123'],
      items: [
        {
          name: "23",
          type: 'file',
          size: 1048576,
        }
      ]
    });

    fixture.detectChanges();
    fixture.nativeElement.querySelector('.items-container .item').dispatchEvent(new Event('dblclick'));
    expect(spy).toHaveBeenCalled();
  });
  it('should apply dragged over style on items-container when dragged over', () => {
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragenter'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.items-container').classList).toContain('dragged-over');
  });
  it('should not apply dragged over style on items-container when drag leave', () => {
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragenter'));
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragleave'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.items-container').classList).not.toContain('dragged-over');
  });
  it('should apply dragged over style on items-container when dragleave less than dragenter', () => {
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragenter'));
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragenter'));
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragleave'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.items-container').classList).toContain('dragged-over');
  });
  it('should not apply dragged over style on items-container when drop', () => {
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('dragenter'));
    fixture.nativeElement.querySelector('.items-container').dispatchEvent(new Event('drop'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.items-container').classList).not.toContain('dragged-over');
  });
  it('should not display file-info tab when nothing selected', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-file-info')).toBeNull();
  });
  it('should display file-info tab after selecting file', () => {
    mockRoute.url.next(['hi', '123']);
    let svc = TestBed.get(S3Service) as S3Service;
    svc.ItemsEnumerated.emit({
      parents: ['hi', '123'],
      items: [
        {
          name: "23",
          type: 'file',
          size: 1048576,
        }
      ]
    });

    fixture.detectChanges();
    fixture.nativeElement.querySelector('.items-container .item').dispatchEvent(new Event('click'));
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('app-file-info')).not.toBeNull(); 
  });
});
