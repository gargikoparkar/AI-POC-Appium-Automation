import { getDriver } from '../../src/core/driver.js';
import { PACKAGE_NAME } from './Constants.js';

/**
 * Get the time difference in seconds
 */
export function timeDifference (string: string, start:number, end:number) {
    const elapsed = (end - start) / 1000;
    console.log(`${string} It took ${elapsed} seconds.`);
}

/**
 * Open a deep link in the app
 */
export async function openDeepLinkUrl(url:string) {
    return getDriver().execute('mobile: deepLink', {
        url: `wdio://${ url }`,
        package: PACKAGE_NAME,
    });
}

/**
 * Relaunch the app by closing it and starting it again.
 * Because all specs share one session, every spec calls this first to start from a clean app state.
 */
export async function relaunchApp(appId = PACKAGE_NAME) {
    const driver = getDriver();

    await driver.execute('mobile: terminateApp', { appId });
    await driver.execute('mobile: activateApp', { appId });
}
