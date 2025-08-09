from playwright.sync_api import Page, expect
from .base_page import BasePage

class CatalogHomePage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)
        self.navigation = page.locator(".catalog-navigation, #catalog-navigation, nav")
        self.search_field = page.locator("input.fast-search__input, input[name='query']")

    def open(self) -> None:
        self.page.goto("https://catalog.onliner.by/")

    def assert_loaded(self) -> None:
        expect(self.navigation.first).to_be_visible()