import { BrowserWindow, ipcMain, app } from "electron";
import { autoUpdater } from "electron-updater";
import { SettingsService } from "./settings";
import * as electronLog from "electron-log";

electronLog.transports.file.level = "info";
autoUpdater.autoDownload = false;
// testing only
autoUpdater.logger = electronLog;

export class UpdaterService {
    private window: BrowserWindow;
    private settings: SettingsService;

    constructor(appDir: string) {
        electronLog.transports.file.file =  `${appDir}/log.txt`;
        ipcMain.on('Updater', (event: string, arg: any) => {
            if (arg === 'commence-install-update') {
                setImmediate(() => {
                    app.removeAllListeners("window-all-closed");
                    let browserWindows = BrowserWindow.getAllWindows();
                    browserWindows.forEach((browserWindow) => {
                        browserWindow.close();
                    });
                    autoUpdater.quitAndInstall();
                });
            } else if (arg === 'commence-download') {
                autoUpdater.downloadUpdate();
            }
        });
        ipcMain.on('Updater-Check', (event: string, arg: any) => {
            this.checkUpdate();
        });
        autoUpdater.on('update-available', (info) => {
            this.window.webContents.send('Updater-Checking', { inProgress: false });
            this.window.webContents.send('Updater', { msg: 'update-available', version: info.version });
        });
        autoUpdater.on('update-not-available', () => {
            this.window.webContents.send('Updater-Checking', { inProgress: false });
            this.window.webContents.send('Updater', { msg: 'update-not-available' });
        });
        autoUpdater.on('download-progress', (progress) => {
            this.window.webContents.send('Updater', { msg: 'downloading-update', percentage: progress.percent });
        });
        autoUpdater.on('update-downloaded', () => {
            // Only enable for license changes
            // this.settings.setAppSetting('prompt-eula', true);

            this.settings.setSetting('prompt-feedback', true);
            this.window.webContents.send('Updater', { msg: 'download-complete' });
        });
        autoUpdater.on('checking-for-update', () => {
            this.window.webContents.send('Updater-Checking', { inProgress: true });
        });

    }

    public initialize(w: BrowserWindow, s: SettingsService) {
        this.window = w;
        this.settings = s;
        // check update 30 secs after startup
        let that = this;
        setTimeout(() => {
            that.checkUpdate();
        }, 30 * 1000);
    }
    public checkUpdate() {
        if (this.window) {
            autoUpdater.checkForUpdates();
        }
    }
}
