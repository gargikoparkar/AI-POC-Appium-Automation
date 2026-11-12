import { remote } from 'webdriverio';
import { CONFIG } from './config.js';

/**
 * `webdriverio` is only used as the WebDriver/Appium client library here (no wdio runner, config or services).
 * The session is created once by the Mocha root hooks and shared by all screen objects through `getDriver()`.
 */
let driver: WebdriverIO.Browser | undefined;

export async function createSession(): Promise<WebdriverIO.Browser> {
    driver = await remote({
        hostname: CONFIG.appium.hostname,
        port: CONFIG.appium.port,
        path: CONFIG.appium.path,
        logLevel: 'warn',
        waitforTimeout: CONFIG.waitforTimeout,
        connectionRetryTimeout: CONFIG.connectionRetryTimeout,
        connectionRetryCount: CONFIG.connectionRetryCount,
        capabilities: CONFIG.capabilities,
    });

    return driver;
}

export async function deleteSession(): Promise<void> {
    if (driver) {
        await driver.deleteSession();
        driver = undefined;
    }
}

export function getDriver(): WebdriverIO.Browser {
    if (!driver) {
        throw new Error('No Appium session. Sessions are created in src/hooks/rootHooks.ts, run tests through "npm test".');
    }

    return driver;
}

/**
 * Shorthands so screen objects read the same as before: `$('~Login')`
 */
export const $ = (selector: string) => getDriver().$(selector);
export const $$ = (selector: string) => getDriver().$$(selector);
