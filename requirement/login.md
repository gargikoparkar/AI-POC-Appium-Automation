# Feature: Login

A user must be able to access the Login screen, submit valid credentials, and receive a clear result. Invalid or incomplete credentials must not authenticate the user, and the app must remain usable after validation feedback.

### Scenario: Open the Login screen and view the login form
Given the WebdriverIO demo app is freshly launched
When the user opens the Login section from the app navigation
Then the Login screen is displayed
Expected Result: The Login screen is ready for input and shows the email, password, and login controls.

### Scenario: Log in with valid demo credentials
Given the user is on the Login screen
When the user enters "alice@webdriver.io" in the email field
And the user enters "supersecret" in the password field
And the user submits the login form
Then the app confirms a successful login
Expected Result: A success alert or confirmation is displayed, and the result clearly indicates that the user is logged in.

### Scenario: Submit the login form with an incorrect password
Given the user is on the Login screen
When the user enters the valid demo email "alice@webdriver.io"
And the user enters an incorrect password
And the user submits the login form
Then the app rejects the login attempt
Expected Result: The app displays a failure alert or validation message and does not indicate that the user is logged in.

### Scenario: Submit the login form with an unregistered email
Given the user is on the Login screen
When the user enters an email that is not registered in the demo app
And the user enters a password
And the user submits the login form
Then the app rejects the login attempt
Expected Result: The app displays a failure alert or validation message and does not indicate that the user is logged in.

### Scenario: Submit the login form with an invalid email format
Given the user is on the Login screen
When the user enters "not-an-email" in the email field
And the user enters a password
And the user submits the login form
Then the app prevents authentication with the invalid email value
Expected Result: The app displays validation feedback or a login failure and does not indicate that the user is logged in.

### Scenario: Submit the login form with the email field empty
Given the user is on the Login screen
When the user leaves the email field empty
And the user enters a password
And the user submits the login form
Then the app prevents authentication without an email address
Expected Result: The app displays validation feedback or a login failure and does not indicate that the user is logged in.

### Scenario: Submit the login form with the password field empty
Given the user is on the Login screen
When the user enters an email address
And the user leaves the password field empty
And the user submits the login form
Then the app prevents authentication without a password
Expected Result: The app displays validation feedback or a login failure and does not indicate that the user is logged in.

### Scenario: Dismiss login feedback and continue using the form
Given the user submitted invalid credentials and a result alert is displayed
When the user dismisses the alert
Then the user can continue interacting with the Login screen
Expected Result: The alert closes, the app remains responsive, and the user can edit the form and submit another attempt.

## Test data

- Valid demo email: `alice@webdriver.io`
- Valid demo password: `supersecret`
- Invalid email format: `not-an-email`
- Invalid credentials: use an incorrect password or an unregistered email; do not use real personal credentials.

## Running the flow

Use `$scaffold-test requirement/login.md` to compare this requirement with the framework, inspect the live app through Appium MCP, update the test code, and verify the targeted spec. Use observed navigation, locators, form behavior, and alert text directly in the implementation and report. Preserve expected behavior if the app differs. Do not create a feature document.

If the targeted test fails, run `$heal-test tests/specs/app.login.spec.ts` to trace the failure through the feature requirement, filtered Appium logs, and failure snapshot. Fix test defects or report genuine app behavior mismatches with evidence.
