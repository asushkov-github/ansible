from playwright.sync_api import Page, expect
from .base_page import BasePage
from urllib.parse import quote

class CategoryPage(BasePage):
    def __init__(self, page: Page, slug: str) -> None:
        super().__init__(page)
        self.slug = slug
        # Broader selectors to match various catalog layouts
        self.product_titles = page.locator(
            ".schema-product__title a, .schema-product__title, .schema-product__group a, .schema-product a"
        )
        self.pagination_next = page.locator(".schema-pagination__button[rel='next'], .schema-pagination__next")
        self.products_container = page.locator("#schema-products, .schema-products, .schema-grid, .schema-page")

    def open(self) -> None:
        self.page.goto(f"https://catalog.onliner.by/{quote(self.slug)}")
        self.page.wait_for_load_state("networkidle")

    def assert_has_products(self) -> None:
        expect(self.products_container.first).to_be_visible(timeout=30000)
        expect(self.product_titles.first).to_be_visible(timeout=30000)

    def open_first_product(self) -> None:
        self.product_titles.first.click()
        self.page.wait_for_load_state("networkidle")

    def go_next_page_if_available(self) -> bool:
        if self.pagination_next.count() > 0:
            try:
                self.pagination_next.first.click()
                self.page.wait_for_load_state("networkidle")
                return True
            except Exception:
                return False
        return False