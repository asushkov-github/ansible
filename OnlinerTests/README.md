# OnlinerTests (.NET + Selenium + Selenoid + Allure + Aquality)

## Prerequisites
- .NET 8 SDK
- Selenoid running locally or remotely
- Allure CLI installed (`allure --version`)

## Configure
- Set environment variables (override defaults):
  - `SELENOID_URL` (default: `http://localhost:4444/wd/hub`)
  - `BROWSER_VERSION` (e.g. `122.0`, default: `stable`)

## Restore and build
```bash
cd OnlinerTests
dotnet restore
```

## Run tests
```bash
# Linux/macOS
export SELENOID_URL=http://localhost:4444/wd/hub
export BROWSER_VERSION=stable

# Windows PowerShell
# $env:SELENOID_URL="http://localhost:4444/wd/hub"
# $env:BROWSER_VERSION="stable"

dotnet test --logger "trx;LogFileName=TestResults.trx"
```

## Allure report
- Allure results are written to `./allure-results`
- Generate and open report:
```bash
allure generate --clean --output ./allure-report ./allure-results
allure open ./allure-report
```