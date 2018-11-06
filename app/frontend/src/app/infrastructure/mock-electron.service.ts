export class MockElectron {
    private handlers: {
        msg: string
        cb: Function,
    }[];
    private messageSent: { name: string, payload: any }[] = [];

    constructor() {
        this.handlers = [];
    }

    private ipcRenderer = {
        send: (event, arg) => {
            this.messageSent.push({ name: event, payload: arg });
            this.handlers.forEach(h => {
                if (h.msg === event) {
                    h.cb(undefined, arg);
                }
            });
        }
    };

    onCD(event: string, handler: Function) {
        this.handlers.push({
            msg: event,
            cb: handler,
        });
    }
    send(event: string, arg: any) {
        this.ipcRenderer.send(event, arg);
    }
    messageWasSent(event: string, withPayload = undefined) {
        if (!withPayload) {
            return this.messageSent.filter(_ => _.name === event).length !== 0;
        } else {
            return this.messageSent.filter(_ => _.name === event && JSON.stringify(_.payload) === JSON.stringify(withPayload) ).length !== 0;
        }
    }
    resetMessageSent() {
        this.messageSent = [];
    }
    get available(): boolean {
        return true;
    }
}
