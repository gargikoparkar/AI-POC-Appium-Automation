import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Context } from 'mocha';
import { startAppium, stopAppium } from '../core/appiumServer.js';
import { createSession, deleteSession, getDriver } from '../core/driver.js';
import { CONFIG } from '../core/config.js';

/**
 * Mocha root hooks, these replace the wdio runner lifecycle:
 * - start Appium (or reuse a running one)
 * - create ONE session for the whole run
 * - take a screenshot when a test fails
 * - clean everything up at the end
 */
export const mochaHooks = {
    async beforeAll(this: Context) {
        this.timeout(5 * 60 * 1000);
        await startAppium();
        const driver = await createSession();
        // This reduces the timeout for the UiSelector locator strategy from 10 seconds to 3 seconds
        // so it will not wait for 10 seconds if it can't find an element
        await driver.updateSettings({ waitForSelectorTimeout: 3 * 1000 });
    },

    async afterEach(this: Context) {
        const test = this.currentTest;
        if (test?.state !== 'failed') {
            return;
        }
        try {
            mkdirSync(CONFIG.screenshotDir, { recursive: true });
            const fileName = `${test.fullTitle().replace(/[^a-z0-9]+/gi, '_').slice(0, 150)}.png`;
            await getDriver().saveScreenshot(join(CONFIG.screenshotDir, fileName));
        } catch (e) {
            console.warn('[screenshot] Could not save failure screenshot', e);
        }
    },

    async afterAll(this: Context) {
        this.timeout(60 * 1000);
        try {
            await deleteSession();
        } finally {
            await stopAppium();
        }
    },
};
