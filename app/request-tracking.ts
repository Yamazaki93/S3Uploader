import { BrowserWindow, ipcMain } from "electron";
import fs = require('fs');


export interface IRequestTracked {
    trackingService: RequestTracking;
}

export enum RequestType {
    Get,
    Put,
    Copy,
    Post,
    Delete,
    List,
    Select,
}

export function LogRequest(params: { type: RequestType }): any {
    // tslint:disable-next-line:only-arrow-functions
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        let originalMethod = descriptor.value;
        descriptor.value = function() {
            let context = this;
            let args = arguments;
            if (this.trackingService) {
                let svc = (this.trackingService as RequestTracking);
                svc.logRequest(params.type);
            }
            return originalMethod.apply(context, args);
        };
        return descriptor;
    };
}

export class RequestTracking {

    private window: BrowserWindow;
    private appDir: string;
    private requestsFile: string;
    private requests: {
        S3: {
            generic: {
                [key: string]: number,
            },
        },
    };
    constructor(appDir: string) {
        this.appDir = appDir;
        this.requestsFile = this.appDir + 'requests.json';

        if (ipcMain) {
            ipcMain.on('RequestTracking-Reset', (event: string, arg: any) => {
                this.resetRequests();
            });
        }
    }

    public initialize(w: BrowserWindow) {
        this.window = w;
        this.loadExistingRequests();
        this.save();
        this.window.webContents.send('RequestTracking-Updated', {requests: this.requests});
    }

    public logRequest(type: RequestType) {
        if (!this.requests.S3.generic[type.toString()]) {
            this.requests.S3.generic[type.toString()] = 1;
        } else {
            this.requests.S3.generic[type.toString()] += 1;
        }
        this.save();
        this.window.webContents.send('RequestTracking-Updated', { requests: this.requests });
    }

    public resetRequests() {
        this.initializeEmptyRequestsObj();
        this.save();
        this.window.webContents.send('RequestTracking-Updated', { requests: this.requests });
    }

    public getRequestCount(type: RequestType): number {
        return this.requests.S3.generic[type.toString()];
    }


    private initializeEmptyRequestsObj() {
        this.requests = {
            S3: {
                generic: {},
            },
        };
        for (let item in RequestType) {
            if (!isNaN(Number(item))) {
                this.requests.S3.generic[item.toString()] = 0;
            }
        }
    }

    private loadExistingRequests() {
        if (fs.existsSync(this.requestsFile)) {
            this.requests = JSON.parse(fs.readFileSync(this.requestsFile).toString());
        } else {
            this.initializeEmptyRequestsObj();
        }
    }

    private save() {
        if (!fs.existsSync(this.appDir)) {
            fs.mkdirSync(this.appDir);
        }
        fs.writeFileSync(this.requestsFile, JSON.stringify(this.requests), 'utf8');
    }
}
