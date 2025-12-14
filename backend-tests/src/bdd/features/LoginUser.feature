Feature: User login flow

  ## happy path
  Scenario: Existing user logs in successfully
    Given an existing user
    When I generate a token with valid credentials
    Then a valid token should be returned

  ## alternate paths
  Scenario: Non-existent user tries to login
    Given a non-existent user
    When I generate a token with invalid credentials
    Then the login should fail and the user should be notified

  Scenario: Login without username
    Given a user without a username
    When I try to login
    Then the login should fail and the user should be notified

  Scenario: Login without password
    Given a user without a password
    When I try to login
    Then the login should fail and the user should be notified
