import { ipcMain, BrowserWindow } from 'electron';
import Analytics from 'electron-google-analytics';
import { SettingsService } from './settings';

export class AnalyticsService {
    private window: BrowserWindow;
    private settings: SettingsService;

    private analytics: any;
    private clientID = "";
    private appVersion = "NA";
    private trackingID = "";
    private appName = "S3Uploader";
    constructor( version: string, tid: string) {
        this.appVersion = version;
        this.trackingID = tid;
        ipcMain.on('Analytics-OptChanged', (event: string, arg: { enabled: boolean }) => {
            this.initializeAnalytics(arg.enabled);
        });
        ipcMain.on('Analytics-SetUserAgent', (event: string, arg: {agent: string}) => {
            this.setUserAgent(arg.agent);
        });
        ipcMain.on('Analytics-ScreenView', (event: string, arg: { screenName: string }) => {
            this.screenView(arg.screenName);
        });
        ipcMain.on('Analytics-Exception', (event: string, arg: { exceptionName: string, fatal: boolean }) => {
            this.exception(arg.exceptionName, arg.fatal);
        });
        ipcMain.on('Analytics-Event', (event: string, arg: { category: string, action: string }) => {
            this.logEvent(arg.category, arg.action);
        });
    }

    public initialize(window: BrowserWindow, settings: SettingsService) {
        this.window = window;
        this.settings = settings;
    }

    public initializeAnalytics(enabled: boolean) {
        if (!enabled) {
            this.analytics = undefined;
        } else {
            this.analytics = new Analytics(this.trackingID);
            this.analytics.set('aip', 1);
            this.clientID = this.settings.getSetting('client-id').toString();
            this.analytics.set('cid', this.clientID);
        }
    }

    public setUserAgent(agent: string) {
        if (this.analytics && this.trackingID) {
            this.analytics.set('ua', agent);
        }
    }

    public screenView(screenName: string) {
        if (this.analytics && this.trackingID) {
            // tslint:disable-next-line:max-line-length
            this.analytics.screen(this.appName, this.appVersion, 'com.rohdiumcode.s3uploader', 'com.rhodiumcode.s3uploader', screenName);
        }
    }

    public exception(desc: string, fatal = false) {
        if (this.analytics && this.trackingID) {
            this.analytics.exception(desc, fatal ? 1 : 0);
        }
    }

    public logEvent(category: string, action: string) {
        if (this.analytics && this.trackingID) {
            this.analytics.event(category, action);
        }
    }
}
