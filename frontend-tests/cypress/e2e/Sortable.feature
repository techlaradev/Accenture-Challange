Feature: Sortable flow

  @happy
  Scenario: Reorder items in the sortable list
    Given access the DEMOQA website
    When select the Interactions option on the home page
    And click on the Sortable submenu
    And move item One to the last position
    Then the first item should not be One
    And the last item should be One
