from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page) -> None:
        self.page = page

    def goto(self, path: str = "/") -> None:
        self.page.goto(path)

    def wait_for_network_idle(self) -> None:
        self.page.wait_for_load_state("networkidle")