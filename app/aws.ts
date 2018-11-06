import AWS = require("aws-sdk");
import { ipcMain, BrowserWindow } from 'electron';

export class AWSService {

    private window: BrowserWindow;
    constructor() {
        ipcMain.on('AWS-InitAccount', (event: string, arg: any) => {
            if (this.testAccount(arg.account)) {
                this.window.webContents.send('AWS-AccountInitialized', {account: arg.account});
            }
        });
        ipcMain.on('AWS-TestAccount', (event: string, arg: any) => {
            if (this.testAccount(arg.account)) {
                this.window.webContents.send('AWS-CredentialFound', {account: arg.account});
            } else {
                this.window.webContents.send('AWS-CredentialNotFound', {account: arg.account});
            }
        });
    }

    public initialize(w: BrowserWindow) {
        this.window = w;
    }

    private testAccount(account: string): boolean {
        let credentials = new AWS.SharedIniFileCredentials({profile: account});
        if (credentials.accessKeyId && credentials.secretAccessKey) {
            return true;
        } else {
            return false;
        }
    }
}
