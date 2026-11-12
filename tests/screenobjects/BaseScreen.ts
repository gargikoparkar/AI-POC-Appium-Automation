import { $ } from '../../src/core/driver.js';

export default class BaseScreen {
    private readonly screenSelector: string;

    constructor (screenSelector: string) {
        this.screenSelector = screenSelector;
    }

    async expectLoaded (): Promise<boolean | void> {
        return $(this.screenSelector).waitForDisplayed();
    }

    async waitForIsShown (isShown = true): Promise<boolean | void> {
        return $(this.screenSelector).waitForDisplayed({
            reverse: !isShown,
        });
    }
}
