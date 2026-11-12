import { getDriver } from '../../src/core/driver.js';

export const CONTEXT_REF = {
    NATIVE_APP: 'NATIVE_APP',
    WEBVIEW: 'WEBVIEW',
} as const;
const DOCUMENT_READY_STATE = {
    COMPLETE: 'complete',
    INTERACTIVE: 'interactive',
    LOADING: 'loading',
};

type AndroidContext =  {
    packageName?: string;
    webviewName?: string;
    androidWebviewData?: {
        attached: boolean;
        empty: boolean;
        neverAttached: boolean;
        visible: boolean;
    }
}

/**
 * Android:
 * - an Android App can only have ONE WebView per app, but it can have multiple pages inside the WebView (in theory you can see them as multiple webviews)
 * - when you call the default `driver.getContexts()` method you will get back an array of strings with:
 *     - `NATIVE_APP`
 *    - `WEBVIEW-{packageName}`, if you have Chrome in the background you will also get back `WEBVIEW_com.android.chrome`
 * - the order will be random, so you can't rely on the order of the array
 * - the default method doesn't give you enough information to determine which webview you need to use,
 *   for example no title or url of the webview
 *
 * The below class gives a custom implementation to get the correct webview.
 */
class WebView {
    /**
     * Wait for the webview context to be added to the contexts
     *
     * NOTE: this will say nothing if the url in the webview is loaded, only that the expected webview is added to the contexts
     *
     * The Webview is always connected to the app we are testing, so we check if a webview context
     * with the `packageName` of the app is added and its page is not empty.
     */
    async waitForWebViewContextAdded(): Promise<void> {
        const driver = getDriver();

        await driver.waitUntil(
            async () => {
                // Check this method for detailed webview context information
                const currentContexts = await driver.getContexts({
                    returnAndroidDescriptionData: true,
                    returnDetailedContexts: true,
                });
                const appIdentifier = await driver.getCurrentPackage();

                return currentContexts.length > 1 &&
                    currentContexts.some(context =>
                        // Also check that the matching page is not empty
                        (context as AndroidContext).packageName === appIdentifier && (context as AndroidContext)?.androidWebviewData?.empty === false
                    );
            }, {
                timeout: 45 * 1000,
                timeoutMsg: 'Webview context not loaded',
                interval: 100,
            },
        );
    }

    /**
     * Selenium or Appium normally automatically wait for a page to be loaded, but this doesn't work for webviews.
     * This method can be called when you have switched to a webview and you want to be sure for the page to be fully loaded.
     */
    async waitForDocumentFullyLoaded () {
        const driver = getDriver();

        await driver.waitUntil(
            // A webpage can have multiple states, the ready state is the one we need to have.
            // See also the w3c specs https://www.w3.org/TR/webdriver/#dfn-waiting-for-the-navigation-to-complete
            async() => (await driver.execute(() => document.readyState)) === DOCUMENT_READY_STATE.COMPLETE,
            {
                timeout: 15000,
                timeoutMsg: 'Website not loaded',
                interval: 100,
            },
        );
    }

    /**
     * Wait for the website in the webview to be loaded
     */
    async waitForWebsiteLoaded () {
        const driver = getDriver();

        await this.waitForWebViewContextAdded();
        // we know we want to switch to the webview of WebdriverIO, so we can already provide the title and url that expect to find.
        // This will make the search more accurate
        await driver.switchContext({
            title: /WebdriverIO.*/,
            url: 'https://webdriver.io/',
        });
        await this.waitForDocumentFullyLoaded();
        await driver.switchContext(CONTEXT_REF.NATIVE_APP);
    }
}

export default WebView;
