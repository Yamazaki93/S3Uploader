import { BrowserWindow, ipcMain } from "electron";
import fs = require('fs');

export class HistoryStorage {
    private window: BrowserWindow;
    private appDir: string;
    private historyFile: string;
    private historyEntries: Array<{type: string, name: string, time: Date, status: string}>;
    constructor(appDir: string) {
        this.appDir = appDir;
        this.historyFile = this.appDir + 'history.json';
        this.historyEntries = [];
        if (ipcMain) {
            ipcMain.on('History-Add', (event: string, arg: any) => {
                this.addEntry(arg.type, arg.name, arg.status);
            });
            ipcMain.on('History-Clear', (event: string, arg: any) => {
                this.clearHistory();
            });
        }
    }

    public initialize(w: BrowserWindow) {
        this.window = w;
        if (fs.existsSync(this.historyFile)) {
            this.load(this.historyFile);
        }
        this.save();
        this.window.webContents.send('History-Changed', {histories: this.getHistory()});
    }
    public clearHistory() {
        this.historyEntries = [];
        this.save();
        this.window.webContents.send('History-Changed', {histories: this.getHistory()});
    }
    public getHistory() {
        return this.historyEntries;
    }
    public addEntry(type: string, name: string, status: string) {
        this.historyEntries.unshift(
            {
                type,
                name,
                status,
                time: new Date(),
            },
        );
        if (this.historyEntries.length > 10) {
            this.historyEntries.splice(10, this.historyEntries.length - 10);
        }
        this.save();
        this.window.webContents.send('History-Changed', {histories: this.getHistory()});
    }
    private load(path: string) {
        this.historyEntries = JSON.parse(fs.readFileSync(path).toString());
    }
    private save() {
        if (!fs.existsSync(this.appDir)) {
            fs.mkdirSync(this.appDir);
        }
        fs.writeFileSync(this.historyFile, JSON.stringify(this.historyEntries), 'utf8');
    }
}
