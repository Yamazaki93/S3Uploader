import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInfoComponent } from './file-info.component';

describe('FileInfoComponent', () => {
  let component: FileInfoComponent;
  let fixture: ComponentFixture<FileInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display file key', () => {
    component.item = {
      name: "hi.txt",
      type: 'file',
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.path-container').innerHTML).toContain('hi.txt');
  });
});
