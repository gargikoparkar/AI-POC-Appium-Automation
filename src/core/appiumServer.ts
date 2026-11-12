import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CONFIG, ROOT_DIR } from './config.js';

let appiumProcess: ChildProcess | undefined;

const statusUrl = () => `http://${CONFIG.appium.hostname}:${CONFIG.appium.port}/status`;

async function isAppiumRunning(): Promise<boolean> {
    try {
        const response = await fetch(statusUrl(), { signal: AbortSignal.timeout(2000) });

        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Start a local Appium server, unless one is already running on the configured host/port.
 * This replaces what `@wdio/appium-service` used to do.
 */
export async function startAppium(): Promise<void> {
    if (await isAppiumRunning()) {
        console.log(`[appium] Reusing server already running on ${statusUrl()}`);

        return;
    }
    if (!CONFIG.appium.autoStart) {
        throw new Error(`[appium] No server on ${statusUrl()} and APPIUM_AUTOSTART=false. Start it with "npm run appium".`);
    }

    mkdirSync(dirname(CONFIG.appium.logFile), { recursive: true });
    // Appium appends to its log file, start every run with an empty one so it only holds this run
    writeFileSync(CONFIG.appium.logFile, '');

    // Run the locally installed Appium through node so it works the same on Windows, macOS and Linux
    const appiumMain = join(ROOT_DIR, 'node_modules', 'appium', 'index.js');
    appiumProcess = spawn(process.execPath, [
        appiumMain,
        '--address', CONFIG.appium.hostname,
        '--port', String(CONFIG.appium.port),
        // Needed to execute local ADB commands (`mobile: shell`) and auto download ChromeDriver for webviews
        '--relaxed-security',
        '--log', CONFIG.appium.logFile,
        // Only warnings and errors in the file, the test output already shows which command failed.
        // Set APPIUM_LOG_LEVEL=debug when you need the full Appium trace.
        '--log-level', CONFIG.appium.logLevel,
    ], { stdio: 'ignore' });

    const startedAt = Date.now();
    while (Date.now() - startedAt < 60000) {
        if (appiumProcess.exitCode !== null) {
            throw new Error(`[appium] Server exited with code ${appiumProcess.exitCode}, check ${CONFIG.appium.logFile}`);
        }
        if (await isAppiumRunning()) {
            console.log(`[appium] Started on ${statusUrl()}, logs in ${CONFIG.appium.logFile}`);

            return;
        }
        await new Promise((r) => setTimeout(r, 500));
    }

    throw new Error(`[appium] Server did not start within 60s, check ${CONFIG.appium.logFile}`);
}

/**
 * Stop the Appium server, only if it was started by us
 */
export async function stopAppium(): Promise<void> {
    if (appiumProcess && appiumProcess.exitCode === null) {
        appiumProcess.kill();
    }
    appiumProcess = undefined;
}
