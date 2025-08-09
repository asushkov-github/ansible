import pytest
import requests

ENDPOINTS = [
    "https://www.onliner.by/",
    "https://catalog.onliner.by/",
]

@pytest.mark.api
@pytest.mark.parametrize("url", ENDPOINTS)
def test_public_endpoints_return_200(url: str):
    resp = requests.get(url, timeout=15)
    assert resp.status_code == 200