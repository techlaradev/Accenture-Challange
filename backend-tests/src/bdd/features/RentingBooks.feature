Feature: Renting flow

  # happy paths
  Scenario: List available books
    When I list the available books
    Then it should return a list of books

  Scenario: Rent one book for an existing user
    Given an existing user with a valid token
    And an available book exists
    When I rent the available book
    Then the book should be rented successfully

  Scenario: Rent two books for an existing user
    Given an existing user with a valid token
    And two available books exist
    When I rent both books
    Then the books should be rented successfully

  Scenario: List user details with rented books
    Given an existing user with rented books
    When I retrieve the user details
    Then the user should have the rented books

  # alternate paths
  Scenario: Try to rent books without authentication
    Given an existing user
    And an available book exists
    When I try to rent the book without authentication
    Then the book should not be rented and the user should be notified

  Scenario: Try to rent books for a non-existent user
    Given a non-existent user
    And an available book exists
    When I try to rent the book for that user
    Then the book should not be rented and the user should be notified

  Scenario: Try to rent a book with an invalid ISBN
    Given an existing user with a valid token
    When I try to rent a book with an invalid ISBN
    Then the book should not be rented and the user should be notified

  Scenario: Try to rent the same book twice
    Given an existing user with a valid token
    And the user has already rented a book
    When I try to rent the same book again
    Then the book should not be rented and the user should be notified

  Scenario: Try to rent two books where one ISBN is invalid
    Given an existing user with a valid token
    And one valid book and one invalid ISBN
    When I try to rent both books
    Then the books should not be rented and the user should be notified
