import re
import pytest
from playwright.sync_api import expect

SECTIONS = [
    "https://www.onliner.by/",
    "https://catalog.onliner.by/",
    "https://www.onliner.by/news",
    "https://www.onliner.by/auto",
    "https://www.onliner.by/technology",
    "https://www.onliner.by/people",
    "https://www.onliner.by/realty",
    "https://www.onliner.by/money",
]

@pytest.mark.ui
@pytest.mark.parametrize("url", SECTIONS)
def test_section_pages_load(page, url: str):
    page.goto(url)
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(re.compile(r"^https://"))
    expect(page.locator("header").first).to_be_visible()