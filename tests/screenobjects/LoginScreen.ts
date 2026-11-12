import { $ } from '../../src/core/driver.js';
import BaseScreen from './BaseScreen.js';

const SELECTORS = {
    SCREEN: '~Login-screen',
    EMAIL: '~input-email',
    PASSWORD: '~input-password',
    REPEAT_PASSWORD: '~input-repeat-password',
    SUBMIT: '~button-LOGIN',
    SIGN_UP_TAB: '~button-sign-up-container',
    SIGN_UP_SUBMIT: '~button-SIGN UP',
    ALERT_TITLE: 'id:android:id/alertTitle',
    ALERT_MESSAGE: 'id:android:id/message',
    ALERT_OK: 'id:android:id/button1',
    INVALID_EMAIL: 'android=new UiSelector().text("Please enter a valid email address")',
    SHORT_PASSWORD: 'android=new UiSelector().text("Please enter at least 8 characters")',
    PASSWORD_MISMATCH: 'android=new UiSelector().text("Please enter the same password")',
};

class LoginScreen extends BaseScreen {
    constructor () {
        super(SELECTORS.SCREEN);
    }

    private get screen () {return $(SELECTORS.SCREEN);}
    private get emailInput () {return $(SELECTORS.EMAIL);}
    private get passwordInput () {return $(SELECTORS.PASSWORD);}
    private get repeatPasswordInput () {return $(SELECTORS.REPEAT_PASSWORD);}
    private get submitButton () {return $(SELECTORS.SUBMIT);}
    private get signUpTab () {return $(SELECTORS.SIGN_UP_TAB);}
    private get signUpSubmitButton () {return $(SELECTORS.SIGN_UP_SUBMIT);}
    private get alertTitle () {return $(SELECTORS.ALERT_TITLE);}
    private get alertMessage () {return $(SELECTORS.ALERT_MESSAGE);}
    private get alertOk () {return $(SELECTORS.ALERT_OK);}
    private get invalidEmailMessage () {return $(SELECTORS.INVALID_EMAIL);}
    private get shortPasswordMessage () {return $(SELECTORS.SHORT_PASSWORD);}
    private get passwordMismatchMessage () {return $(SELECTORS.PASSWORD_MISMATCH);}

    async openSignUp (): Promise<void> {
        await this.signUpTab.click();
    }

    async enterSignUpDetails (email: string, password: string, repeatPassword: string): Promise<void> {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.repeatPasswordInput.setValue(repeatPassword);
    }

    async submitSignUp (): Promise<void> {
        await this.signUpSubmitButton.click();
    }

    async getPasswordMismatchMessage (): Promise<string> {
        await this.passwordMismatchMessage.waitForDisplayed();

        return this.passwordMismatchMessage.getText();
    }

    async isSignUpFormDisplayed (): Promise<boolean> {
        return this.repeatPasswordInput.isDisplayed();
    }

    async isSignUpSuccessAlertDisplayed (): Promise<boolean> {
        return this.alertTitle.isDisplayed();
    }

    async enterCredentials (email: string, password: string): Promise<void> {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
    }

    async submit (): Promise<void> {
        await this.submitButton.click();
    }

    async getAlertTitle (): Promise<string> {
        await this.alertTitle.waitForDisplayed();

        return this.alertTitle.getText();
    }

    async getAlertMessage (): Promise<string> {
        await this.alertMessage.waitForDisplayed();

        return this.alertMessage.getText();
    }

    async getInvalidEmailMessage (): Promise<string> {
        await this.invalidEmailMessage.waitForDisplayed();

        return this.invalidEmailMessage.getText();
    }

    async getShortPasswordMessage (): Promise<string> {
        await this.shortPasswordMessage.waitForDisplayed();

        return this.shortPasswordMessage.getText();
    }

    async dismissAlert (): Promise<void> {
        await this.alertOk.click();
    }

    async isFormDisplayed (): Promise<boolean> {
        return this.screen.isDisplayed();
    }
}

export default new LoginScreen();
