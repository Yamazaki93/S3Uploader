import { JobManager } from '../../job-manager';
import AWS = require("aws-sdk");
import sinon = require('sinon');
import assert = require('assert');

describe('JobManager', () => {
    let sut: JobManager;
    let mockWindow;
    let sendSpy: sinon.SinonSpy;
    beforeEach(() => {
        let window = {
            webContents: {
                // tslint:disable-next-line:no-empty
                send(event: string, arg: any) {

                },
            },
        };
        sendSpy = sinon.spy(window.webContents, 'send');
        mockWindow = window;
        sut = new JobManager();
        sut.initialize(mockWindow);
    });
    it('should send Job-Created on add job', () => {
        sut.addJob("hi", 'upload', null, "", "", "");

        assert(sendSpy.args[0][0] === 'Jobs-Created');
    });

    it('should send Job-Completed on complete job', () => {
        sut.addJob("hi", 'upload', null, "", "", "");
        sendSpy.resetHistory();
        sut.completeJob('hi');

        assert(sendSpy.args[0][0] === 'Jobs-Completed');
    });
    it('should send Job-Failed on fail job', () => {
        sut.addJob("hi", 'upload', null,  "", "", "");
        sendSpy.resetHistory();
        sut.failJob('hi', {message: "hi"} as any);

        assert(sendSpy.args[0][0] === 'Jobs-Failed');
    });
    it('should send Job-Progress on progress report', () => {
        sut.addJob("hi", 'upload', null,  "", "", "");
        sendSpy.resetHistory();
        sut.reportProgress('hi', 10, 100);

        assert(sendSpy.args[0][0] === 'Jobs-Progress');
    });
    it('should not send Job-Progress on progress report if change is less than 1%', () => {
        sut.addJob("hi", 'upload', null,  "", "", "");
        sut.reportProgress('hi', 10, 100);
        sendSpy.resetHistory();
        sut.reportProgress('hi', 10, 100);

        assert(sendSpy.notCalled);
    });
    it('should stop job on stopJob', () => {
        // tslint:disable-next-line:new-parens
        let fakeRequest = sinon.stub(new AWS.Request<any, any>(sinon.stub(new AWS.Service), null));
        sut.addJob("hi", 'upload', fakeRequest,  "", "", "");
        sut.stopJob('hi');

        assert(fakeRequest.abort.called);
    });
});
