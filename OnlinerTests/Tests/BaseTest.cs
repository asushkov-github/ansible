using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using Allure.NUnit.Attributes;
using System;

namespace OnlinerTests.Tests;

[TestFixture]
[AllureSuite("UI")]
public class BaseTest
{
    protected IWebDriver Driver = default!;

    [SetUp]
    public void SetUp()
    {
        var username = Environment.GetEnvironmentVariable("BROWSERSTACK_USERNAME");
        var accessKey = Environment.GetEnvironmentVariable("BROWSERSTACK_ACCESS_KEY");
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(accessKey))
        {
            Assert.Inconclusive("BrowserStack credentials are not set");
        }
        var options = new OpenQA.Selenium.Chrome.ChromeOptions();
        options.BrowserVersion = Environment.GetEnvironmentVariable("BROWSERSTACK_BROWSER_VERSION") ?? "latest";
        var bstack = new System.Collections.Generic.Dictionary<string, object>
        {
            ["os"] = Environment.GetEnvironmentVariable("BROWSERSTACK_OS") ?? "Windows",
            ["osVersion"] = Environment.GetEnvironmentVariable("BROWSERSTACK_OS_VERSION") ?? "11",
            ["buildName"] = Environment.GetEnvironmentVariable("BROWSERSTACK_BUILD_NAME") ?? "Onliner UI Build",
            ["sessionName"] = TestContext.CurrentContext.Test.Name,
            ["seleniumVersion"] = Environment.GetEnvironmentVariable("BROWSERSTACK_SELENIUM_VERSION") ?? "4.25.0",
        };
        options.AddAdditionalOption("bstack:options", bstack);
        var hub = new Uri($"https://{username}:{accessKey}@hub-cloud.browserstack.com/wd/hub");
        Driver = new RemoteWebDriver(hub, options);
        Driver.Manage().Window.Size = new System.Drawing.Size(1366, 900);
    }

    [TearDown]
    public void TearDown()
    {
        try { Driver?.Quit(); } catch { }
    }
}