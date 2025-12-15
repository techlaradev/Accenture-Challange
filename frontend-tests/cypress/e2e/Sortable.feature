Feature: Sortable Grid ordering

  @sortable
  Scenario: Reorder grid items following ascending rule
    Given access the website DEMOQA
    When select the Interactions option on the home page
    And click on the Sortable submenu
    And reorder items in ascending rule
    Then the grid order should match the expected positions
