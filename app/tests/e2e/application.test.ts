import testhelper = require("../helpers/spectron.helper");
let app = testhelper.initializeSpectron();
import assert = require('assert');
import chaiAsPromised = require("chai-as-promised");
import chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe("Application", () => {
    // Start spectron
    before(() => {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    // Stop Electron
    after(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('should start', () => {
        return app.client.getWindowCount().then((count) => {
            assert.equal(count, 1);
        });
    });
});
