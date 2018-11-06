import fs = require('fs');
import uuid = require('uuid');
import path = require('path');
import assert = require('assert');
import rimraf = require('rimraf');
import sinon = require('sinon');

import { SettingsService } from '../../settings';

describe('SettingService', () => {
    let tempFolder = path.join(__dirname, "../../tmp");
    let testFolder = '';
    let mockWindow;
    let sendSpy;
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
        testFolder = path.join(tempFolder, `${id}/` );
        fs.mkdirSync(testFolder);
    });
    afterEach(() => {
        rimraf.sync(testFolder);
    });
    after(() => {
        if (fs.existsSync(tempFolder)) {
            rimraf.sync(tempFolder);
        }
    });
    it('should initialize a settings file if not exist', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        assert(fs.existsSync(path.join(testFolder, 'settings.json')));
    });
    it('should load existing settings file', () => {
        let settings = {
            accounts: ['hi'],
        };
        fs.writeFileSync(path.join(testFolder, 'settings.json'), JSON.stringify(settings));
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);

        assert((sett.getSetting('accounts') as string[])[0]  === 'hi');
    });

    it('should generate new client-id if it does not exist', () => {
        let settings = {
        };
        fs.writeFileSync(path.join(testFolder, 'settings.json'), JSON.stringify(settings));
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);

        assert(sett.getSetting('client-id') as string);
    });
    it('should apply default setting if setting does not exist', () => {
        let settings = {
            'prompt-eula': false,
        };
        fs.writeFileSync(path.join(testFolder, 'settings.json'), JSON.stringify(settings));
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);

        assert(!(sett.getSetting('prompt-eula') as boolean));
        assert(sett.getSetting('prompt-feedback') as boolean);
    });
    it('should set settings correctly', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        sett.setSetting('hi', '123');
        assert(sett.getSetting('hi') === '123');
    });
    it('should save newly set settings immediately', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        sett.setSetting('hi', '123');
        let settingsFile = path.join(testFolder, 'settings.json');
        assert(JSON.parse(fs.readFileSync(settingsFile).toString()).hi === '123');
    });
    it('should send initial settings on initialize', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        assert(sendSpy.args[0][0] === 'Settings-SettingsChanged');
    });
    it('should send Settings-SettingsChanged on changing settings', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        sendSpy.resetHistory();
        sett.setSetting('hi', '123');
        assert(sendSpy.calledOnce);
        assert(sendSpy.args[0][0] === 'Settings-SettingsChanged');
    });
    it('should add to accounts on addAccount', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        sett.addAccount('hi');
        assert.equal((sett.getSetting('accounts') as string[]).length, 1);
        let settingsFile = path.join(testFolder, 'settings.json');
        assert.equal((JSON.parse(fs.readFileSync(settingsFile).toString()).accounts as string[]).length, 1);
    });
    it('should not add to accounts when duplicate', () => {
        let sett = new SettingsService(testFolder);
        sett.initialize(mockWindow);
        sett.addAccount('hi');
        sett.addAccount('hi');
        assert.equal((sett.getSetting('accounts') as string[]).length, 1);
    });
});
