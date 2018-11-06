import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ConfirmUploadComponent } from './confirm-upload.component';
import { FormsModule } from '@angular/forms';
import { InfrastructureModule } from 'src/app/infrastructure/infrastructure.module';
import { UploadItem } from '../upload-item';

describe('ConfirmUploadComponent', () => {
  let component: ConfirmUploadComponent;
  let fixture: ComponentFixture<ConfirmUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule, FormsModule],
      declarations: [ConfirmUploadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUploadComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display all upload items', () => {
    component.Items = [
      new UploadItem({ name: "hi", path: "hi" }),
      new UploadItem({ name: "hi123", path: "hi" }),
    ]
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('form input[type="text"]').length).toBe(2);
  })
  it('should check all item validity on text change', fakeAsync(() => {
    component.Items = [
      new UploadItem({ name: "hi", path: "hi" }),
      new UploadItem({ name: "hi123", path: "hi" }),
    ]
    fixture.detectChanges();
    tick();
    let element = fixture.nativeElement.querySelector('form input[type="text"]');
    element.value = "";
    element.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(component.isValid).toBeFalsy();
  }));
});
