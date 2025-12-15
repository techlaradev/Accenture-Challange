Feature: Progress Bar flow

  @happy
  Scenario: Stop before 25% and complete to 100% resetting at the end
    Given access the DEMOQAwebsite
    When select the Widgets option on the home page
    And click on the Progress Bar submenu
    And click on the Start button
    And stop the progress bar before 25%
    Then the progress value should be less than or equal to 25
    When click on the Start button again
    Then the progress bar should reach 100%
    And reset the progress bar
