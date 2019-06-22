import AWS = require("aws-sdk");
import { ipcMain, BrowserWindow } from 'electron';
import { IAccount } from "./model";

export class AWSService {

    private window: BrowserWindow;
    constructor() {
        ipcMain.on('AWS-InitAccount', (event: string, arg: IAccount) => {
            this.testAccount(arg).then((success) => {
                if (success) {
                    this.window.webContents.send('AWS-AccountInitialized', arg);
                }
            });
        });
        ipcMain.on('AWS-TestAccount', (event: string, arg: IAccount) => {
            this.testAccount(arg).then((success) => {
                if (success) {
                    this.window.webContents.send('AWS-CredentialFound', arg);
                } else {
                    this.window.webContents.send('AWS-CredentialNotFound', arg);
                }
            });
        });
    }

    public initialize(w: BrowserWindow) {
        this.window = w;
    }

    private testAccount(account: IAccount): Promise<boolean> {
        if (account.url) {
            let s3 = new AWS.S3({
                endpoint: account.url,
                credentials: new AWS.SharedIniFileCredentials({
                    profile: account.id,
                }),
            });
            let p = new Promise<boolean>((resolve, reject) => {
                s3.listBuckets((err, data) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });
            return p;
        } else {
            let credentials = new AWS.SharedIniFileCredentials({
                profile: account.id,
            });
            if (credentials.accessKeyId && credentials.secretAccessKey) {
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        }
    }
}
