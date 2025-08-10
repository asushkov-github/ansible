using Aquality.Selenium.Elements.Interfaces;
using Aquality.Selenium.Forms;
using OpenQA.Selenium;

namespace OnlinerTests.Pages;

public class CatalogHomePage : Form
{
    private readonly ILabel Navigation = ElementFactory.GetLabel(By.CssSelector(".catalog-navigation, nav"), "Catalog navigation");

    public CatalogHomePage() : base(By.CssSelector("body"), "Catalog Home") { }

    public bool IsLoaded() => Navigation.State.IsDisplayed;
}