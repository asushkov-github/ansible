using OpenQA.Selenium;

namespace OnlinerTests.Pages;

public class HomePage
{
    private readonly IWebDriver _driver;
    public HomePage(IWebDriver driver) { _driver = driver; }

    private By Header => By.CssSelector("header.g-top");
    private By CatalogLink => By.CssSelector("a[href*='catalog.onliner.by']");

    public void Open()
    {
        _driver.Navigate().GoToUrl("https://www.onliner.by/");
    }

    public bool IsLoaded()
    {
        try { return _driver.FindElement(Header).Displayed; } catch { return false; }
    }

    public void GoToCatalog()
    {
        var links = _driver.FindElements(CatalogLink);
        if (links.Count > 0 && links[0].Displayed)
        {
            links[0].Click();
        }
        else
        {
            _driver.Navigate().GoToUrl("https://catalog.onliner.by");
        }
    }
}