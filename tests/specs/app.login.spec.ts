import { expect } from 'chai';
import { app } from '../screenobjects/AppScreen.js';
import { LOGIN_TEST_DATA } from '../data/loginTestData.js';
import { relaunchApp } from '../helpers/Utils.js';

describe('Login', () => {
    before(async () => {
        await relaunchApp();
    });

    beforeEach(async () => {
        await app.home.openLogin();
        await app.login.expectLoaded();
    });

    it('S1: should open the login screen and show the form', async () => {
        expect(await app.login.isFormDisplayed()).to.equal(true);
    });

    it('S2: should confirm login with valid demo credentials', async () => {
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.valid.email, LOGIN_TEST_DATA.credentials.valid.password);
        await app.login.submit();

        expect(await app.login.getAlertTitle()).to.equal(LOGIN_TEST_DATA.messages.successTitle);
        expect(await app.login.getAlertMessage()).to.equal(LOGIN_TEST_DATA.messages.success);
        await app.login.dismissAlert();
    });

    it('S3: should reject a valid email with an incorrect password', async () => {
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.valid.email, LOGIN_TEST_DATA.credentials.incorrectPassword);
        await app.login.submit();

        expect(await app.login.getAlertTitle()).to.equal(LOGIN_TEST_DATA.messages.failureTitle);
        expect(await app.login.getAlertMessage()).not.to.contain(LOGIN_TEST_DATA.messages.loggedInPhrase);
        await app.login.dismissAlert();
    });

    it('S4: should reject an unregistered email', async () => {
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.unregisteredEmail, LOGIN_TEST_DATA.credentials.valid.password);
        await app.login.submit();

        expect(await app.login.getAlertTitle()).to.equal(LOGIN_TEST_DATA.messages.failureTitle);
        expect(await app.login.getAlertMessage()).not.to.contain(LOGIN_TEST_DATA.messages.loggedInPhrase);
        await app.login.dismissAlert();
    });

    it('S5: should reject an invalid email format', async () => {
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.invalidEmail, LOGIN_TEST_DATA.credentials.valid.password);
        await app.login.submit();

        expect(await app.login.getInvalidEmailMessage()).to.equal(LOGIN_TEST_DATA.messages.invalidEmail);
    });

    it('S6: should require an email address', async () => {
        await app.login.enterCredentials('', LOGIN_TEST_DATA.credentials.valid.password);
        await app.login.submit();

        expect(await app.login.getInvalidEmailMessage()).to.equal(LOGIN_TEST_DATA.messages.invalidEmail);
    });

    it('S7: should require a password', async () => {
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.valid.email, '');
        await app.login.submit();

        expect(await app.login.getShortPasswordMessage()).to.equal(LOGIN_TEST_DATA.messages.shortPassword);
    });

    it('S8: should remain usable after dismissing login feedback', async () => {
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.valid.email, LOGIN_TEST_DATA.credentials.incorrectPassword);
        await app.login.submit();
        await app.login.dismissAlert();

        expect(await app.login.isFormDisplayed()).to.equal(true);
        await app.login.enterCredentials(LOGIN_TEST_DATA.credentials.valid.email, LOGIN_TEST_DATA.credentials.valid.password);
        await app.login.submit();
        expect(await app.login.getAlertMessage()).to.equal(LOGIN_TEST_DATA.messages.success);
        await app.login.dismissAlert();
    });
});
