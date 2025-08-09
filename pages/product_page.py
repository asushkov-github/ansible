from playwright.sync_api import Page, expect
from .base_page import BasePage

class ProductPage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)
        self.title = page.locator("h1")

    def assert_loaded(self) -> None:
        expect(self.title).to_be_visible(timeout=15000)