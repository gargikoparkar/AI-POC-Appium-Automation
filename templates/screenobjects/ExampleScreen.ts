import { $ } from '../../src/core/driver.js';
import BaseScreen from './BaseScreen.js';

/**
 * Example screen, copied to `tests/screenobjects/<Name>Screen.ts`.
 * Rename `Example` to the screen name, extend BaseScreen, and replace the locators
 * with ones observed in the live app. Register the exported page object in AppScreen.ts.
 */
const SELECTORS = {
    SCREEN: '~Example-screen',
};

class ExampleScreen extends BaseScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    get screen () {return $(SELECTORS.SCREEN);}
    private get nameInput () {return $('~input-name');}
    private get submitButton () {return $('id:com.example.app:id/submit');}
    private get resultMessage () {return $('android=new UiSelector().resourceId("com.example.app:id/result")');}

    async enterName (name: string) {
        await this.nameInput.setValue(name);
    }

    async tapOnSubmitButton () {
        // On smaller screens the button can be hidden below the keyboard or the fold
        await this.submitButton.scrollIntoView({ scrollableElement: await this.screen });
        await this.submitButton.click();
    }

    async getResultMessage (): Promise<string> {
        await this.resultMessage.waitForDisplayed();

        return this.resultMessage.getText();
    }

    async isSubmitButtonEnabled (): Promise<boolean> {
        return this.submitButton.isEnabled();
    }
}

export default new ExampleScreen();
