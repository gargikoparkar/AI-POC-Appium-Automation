# Feature: Sign up

A user must be able to open the Sign up form, register with valid details, and receive a clear result. Invalid or incomplete details must not register the user, and the app must remain usable after validation feedback.

### Scenario: Open the Sign up form
Given the WebdriverIO demo app is freshly launched
When the user opens the Login section and switches to the Sign up form
Then the Sign up form is displayed
Expected Result: The form shows email, password, confirm password, and sign up controls.

### Scenario: Sign up with valid details
Given the user is on the Sign up form
When the user enters a valid email address
And the user enters a password of at least 8 characters
And the user enters the same password in the confirm password field
And the user submits the form
Then the app confirms a successful sign up
Expected Result: A success alert or confirmation is displayed, and the result clearly indicates that the user is signed up.

### Scenario: Sign up with an invalid email format
Given the user is on the Sign up form
When the user enters "not-an-email" in the email field
And the user enters a valid password and matching confirmation
And the user submits the form
Then the app prevents sign up with the invalid email value
Expected Result: The app displays email validation feedback and does not indicate that the user is signed up.

### Scenario: Sign up with a short password
Given the user is on the Sign up form
When the user enters a valid email address
And the user enters a password shorter than 8 characters
And the user submits the form
Then the app prevents sign up with a weak password
Expected Result: The app displays password validation feedback and does not indicate that the user is signed up.

### Scenario: Sign up with mismatched passwords
Given the user is on the Sign up form
When the user enters a valid email address
And the user enters a password
And the user enters a different value in the confirm password field
And the user submits the form
Then the app prevents sign up
Expected Result: The app displays a password mismatch message and does not indicate that the user is signed up.

### Scenario: Sign up with all fields empty
Given the user is on the Sign up form
When the user leaves every field empty
And the user submits the form
Then the app prevents sign up
Expected Result: The app displays validation feedback for the required fields and does not indicate that the user is signed up.

### Scenario: Dismiss sign up feedback and continue using the form
Given a result alert is displayed after a sign up attempt
When the user dismisses the alert
Then the user can continue interacting with the Sign up form
Expected Result: The alert closes, the app remains responsive, and the user can edit the form and submit another attempt.

## Test data

- Valid email: `testuser@webdriver.io`
- Valid password: `supersecret`
- Invalid email format: `not-an-email`
- Short password: `abc12`
- Do not use real personal credentials.

## Running the flow

Use `$scaffold-test requirement/signup.md` to compare this requirement with the framework, inspect the live app through Appium MCP, update the test code, and verify the targeted spec. Use observed navigation, locators, form behavior, and alert text directly in the implementation and report. Preserve expected behavior if the app differs. Do not create a feature document.

If the targeted test fails, run `$heal-test tests/specs/app.signup.spec.ts` to trace the failure through the feature requirement, filtered Appium logs, and failure snapshot. Fix test defects or report genuine app behavior mismatches with evidence.
