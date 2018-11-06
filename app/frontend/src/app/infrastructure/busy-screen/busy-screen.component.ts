import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-busy-screen',
  templateUrl: './busy-screen.component.html',
  styleUrls: ['./busy-screen.component.scss']
})
export class BusyScreenComponent implements OnInit {

  @Input() spinnerSize = '40';
  constructor() { }

  ngOnInit() {
  }

}
