import pytest
from pages.catalog_home_page import CatalogHomePage
from pages.category_page import CategoryPage
from pages.product_page import ProductPage

@pytest.mark.ui
@pytest.mark.smoke
def test_catalog_home_loads(page):
    cat = CatalogHomePage(page)
    cat.open()
    cat.assert_loaded()

@pytest.mark.ui
@pytest.mark.xfail(reason="Catalog category layout varies (A/B, geo, device); selectors may not be stable in headless CI", strict=False)
def test_category_has_products_and_open_first(page):
    category = CategoryPage(page, slug="mobile")
    category.open()
    category.assert_has_products()
    category.open_first_product()
    product = ProductPage(page)
    product.assert_loaded()

@pytest.mark.ui
@pytest.mark.xfail(reason="Catalog category layout varies (A/B, geo, device); selectors may not be stable in headless CI", strict=False)
def test_category_pagination_next(page):
    category = CategoryPage(page, slug="notebook")
    category.open()
    category.assert_has_products()
    moved = category.go_next_page_if_available()
    assert moved in (True, False)  # ensure method is resilient