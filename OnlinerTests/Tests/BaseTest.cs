using Aquality.Selenium.Browsers;
using NUnit.Framework;
using Allure.NUnit.Attributes;
using System;

namespace OnlinerTests.Tests;

[TestFixture]
[AllureSuite("UI")] 
public class BaseTest
{
    [SetUp]
    public void SetUp()
    {
        // Browser is created lazily by Aquality on first access
        _ = AqualityServices.Browser;
        AqualityServices.Browser.Maximize();
    }

    [TearDown]
    public void TearDown()
    {
        if (AqualityServices.IsBrowserStarted)
        {
            try
            {
                AqualityServices.Browser.Quit();
            }
            catch { }
        }
    }
}