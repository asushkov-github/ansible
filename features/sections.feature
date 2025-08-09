Feature: Public sections are reachable
  As a visitor
  I want to open various sections
  So that I can see they are available

  Scenario Outline: Section loads and shows header
    Given I open the section URL "<url>"
    Then The page URL should start with https
    And I see the header on the page

    Examples:
      | url                          |
      | https://www.onliner.by/      |
      | https://catalog.onliner.by/  |
      | https://www.onliner.by/news  |
      | https://www.onliner.by/auto  |