import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusyScreenComponent } from './busy-screen.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-host',
  template: `<app-busy-screen [spinnerSize]="size"></app-busy-screen>`
})
class HostComponent implements OnInit {

  ngOnInit(): void {
  }
}

describe('BusyScreenComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostComponent, SpinnerComponent, BusyScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

