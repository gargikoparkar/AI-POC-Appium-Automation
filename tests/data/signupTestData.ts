export const SIGNUP_TEST_DATA = {
    valid: {
        email: 'testuser@webdriver.io',
        password: 'supersecret',
    },
    invalidEmail: 'not-an-email',
    shortPassword: 'abc12',
    mismatchPassword: 'different-password',
    messages: {
        successTitle: 'Signed Up!',
        success: 'You successfully signed up!',
        invalidEmail: 'Please enter a valid email address',
        shortPassword: 'Please enter at least 8 characters',
        passwordMismatch: 'Please enter the same password',
    },
} as const;
