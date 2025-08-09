import pytest
from pages.home_page import HomePage

@pytest.mark.ui
@pytest.mark.smoke
def test_home_page_loads(page):
    home = HomePage(page)
    home.open()
    home.assert_loaded()

@pytest.mark.ui
@pytest.mark.smoke
def test_navigate_to_catalog(page):
    home = HomePage(page)
    home.open()
    home.assert_loaded()
    home.open_catalog()
    assert "catalog.onliner.by" in page.url