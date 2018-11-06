import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() disabled = false;
  @Input() set checkedValue(v) {
    if (this._checked !== v) {
      this.checkedValueChange.emit(v);
      this._checked = v;
    }
  }
  get checkedValue() {
    return this._checked;
  }
  @Output() checkedValueChange = new EventEmitter<boolean>();
  private _checked = false;
  constructor() {
  }

  ngOnInit() {
  }

  onClick($event) {
    if (!this.disabled) {
      this.checkedValue = !(this.checkedValue);
      $event.stopPropagation();
      $event.preventDefault();
    }
  }
}
