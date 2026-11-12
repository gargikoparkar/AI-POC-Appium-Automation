import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

export const ROOT_DIR = resolve(import.meta.dirname, '..', '..');

/**
 * The capabilities live in `capabilities/android.json` so the exact same file can be used by
 * this framework AND by the Appium MCP server (`CAPABILITIES_CONFIG` in `.mcp.json`).
 */
const CAPABILITIES_FILE = process.env.CAPABILITIES_CONFIG || join(ROOT_DIR, 'capabilities', 'android.json');

export type AndroidCapabilities = WebdriverIO.Capabilities & Record<string, unknown>;

function loadCapabilities(): AndroidCapabilities {
    const caps = JSON.parse(readFileSync(CAPABILITIES_FILE, 'utf-8')).android as AndroidCapabilities;

    // Env overrides, handy for running against another emulator / real device / apk
    if (process.env.DEVICE_NAME) {
        caps['appium:deviceName'] = process.env.DEVICE_NAME;
        caps['appium:udid'] = process.env.DEVICE_NAME;
    }
    if (process.env.APP_PATH) {
        caps['appium:app'] = process.env.APP_PATH;
    }

    // Resolve a relative app path against the project root, and fall back to the local `apps/` folder
    // if the absolute path in the json doesn't exist (e.g. the project was moved)
    const app = caps['appium:app'] as string | undefined;
    if (app) {
        const appPath = isAbsolute(app) ? app : join(ROOT_DIR, app);
        const fallback = join(ROOT_DIR, 'apps', app.split(/[\\/]/).pop() as string);
        caps['appium:app'] = existsSync(appPath) ? appPath : fallback;
    }

    return caps;
}

export const CONFIG = {
    appium: {
        hostname: process.env.APPIUM_HOST || '127.0.0.1',
        port: Number(process.env.APPIUM_PORT || 4723),
        path: '/',
        // Set to `false` to never start Appium from the tests, e.g. when you run `npm run appium` yourself
        autoStart: process.env.APPIUM_AUTOSTART !== 'false',
        logFile: join(ROOT_DIR, 'logs', 'appium.log'),
        logLevel: process.env.APPIUM_LOG_LEVEL || 'warn',
    },
    capabilities: loadCapabilities(),
    // Default timeout for all waitFor* commands
    waitforTimeout: 45000,
    // Default timeout in milliseconds for request if Appium doesn't send response
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    screenshotDir: join(ROOT_DIR, 'logs', 'screenshots'),
};
