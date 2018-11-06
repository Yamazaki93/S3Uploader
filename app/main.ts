import { app, BrowserWindow, ipcMain, shell, Menu } from "electron";
import * as path from "path";
import * as url from "url";
import os = require('os');
import { SettingsService } from "./settings";
import { AWSService } from "./aws";
import { S3Service } from "./s3";
import { RequestTracking } from "./request-tracking";
import { JobManager } from "./job-manager";
import { HistoryStorage } from "./history-storage";
import { UpdaterService } from "./updater";
import { AnalyticsService } from "./analytics";

let homeDir = os.homedir();
let appDir = homeDir + "/Palladium/";
import {GlobalEnv} from './environments/environment';

let mainWindow: Electron.BrowserWindow;
let settings: SettingsService;
let aws: AWSService;
let s3: S3Service;
let tracking: RequestTracking;
let jobs: JobManager;
let histories: HistoryStorage;
let updater: UpdaterService;
let analytics: AnalyticsService;

ipcMain.on('Application-Initialize', (event: string, arg: any) => {
    initializeApp();
});

ipcMain.on('Application-OpenExternal', (event: string, arg: { address: string }) => {
    shell.openExternal(arg.address);
});

ipcMain.on('Application-ShowInFolder', (event: string, arg: { path: string }) => {
    shell.showItemInFolder(arg.path);
});

ipcMain.on('Application-OpenSecondary', (evetn: string, arg: any) => {
    openSecondaryWindow(arg.address);
});

function openSecondaryWindow(address: string) {
    let aboutWindow = new BrowserWindow({
        height: 600,
        width: 800,
    });
    aboutWindow.setMenu(null);
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, address),
        protocol: "file:",
        slashes: true,
    }));
}


function initializeApp() {
    settings.initialize(mainWindow);
    tracking.initialize(mainWindow);
    aws.initialize(mainWindow);
    jobs.initialize(mainWindow);
    s3.initialize(mainWindow, tracking, jobs);
    histories.initialize(mainWindow);
    updater.initialize(mainWindow, settings);
    analytics.initialize(mainWindow, settings);
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
    });

    //   const mainMenu = Menu.buildFromTemplate(MainMenuBuilder.buildMenu());
    //   Menu.setApplicationMenu(mainMenu);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../app/frontend/dist/index.html"),
        protocol: "file:",
        slashes: true,
    }));
    mainWindow.maximize();
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    settings = new SettingsService(appDir);
    aws = new AWSService();
    s3 = new S3Service();
    tracking = new RequestTracking(appDir);
    jobs = new JobManager();
    histories = new HistoryStorage(appDir);
    updater = new UpdaterService(appDir);
    analytics = new AnalyticsService(GlobalEnv.VERSION, GlobalEnv.GA_TRACKING_ID);
    createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
