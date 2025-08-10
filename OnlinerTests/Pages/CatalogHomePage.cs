using OpenQA.Selenium;

namespace OnlinerTests.Pages;

public class CatalogHomePage
{
    private readonly IWebDriver _driver;
    public CatalogHomePage(IWebDriver driver) { _driver = driver; }

    private By Navigation => By.CssSelector(".catalog-navigation, nav");

    public bool IsLoaded()
    {
        try { return _driver.FindElement(Navigation).Displayed; } catch { return false; }
    }
}