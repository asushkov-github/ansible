from playwright.sync_api import Page, expect
from .base_page import BasePage
from urllib.parse import quote_plus

class CatalogSearchPage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)
        self.result_titles = page.locator(".schema-product__title")

    def open_with_query(self, query: str) -> None:
        encoded = quote_plus(query)
        self.page.goto(f"https://catalog.onliner.by/search/?query={encoded}")
        self.page.wait_for_load_state("networkidle")

    def assert_any_result_contains(self, text: str) -> None:
        expect(self.result_titles.first).to_be_visible(timeout=15000)
        expect(self.result_titles).to_contain_text(text, ignore_case=True, timeout=15000)