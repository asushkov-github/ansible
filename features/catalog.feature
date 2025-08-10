Feature: Catalog navigation
  As a visitor
  I want to navigate from home to catalog
  So that I can browse products

  Scenario: Navigate to catalog from home
    Given I open the Onliner home page
    When I navigate to the catalog
    Then I am on the catalog site