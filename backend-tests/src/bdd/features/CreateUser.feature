Feature: Creating user and alternative paths

    ## happy path
    Scenario: create a user successfully
        Given a user is created
        And a token is generated
        And the user is authorized
        Then the user should be able to retrieve their details


    ## alternative paths

    Scenario: try to create a user with invalid credentials
        Given a user has invalid credentials
        When try create a user
        Then the user should not be created and the user should be notified

    Scenario: try to create a user with an existing username
        Given a user has an existing username
        When try create a user
        Then the user should not be created and the user should be notified

    Scenario: try to create a user without username
        Given a user without username, just password 
        When try create a user
        Then the user should not be created and the user should be notified

    Scenario: try to create a user without password
        Given a user without password, just username 
        When try create a user
        Then the user should not be created and the user should be notified
