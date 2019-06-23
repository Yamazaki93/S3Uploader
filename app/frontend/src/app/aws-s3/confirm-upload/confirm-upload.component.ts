import { Component, OnInit, EventEmitter } from '@angular/core';
import { S3Service } from '../services/s3.service';
import { UploadItem } from '../upload-item';
import { IAccount } from '../../../../../model';

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
  account: IAccount;
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
      let files = this.Items.map(_ => {
        return {
          filePath: _.path,
          newPath: this.prefix + _.newName
        }
      });
      this.s3.requestBulkUpload(this.account, this.bucket, this.prefix, files);
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
