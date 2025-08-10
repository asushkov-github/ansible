from playwright.sync_api import Page, expect
from .base_page import BasePage
import re

class HomePage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)
        # Header and search locators
        self.header = page.locator("header.g-top")
        self.search_input = page.locator("input.fast-search__input")
        # The fast search opens an iframe with results
        self.search_iframe_el = page.locator("iframe.fast-search__iframe")
        self.search_iframe = page.frame_locator("iframe.fast-search__iframe")
        self.search_results_items = self.search_iframe.locator(".product__title")
        # Catalog link candidates
        self.catalog_link_candidates = [
            page.get_by_role("link", name="Каталог"),
            page.locator('a[href="https://catalog.onliner.by"]'),
            page.locator('a[href^="https://catalog.onliner.by"]'),
        ]

    def open(self) -> None:
        self.goto("/")

    def assert_loaded(self) -> None:
        expect(self.header).to_be_visible()
        expect(self.search_input).to_be_visible()

    def search(self, query: str) -> None:
        self.search_input.fill("")
        self.search_input.type(query)

    def submit_search(self) -> None:
        self.search_input.press("Enter")

    def expect_fast_search_opened(self) -> None:
        expect(self.search_iframe_el).to_be_visible(timeout=10000)

    def open_catalog(self) -> None:
        clicked = False
        for candidate in self.catalog_link_candidates:
            if candidate.count() > 0:
                try:
                    candidate.first.click()
                    clicked = True
                    break
                except Exception:
                    continue
        if not clicked:
            # Fallback to direct navigation
            self.page.goto("https://catalog.onliner.by")
        # Wait for navigation
        expect(self.page).to_have_url(re.compile(r"https?://catalog\.onliner\.by.*"), timeout=15000)

    def expect_search_results(self) -> None:
        expect(self.search_results_items.first).to_be_visible()