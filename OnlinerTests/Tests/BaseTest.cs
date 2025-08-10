using Aquality.Selenium.Browsers;
using NUnit.Framework;
using System;

namespace OnlinerTests.Tests;

[TestFixture]
public class BaseTest
{
    [SetUp]
    public void SetUp()
    {
        var selenoidUrl = Environment.GetEnvironmentVariable("SELENOID_URL") ?? "http://localhost:4444/wd/hub";
        var browserVersion = Environment.GetEnvironmentVariable("BROWSER_VERSION") ?? "stable";
        // Aquality reads Configurations/aquality.json; env vars will be injected there
        AqualityServices.Browser.Maximize();
    }

    [TearDown]
    public void TearDown()
    {
        if (AqualityServices.IsBrowserStarted)
        {
            AqualityServices.Browser.Quit();
        }
    }
}