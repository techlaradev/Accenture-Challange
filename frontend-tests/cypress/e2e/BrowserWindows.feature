Feature: Browser Windows flow

## happy path
  Scenario: Open a new window and validate the message
    Given access the DEMOQA website
    When select the Alerts, Frame & Windows option on the home page
    And click on the Browser Windows submenu
    And click on the New Window button
    Then verify that a new window is opened with the message "This is a sample page"
    And close the newly opened window

## alt path