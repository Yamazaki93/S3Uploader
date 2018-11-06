import { Component, OnInit, EventEmitter } from '@angular/core';
import { S3Service } from '../services/s3.service';
import { UploadItem } from '../upload-item';

@Component({
  selector: 'app-confirm-upload',
  templateUrl: './confirm-upload.component.html',
  styleUrls: [
    '../../infrastructure/prompt.scss',
    './confirm-upload.component.scss'
  ]
})
export class ConfirmUploadComponent implements OnInit {

  isValid = true;
  account = "";
  bucket = "";
  prefix = "";
  promptSetting = true;
  Items: UploadItem[] = [];
  toClose: EventEmitter<{}> = new EventEmitter();
  constructor(
    private s3: S3Service
  ) { }

  ngOnInit() {
  }

  close() {
    this.toClose.emit();
  }

  upload() {
    if (this.account && this.bucket) {
      this.Items.forEach(item => {
        this.s3.requestUpload(this.account, this.bucket, item.path, this.prefix + item.newName);
      })
    }
    this.toClose.emit();
  }
  private removeItem(item: UploadItem) {
    this.Items.splice(this.Items.indexOf(item), 1);
  }
  private location() {
    return [this.account, this.bucket, this.prefix].join('/');
  }
  private onTextChange() {
    if (this.Items.length === 0) {
      this.isValid = false;
    } else {
      this.Items.forEach(it => {
        if (!it.newName) {
          this.isValid = false;
        } else if (this.Items.filter(_ => _.newName === it.newName).length > 1) {
          this.isValid = false;
        }
      });
    }
  }
  private changePromptSetting(val: boolean) {
    this.s3.changeUploadPromptSetting(val);
  }
}
