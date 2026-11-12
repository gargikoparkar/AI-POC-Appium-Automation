export const LOGIN_TEST_DATA = {
    credentials: {
        valid: {
            email: 'alice@webdriver.io',
            password: 'supersecret',
        },
        incorrectPassword: 'incorrect-password',
        unregisteredEmail: 'unregistered@example.com',
        invalidEmail: 'not-an-email',
    },
    messages: {
        successTitle: 'Success',
        success: 'You are logged in!',
        failureTitle: 'Failure',
        loggedInPhrase: 'logged in',
        invalidEmail: 'Please enter a valid email address',
        shortPassword: 'Please enter at least 8 characters',
    },
} as const;
