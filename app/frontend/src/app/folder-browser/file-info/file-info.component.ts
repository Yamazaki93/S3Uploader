import { Component, OnInit, Input } from '@angular/core';
import { S3Item } from 'src/app/aws-s3/s3-item';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnInit {

  @Input() set item(v: S3Item) {
    this._item = v;
  }

  private _item: S3Item;
  constructor() { }

  ngOnInit() {
  }

}
