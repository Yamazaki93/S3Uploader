import { S3Service } from "../aws-s3/services/s3.service";
import { RequestUploadService } from "../aws-s3/services/request-upload.service";
import { UploadItem } from "../aws-s3/upload-item";
import { IAccount } from "../../../../model";

export interface TreeNode {
    name?: string;
    subItems?: TreeNode[];
    type?: TreeNodeType;
    busy?: boolean;
    expand?: boolean;
    path?: string;
}

export enum TreeNodeType {
    Account,
    Bucket,
    Folder,
    File
}


export abstract class S3ActionNode implements TreeNode {
    name: string;
    type: TreeNodeType;
    subItems: TreeNode[] = [];
    busy = false;
    expand = false;
    get path() { return ""; }
    refresh(service: S3Service) {
    };
    action(service: S3Service) {
    };
    dropAction(service: RequestUploadService, files: UploadItem[]) {
    };
    constructor(n: string, t: TreeNodeType) {
        this.name = n;
        this.type = t;
    }
}

export class AccountNode extends S3ActionNode {
    enumerated = true;
    private url: string;
    constructor(acc: IAccount) {
        super(acc.id, TreeNodeType.Account);
        this.url = acc.url;
    }
    get path() {
        return this.name;
    }
    refresh(service: S3Service) {
        if (service) {
            this.busy = true;
            service.listBuckets({
                id: this.name,
                url: this.url,
            });
        }
    }
}

export class BucketNode extends S3ActionNode {
    account = '';
    enumerated = false;
    constructor(parent: string, n: string) {
        super(n, TreeNodeType.Bucket);
        this.account = parent;
    }
    get path() {
        return `${this.account}/${this.name}`;
    }
    dropAction(service: RequestUploadService, files: UploadItem[]) {
        if (service) {
            service.requestUpload(this.account, this.name, "", files);
        }
    }
    refresh(service: S3Service) {
        if (service) {
            this.busy = true;
            service.listObjects(this.account, this.name, '');
        }
    }
}

export class FolderNode extends S3ActionNode {
    prefix = '';
    account = '';
    bucket = '';
    enumerated = false;
    constructor(account: string, bucket: string, prefix: string, n: string) {
        super(n, TreeNodeType.Folder);
        this.prefix = prefix;
        this.account = account;
        this.bucket = bucket;
    }
    get path() {
        if (this.prefix) {
            return `${this.account}/${this.bucket}/${this.prefix}/${this.name}`;
        }
        return `${this.account}/${this.bucket}/${this.name}`;
    }
    dropAction(service: RequestUploadService, files: UploadItem[]) {
        if (service) {
            let prefixes = this.prefix ? this.prefix + '/' : ''
            service.requestUpload(this.account, this.bucket, prefixes + this.name + '/', files);
        }
    }
    refresh(service: S3Service) {
        if (service) {
            this.busy = true;
            let prefixes = this.prefix ? this.prefix + '/' : ''
            service.listObjects(this.account, this.bucket, prefixes + this.name + '/');
        }
    }
}

export class FileNode extends S3ActionNode {
    account = '';
    bucket = '';
    key = '';
    constructor(account: string, bucket: string, key: string, name: string) {
        super(name, TreeNodeType.File);
        this.key = key;
        this.account = account;
        this.bucket = bucket;
        this.subItems = undefined;
    }
    action(service: S3Service) {
        if (service) {
            service.requestDownload(this.account, this.bucket, this.key);
        }
    }
}
