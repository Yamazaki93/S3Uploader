import { BrowserWindow, ipcMain } from "electron";
import AWS = require("aws-sdk");

export class JobManager {

    private jobs: { [key: string]: AWS.Request<any, any> | AWS.S3.ManagedUpload } = {};
    private jobsProgress: { [key: string]: number } = {};
    private window: BrowserWindow;
    constructor() {

        if (ipcMain) {
            ipcMain.on('Jobs-Abort', (event: string, arg: any) => {
                this.stopJob(arg.id);
            });
        }
    }

    public initialize(w: BrowserWindow) {
        this.window = w;
    }

    // tslint:disable-next-line:max-line-length
    public addJob(id: string, type: string, request: AWS.Request<any, any>, from: string, to: string, localFile: string) {
        this.jobs[id] = request;
        this.window.webContents.send('Jobs-Created', { id, type, from, to, localFile });
        if (request) {
            request.on('success', () => {
                this.completeJob(id);
            });
            request.on('error', (resp) => {
                this.failJob(id, resp);
            });
            if (type === 'download') {
                request.on('httpDownloadProgress', (p) => {
                    this.reportProgress(id, p.loaded, p.total);
                });
            } else {
                request.on('httpUploadProgress', (p) => {
                    this.reportProgress(id, p.loaded, p.total);
                });
            }
        }
    }


    // tslint:disable-next-line:max-line-length
    public addManagedUploadJob(id: string, type: string, request: AWS.S3.ManagedUpload, from: string, to: string, localFile: string): Promise<any> {
        this.jobs[id] = request;
        this.window.webContents.send('Jobs-Created', { id, type, from, to, localFile });
        if (request) {
            request.on('httpUploadProgress', (p) => {
                this.reportProgress(id, p.loaded, p.total);
            });
            return request.promise().then((data) => {
                this.completeJob(id);
                return Promise.resolve(data);
            }, (err) => {
                this.failJob(id, err);
                return Promise.reject(err);
            });
        }
        return Promise.reject("Attempt to add job with no request");
    }

    public completeJob(id: string) {
        if (this.jobs[id] !== undefined) {
            this.window.webContents.send('Jobs-Completed', { id });
            delete this.jobs[id];
        }
    }
    public failJob(id: string, error: AWS.AWSError) {
        if (this.jobs[id] !== undefined) {
            this.window.webContents.send('Jobs-Failed', { id, error: error.message });
            delete this.jobs[id];
            delete this.jobsProgress[id];
        }
    }
    public reportProgress(id: string, loaded: number, total: number) {
        if (this.jobs[id] !== undefined) {
            let percentage =  Math.round((loaded / total) * 100);
            if (!this.jobsProgress[id] || this.jobsProgress[id] < percentage) {
                this.jobsProgress[id] = percentage;
                this.window.webContents.send('Jobs-Progress', { id, percentage });
            }
        }
    }
    public stopJob(id: string) {
        if (this.jobs[id] !== undefined) {
            this.jobs[id].abort();
        }
    }
}
