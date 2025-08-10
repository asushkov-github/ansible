using Aquality.Selenium.Browsers;
using Aquality.Selenium.Elements.Interfaces;
using Aquality.Selenium.Forms;
using OpenQA.Selenium;

namespace OnlinerTests.Pages;

public class HomePage : Form
{
    private readonly ILabel Header = ElementFactory.GetLabel(By.CssSelector("header.g-top"), "Header");
    private readonly ITextBox Search = ElementFactory.GetTextBox(By.CssSelector("input.fast-search__input"), "Fast search");
    private readonly ILink CatalogLink = ElementFactory.GetLink(By.CssSelector("a[href*='catalog.onliner.by']"), "Catalog link");

    public HomePage() : base(By.CssSelector("body"), "Home") { }

    public void Open()
    {
        AqualityServices.Browser.GoTo("https://www.onliner.by/");
        AqualityServices.Browser.WaitForPageToLoad();
    }

    public bool IsLoaded() => Header.State.IsDisplayed;

    public void GoToCatalog()
    {
        if (CatalogLink.State.IsDisplayed)
        {
            CatalogLink.Click();
        }
        else
        {
            AqualityServices.Browser.GoTo("https://catalog.onliner.by");
        }
        AqualityServices.Browser.WaitForPageToLoad();
    }
}