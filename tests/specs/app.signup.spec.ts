import { expect } from 'chai';
import { app } from '../screenobjects/AppScreen.js';
import { SIGNUP_TEST_DATA } from '../data/signupTestData.js';
import { relaunchApp } from '../helpers/Utils.js';

describe('Sign up', () => {
    before(async () => {
        await relaunchApp();
    });

    beforeEach(async () => {
        await app.home.openLogin();
        await app.login.expectLoaded();
        await app.login.openSignUp();
    });

    it('S1: should open the sign up form', async () => {
        expect(await app.login.isSignUpFormDisplayed()).to.equal(true);
    });

    it('S2: should confirm sign up with valid details', async () => {
        await app.login.enterSignUpDetails(
            SIGNUP_TEST_DATA.valid.email,
            SIGNUP_TEST_DATA.valid.password,
            SIGNUP_TEST_DATA.valid.password,
        );
        await app.login.submitSignUp();

        expect(await app.login.getAlertTitle()).to.equal(SIGNUP_TEST_DATA.messages.successTitle);
        expect(await app.login.getAlertMessage()).to.equal(SIGNUP_TEST_DATA.messages.success);
        await app.login.dismissAlert();
    });

    it('S3: should reject an invalid email format', async () => {
        await app.login.enterSignUpDetails(
            SIGNUP_TEST_DATA.invalidEmail,
            SIGNUP_TEST_DATA.valid.password,
            SIGNUP_TEST_DATA.valid.password,
        );
        await app.login.submitSignUp();

        expect(await app.login.getInvalidEmailMessage()).to.equal(SIGNUP_TEST_DATA.messages.invalidEmail);
        expect(await app.login.isSignUpSuccessAlertDisplayed()).to.equal(false);
    });

    it('S4: should reject a short password', async () => {
        await app.login.enterSignUpDetails(
            SIGNUP_TEST_DATA.valid.email,
            SIGNUP_TEST_DATA.shortPassword,
            SIGNUP_TEST_DATA.shortPassword,
        );
        await app.login.submitSignUp();

        expect(await app.login.getShortPasswordMessage()).to.equal(SIGNUP_TEST_DATA.messages.shortPassword);
        expect(await app.login.isSignUpSuccessAlertDisplayed()).to.equal(false);
    });

    it('S5: should reject mismatched passwords', async () => {
        await app.login.enterSignUpDetails(
            SIGNUP_TEST_DATA.valid.email,
            SIGNUP_TEST_DATA.valid.password,
            SIGNUP_TEST_DATA.mismatchPassword,
        );
        await app.login.submitSignUp();

        expect(await app.login.getPasswordMismatchMessage()).to.equal(SIGNUP_TEST_DATA.messages.passwordMismatch);
        expect(await app.login.isSignUpSuccessAlertDisplayed()).to.equal(false);
    });

    it('S6: should require all sign up fields', async () => {
        await app.login.enterSignUpDetails('', '', '');
        await app.login.submitSignUp();

        expect(await app.login.getInvalidEmailMessage()).to.equal(SIGNUP_TEST_DATA.messages.invalidEmail);
        expect(await app.login.getShortPasswordMessage()).to.equal(SIGNUP_TEST_DATA.messages.shortPassword);
        expect(await app.login.getPasswordMismatchMessage()).to.equal(SIGNUP_TEST_DATA.messages.passwordMismatch);
        expect(await app.login.isSignUpSuccessAlertDisplayed()).to.equal(false);
    });

    it('S7: should remain usable after dismissing sign up feedback', async () => {
        await app.login.enterSignUpDetails(
            SIGNUP_TEST_DATA.valid.email,
            SIGNUP_TEST_DATA.valid.password,
            SIGNUP_TEST_DATA.valid.password,
        );
        await app.login.submitSignUp();
        await app.login.dismissAlert();

        expect(await app.login.isSignUpFormDisplayed()).to.equal(true);
        await app.login.enterSignUpDetails(
            SIGNUP_TEST_DATA.valid.email,
            SIGNUP_TEST_DATA.valid.password,
            SIGNUP_TEST_DATA.valid.password,
        );
        await app.login.submitSignUp();

        expect(await app.login.getAlertMessage()).to.equal(SIGNUP_TEST_DATA.messages.success);
        await app.login.dismissAlert();
    });
});
