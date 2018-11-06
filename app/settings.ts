import fs = require('fs');
import uuid = require('uuid');
import { ipcMain, dialog, app, BrowserWindow } from 'electron';

export class SettingsService {

    public currentAccount: { id: string, email: string, url: string };

    private window: Electron.BrowserWindow;
    private appDir: string;
    private settingsFile: string;
    private settings: { [key: string]: string | number | boolean | string[] };
    private defaultSettings: { [key: string]: string | number | boolean | string[] } = {
        'accounts': [],
        'download-path': '',
        'prompt-feedback': true,
        'analytics': null,
        'client-id': null,
        'prompt-eula': true,
        'prompt-upload': true,
    };
    constructor(appDir: string) {
        this.appDir = appDir;
        this.settingsFile = this.appDir + 'settings.json';
        this.settings = {};

        if (ipcMain) {
            ipcMain.on('Settings-AddAccount', (event: string, arg: any) => {
                this.addAccount(arg.account);
            });
            ipcMain.on('Settings-BrowseDownloadPath', (event: string, arg: any) => {
                this.browseDownloadPath();
            });
            ipcMain.on('Settings-ResetDownloadPath', (event: string, arg: any) => {
                this.resetDownloadPath();
            });
            ipcMain.on('Settings-Set', (event: string, arg: any) => {
                this.setSetting(arg.key, arg.value);
            });
        }
    }


    public initialize(w: BrowserWindow) {
        this.window = w;
        if (fs.existsSync(this.settingsFile)) {
            this.load(this.settingsFile);
        }
        this.initSettings();
        this.window.webContents.send('Settings-SettingsChanged', this.settings);
    }

    public getSetting(key: string) {
        return this.settings[key];
    }

    public setSetting(key: string, value: string | number | boolean | string[]) {
        this.settings[key] = value;
        this.save();
        this.window.webContents.send('Settings-SettingsChanged', this.settings);
    }

    public addAccount(account: string) {
        let accounts = (this.settings.accounts as string[]);
        if (accounts.indexOf(account) === -1) {
            accounts.push(account);
            this.save();
            this.window.webContents.send('Settings-SettingsChanged', this.settings);
        }
    }

    public browseDownloadPath() {
        let selectedPath = dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (selectedPath && selectedPath.length > 0) {
            this.settings['download-path'] = selectedPath[0];
            this.save();
            this.window.webContents.send('Settings-SettingsChanged', this.settings);
        }
    }

    public resetDownloadPath() {
        this.settings['download-path'] = "";
        this.save();
        this.window.webContents.send('Settings-SettingsChanged', this.settings);
    }

    private save() {
        if (!fs.existsSync(this.appDir)) {
            fs.mkdirSync(this.appDir);
        }
        fs.writeFileSync(this.settingsFile, JSON.stringify(this.settings), 'utf8');
    }
    private load(path: string) {
        this.settings = JSON.parse(fs.readFileSync(path).toString());
    }
    private initSettings() {
        let defaultAppSettingKeys = Object.keys(this.defaultSettings);
        defaultAppSettingKeys.forEach((k) => {
            if (this.settings[k] === undefined) {
                this.settings[k] = this.defaultSettings[k];
            }
        });
        if (!this.settings['client-id']) {
            this.settings['client-id'] = uuid.v4();
        }
        this.save();
    }
}
