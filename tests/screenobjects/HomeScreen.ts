import { $ } from '../../src/core/driver.js';
import BaseScreen from './BaseScreen.js';

const SELECTORS = {
    SCREEN: '~Home-screen',
    HOME_NAVIGATION: '~Home',
    LOGIN_NAVIGATION: '~Login',
    COMPATIBILITY_WARNING_DISMISS: 'android=new UiSelector().text("Don\'t Show Again")',
};

class HomeScreen extends BaseScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    private get loginNavigation () {return $(SELECTORS.LOGIN_NAVIGATION);}
    private get homeNavigation () {return $(SELECTORS.HOME_NAVIGATION);}
    private get compatibilityWarningDismissButton () {return $(SELECTORS.COMPATIBILITY_WARNING_DISMISS);}

    async openLogin (): Promise<void> {
        if (await this.compatibilityWarningDismissButton.isDisplayed()) {
            await this.compatibilityWarningDismissButton.click();
        }
        if (!await $(SELECTORS.SCREEN).isDisplayed()) {
            await this.homeNavigation.click();
        }
        await this.waitForIsShown();
        await this.loginNavigation.click();
    }
}

export default new HomeScreen();
