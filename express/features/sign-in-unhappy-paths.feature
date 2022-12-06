Feature: Unhappy paths for the self-service sign-in flow

  Background:
    Given that the user is on the "/sign-in" page

  Scenario: The user tries to sign in with account which is not registered
    When they enter "not-registered@gds.gov.uk" into the "emailAddress" field
    When they click the Submit button
    When they enter "notEmptyPassword" into the "password" field
    When they click the Submit button
    Then they should be redirected to the "/no-account" page

  Scenario: The user tries to reset their password during sign-in
    When they enter "registered@gds.gov.uk" into the "emailAddress" field
    When they click the Submit button
    Then they click on the "Forgot your password?" link
    Then they should be redirected to the "/forgot-password" page
    Then they click on the "Continue" button-link
    Then they should be redirected to the "/check-email-password-reset" page

  Scenario: The user resends the email security code when resetting their password
    When they enter "registered@gds.gov.uk" into the "emailAddress" field
    When they click the Submit button
    Then they click on the "Forgot your password?" link
    Then they should be redirected to the "/forgot-password" page
    Then they click on the "Continue" button-link
    Then they should be redirected to the "/check-email-password-reset" page
    Then they click the "Resend the email" button
    Then they should be redirected to the "/check-email-password-reset" page

  Scenario: The user tries to log in and submits registered email but enters no value into the password field
    When they enter "password-will-be-wrong@stub.gov.uk" into the "emailAddress" field
    When they click the Submit button
    Then they should see the text "Enter your password"
    When they enter "" into the "password" field
    When they click the Submit button
    Then the error message "Enter your password" must be displayed for the "password" field

  Scenario: The user tries to log in and submits registered email but enters wrong password
    When they enter "password-will-be-wrong@stub.gov.uk" into the "emailAddress" field
    When they click the Submit button
    Then they should see the text "Enter your password"
    When they enter "WrongPa$$word" into the "password" field
    When they click the Submit button
    Then the error message "Incorrect password" must be displayed for the "password" field
