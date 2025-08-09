import pytest
from pages.home_page import HomePage

@pytest.mark.ui
@pytest.mark.search
@pytest.mark.smoke
@pytest.mark.xfail(reason="Fast search overlay may not trigger reliably in headless/CI or due to geo/AB tests", strict=False)
def test_fast_search_overlay_opens(page):
    home = HomePage(page)
    home.open()
    home.assert_loaded()

    home.search("iPhone")
    home.expect_fast_search_opened()