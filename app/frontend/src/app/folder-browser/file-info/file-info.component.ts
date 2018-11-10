import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnInit {

  @Input() key = "";
  constructor() { }

  ngOnInit() {
  }

}
