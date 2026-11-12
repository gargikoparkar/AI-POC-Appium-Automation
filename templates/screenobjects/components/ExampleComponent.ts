import { $ } from '../../../src/core/driver.js';

/**
 * Example component, copied to `tests/screenobjects/components/<Name>.ts`.
 * Use a component for UI that shows up on several screens (tab bar, alert, picker, toast, dialog).
 * Rename `ExampleComponent` and replace the locators with ones observed in the live app.
 */
const SELECTORS = {
    ROOT: 'id:android:id/parentPanel',
    MESSAGE: 'id:android:id/message',
    BUTTON_WITH_TEXT: 'android=new UiSelector().text("{TEXT}")',
};

class ExampleComponent {
    /**
     * Wait for the component to be (in)visible
     */
    static async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(SELECTORS.ROOT).waitForDisplayed({
            reverse: !isShown,
        });
    }

    /**
     * Tap a button based on its visible text
     */
    static async tapOnButtonWithText (text: string) {
        await $(SELECTORS.BUTTON_WITH_TEXT.replace('{TEXT}', text)).click();
    }

    static async text (): Promise<string> {
        return $(SELECTORS.MESSAGE).getText();
    }
}

export default ExampleComponent;
