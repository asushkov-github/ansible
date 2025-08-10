using NUnit.Framework;
using Allure.NUnit.Attributes;
using OnlinerTests.Pages;

namespace OnlinerTests.Tests;

[TestFixture]
[AllureSuite("UI")]
public class HomeTests : BaseTest
{
    [Test]
    [AllureFeature("Home")]
    [AllureStory("Home page loads")]
    public void HomePageLoads()
    {
        var home = new HomePage();
        home.Open();
        Assert.That(home.IsLoaded(), Is.True);
    }

    [Test]
    [AllureFeature("Catalog")]
    [AllureStory("Navigate to catalog from home")]
    public void NavigateToCatalog()
    {
        var home = new HomePage();
        home.Open();
        home.GoToCatalog();
        var catalog = new CatalogHomePage();
        Assert.That(catalog.IsLoaded(), Is.True);
    }
}