import { async, ComponentFixture, TestBed, } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fire onClick once on component click', () => {
    let clickCount = 0;
    spyOn(component, 'onClick').and.callFake(() => {
      clickCount += 1;
    });
    fixture.nativeElement.querySelector('label').click();
    expect(clickCount).toBe(1);
  });
});
