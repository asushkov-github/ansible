from playwright.sync_api import Page, expect
from .base_page import BasePage
import re

class SearchResults(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)
        self.iframe = page.frame_locator("iframe.fast-search__iframe")

    def expect_any_result_contains(self, text: str) -> None:
        matcher = re.compile(re.escape(text), re.IGNORECASE)
        expect(self.iframe.get_by_text(matcher).first).to_be_visible(timeout=10000)