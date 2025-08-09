import re
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from playwright.sync_api import expect
from pages.home_page import HomePage
from pages.catalog_home_page import CatalogHomePage

scenarios('../../features/home.feature')
scenarios('../../features/catalog.feature')
scenarios('../../features/sections.feature')

@given("I open the Onliner home page")
def open_home(page):
    HomePage(page).open()

@then("I see the header on the home page")
def see_header_on_home(page):
    HomePage(page).assert_loaded()

@when("I navigate to the catalog")
def go_to_catalog(page):
    HomePage(page).open_catalog()

@then("I am on the catalog site")
def on_catalog(page):
    expect(page).to_have_url(re.compile(r"https?://catalog\.onliner\.by.*"))
    CatalogHomePage(page).assert_loaded()

@given(parsers.re(r'I open the section URL "(?P<url>.+)"'))
def open_section(page, url: str):
    page.goto(url)
    page.wait_for_load_state("networkidle")

@then("The page URL should start with https")
def url_starts_with_https(page):
    expect(page).to_have_url(re.compile(r"^https://"))

@then("I see the header on the page")
def see_header(page):
    expect(page.locator("header").first).to_be_visible()