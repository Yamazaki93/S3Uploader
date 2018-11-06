import sinon = require('sinon');
import fs = require('fs');
import uuid = require('uuid');
import path = require('path');
import assert = require('assert');
import rimraf = require('rimraf');
import { IRequestTracked, RequestTracking, LogRequest, RequestType } from '../../request-tracking';

describe("LogRequest decorator", () => {
    let tempFolder = path.join(__dirname, "../../tmp");
    before(() => {
        if (fs.existsSync(tempFolder)) {
            rimraf.sync(tempFolder);
        }
        fs.mkdirSync(tempFolder);
    });
    after(() => {
        if (fs.existsSync(tempFolder)) {
            rimraf.sync(tempFolder);
        }
    });
    it('should delegate to RequestTracking service of the object', () => {
        let obj = new TestObject();
        obj.trackingService = new RequestTracking(tempFolder);
        let window = {
            webContents: {
                // tslint:disable-next-line:no-empty
                send(event: string, arg: any) { },
            },
        };
        obj.trackingService.initialize(window as any);
        let spy = sinon.spy(obj.trackingService, 'logRequest');

        obj.testMethod();
        assert(spy.calledOnce);
        assert(spy.args[0][0] === RequestType.Post);
    });
});

describe('RequestTracking', () => {
    let tempFolder = path.join(__dirname, "../../tmp");
    let testFolder = '';
    let mockWindow;
    let sendSpy;
    let requestFile = '';
    let sut: RequestTracking;
    before(() => {
        if (fs.existsSync(tempFolder)) {
            rimraf.sync(tempFolder);
        }
        fs.mkdirSync(tempFolder);
    });

    beforeEach(() => {
        let window = {
            webContents: {
                // tslint:disable-next-line:no-empty
                send(event: string, arg: any) {},
            },
        };
        sendSpy = sinon.spy(window.webContents, 'send');
        mockWindow = window;
        let id = uuid.v4();
        testFolder = path.join(tempFolder, `${id}/` );
        fs.mkdirSync(testFolder);
        requestFile = path.join(testFolder, 'requests.json');

        sut = new RequestTracking(testFolder);
    });
    afterEach(() => {
        rimraf.sync(testFolder);
    });
    after(() => {
        if (fs.existsSync(tempFolder)) {
            rimraf.sync(tempFolder);
        }
    });
    it('should initialize requests file on initialization if not exists', () => {
        sut.initialize(mockWindow);
        assert(fs.existsSync(requestFile));
        assert.equal(JSON.parse(fs.readFileSync(requestFile).toString()).S3.generic[RequestType.Post.toString()], 0);
    });
    it('should load existing requests from file on initialization', () => {
        let requests = {
            S3: {
                generic: {
                },
            },
        };
        requests.S3.generic[RequestType.Post.toString()] = 12;
        fs.writeFileSync(requestFile, JSON.stringify(requests), 'utf-8');
        sut.initialize(mockWindow);

        assert.equal(sut.getRequestCount(RequestType.Post), 12);
    });
    it('should track requests on logRequest', () => {
        sut.initialize(mockWindow);
        sut.logRequest(RequestType.Post);
        assert.equal(sut.getRequestCount(RequestType.Post), 1);
        assert.equal(JSON.parse(fs.readFileSync(requestFile).toString()).S3.generic[RequestType.Post.toString()], 1);
    });
    it('should increment existing request count on logRequest', () => {
        sut.initialize(mockWindow);
        sut.logRequest(RequestType.Post);
        sut.logRequest(RequestType.Post);
        assert.equal(sut.getRequestCount(RequestType.Post), 2);
        assert.equal(JSON.parse(fs.readFileSync(requestFile).toString()).S3.generic[RequestType.Post.toString()], 2);
    });
    it('should reset requests on resetRequest', () => {
        sut.initialize(mockWindow);
        sut.logRequest(RequestType.Post);
        sut.logRequest(RequestType.Post);
        sut.resetRequests();

        assert.equal(sut.getRequestCount(RequestType.Post), 0);
        assert.equal(JSON.parse(fs.readFileSync(requestFile).toString()).S3.generic[RequestType.Post.toString()], 0);
    });

    it('should publish RequestTracking-Updated on logRequest', () => {
        sut.initialize(mockWindow);
        sendSpy.resetHistory();
        sut.logRequest(RequestType.Post);

        assert(sendSpy.args[0][0] === 'RequestTracking-Updated');
    });
    it('should publish RequestTracking-Updated on resetRequest', () => {
        sut.initialize(mockWindow);
        sut.logRequest(RequestType.Post);
        sendSpy.resetHistory();
        sut.resetRequests();

        assert(sendSpy.args[0][0] === 'RequestTracking-Updated');
    });
    it('should publish RequestTracking-Updated on initialization', () => {
        sut.initialize(mockWindow);

        assert(sendSpy.args[0][0] === 'RequestTracking-Updated');
    });
});

class TestObject implements IRequestTracked {
    public trackingService: RequestTracking;
    // tslint:disable-next-line:no-empty
    constructor() {
    }
    @LogRequest({type: RequestType.Post})
    // tslint:disable-next-line:no-empty
    public testMethod() {
    }
}
