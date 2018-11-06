import { HistoryStorage } from '../../history-storage';
import sinon = require('sinon');
import assert = require('assert');
import uuid = require('uuid');
import path = require('path');
import fs = require('fs');
import rimraf = require('rimraf');

describe('HistoryStorage', () => {
    let sut: HistoryStorage;
    let mockWindow;
    let sendSpy: sinon.SinonSpy;
    let tempFolder = path.join(__dirname, "../../tmp");
    let testFolder = '';
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
                send(event: string, arg: any) {

                },
            },
        };
        sendSpy = sinon.spy(window.webContents, 'send');
        mockWindow = window;
        let id = uuid.v4();
        testFolder = path.join(tempFolder, `${id}/`);
        fs.mkdirSync(testFolder);
        sut = new HistoryStorage(testFolder);
        sut.initialize(mockWindow);
    });
    afterEach(() => {
        rimraf.sync(testFolder);
    });
    after(() => {
        if (fs.existsSync(tempFolder)) {
            rimraf.sync(tempFolder);
        }
    });

    it('should initialize a history file if not exist', () => {
        assert(fs.existsSync(path.join(testFolder, 'history.json')));
    });
    it('should load existing history file', () => {
        let history = [
            {
                type: 'upload',
                name: 'test',
            },
        ];
        fs.writeFileSync(path.join(testFolder, 'history.json'), JSON.stringify(history));
        sut.initialize(mockWindow);
        assert.equal(sut.getHistory().length, 1);
    });
    it('should add history entry', () => {
        sut.addEntry("upload", "Test", "");
        let historyFile = path.join(testFolder, 'history.json');
        assert.equal(sut.getHistory().length, 1);
        assert.equal(JSON.parse(fs.readFileSync(historyFile).toString()).length, 1);
    });
    it('should prune old history entries if size is larger than 10', () => {
        for (let i = 0; i < 10; i++) {
            sut.addEntry('Upload', 'test', '');
        }
        sut.addEntry('Upload', 'testnew', '');

        assert.equal(sut.getHistory().length, 10);
        assert.equal(sut.getHistory()[0].name, 'testnew');
    });
    it('should clear history', () => {
        sut.addEntry('Upload', 'test', '');
        sut.clearHistory();
        let historyFile = path.join(testFolder, 'history.json');
        assert.equal(sut.getHistory().length, 0);
        assert.equal(JSON.parse(fs.readFileSync(historyFile).toString()).length, 0);
    });
});
