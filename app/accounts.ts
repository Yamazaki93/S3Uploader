import fs = require('fs');
import * as path from 'path';
import { ipcMain, BrowserWindow } from 'electron';
import { IAccount } from './model';

export class AccountsService {
    private accountsFile: string;
    private accounts: IAccount[] = [];
    private window: BrowserWindow;
    constructor(
        private appDir: string,
    ) {
        this.accountsFile = path.join(appDir, 'accounts.json');
        ipcMain.on('Accounts-AddAccount', (event: string, arg: any) => {
            this.AddAccount(arg);
        });
    }
    public initialize(window: BrowserWindow) {
        this.window = window;
        this.LoadAccounts();
    }
    public AddAccount(acc: IAccount) {
        if (!this.accounts.find((_) => _.id === acc.id) && acc.id) {
            this.accounts.push(acc);
            this.SaveAccoutns();
            this.window.webContents.send('Accounts-AccountAdded', acc);
        }
    }
    public LoadAccounts() {
        if (fs.existsSync(this.accountsFile)) {
            this.accounts = JSON.parse(fs.readFileSync(this.accountsFile).toString());
            this.window.webContents.send('Accounts-AccountsLoaded', this.accounts);
        }
    }
    public SaveAccoutns() {
        if (!fs.existsSync(this.appDir)) {
            fs.mkdirSync(this.appDir);
        }
        fs.writeFileSync(this.accountsFile, JSON.stringify(this.accounts), 'utf8');
    }
}
