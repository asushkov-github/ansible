from typing import Generator
import os
import pytest
from playwright.sync_api import Browser, BrowserContext, Page, Playwright, sync_playwright

BASE_URL = os.getenv("BASE_URL", "https://www.onliner.by/")
HEADLESS = os.getenv("PLAYWRIGHT_HEADLESS", "1") not in ("0", "false", "False")

@pytest.fixture(scope="session")
def playwright_instance() -> Generator[Playwright, None, None]:
    with sync_playwright() as playwright:
        yield playwright

@pytest.fixture(scope="session")
def browser(playwright_instance: Playwright) -> Generator[Browser, None, None]:
    browser = playwright_instance.chromium.launch(headless=HEADLESS, args=["--no-sandbox", "--disable-dev-shm-usage"]) 
    yield browser
    browser.close()

@pytest.fixture(scope="function")
def context(browser: Browser) -> Generator[BrowserContext, None, None]:
    context = browser.new_context(base_url=BASE_URL, viewport={"width": 1366, "height": 900})
    yield context
    context.close()

@pytest.fixture(scope="function")
def page(context: BrowserContext) -> Generator[Page, None, None]:
    page = context.new_page()
    yield page
    page.close()