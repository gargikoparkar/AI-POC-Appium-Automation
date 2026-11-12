---
name: project-architecture
description: "Reference for what each file and folder of this Appium framework does (capabilities, config, driver, root hooks, screenobjects, helpers), env var overrides and timeouts. Use when you need to know where something lives or how a session/Appium server is started."
user-invocable: false
---

# Architecture

Pure Appium (UiAutomator2) Android framework. `webdriverio` is only the client library (`remote()`): no wdio runner, config or services.

## Files

| Path | Role |
|---|---|
| `capabilities/android.json` | Single source of truth for capabilities, shared by the tests **and** the Appium MCP server (`CAPABILITIES_CONFIG` in `.mcp.json`) |
| `src/core/config.ts` | Loads capabilities + env overrides. Relative or missing `appium:app` paths fall back to `apps/<filename>` |
| `src/core/appiumServer.ts` | Starts Appium from `node_modules` unless one already runs on host:port; only stops a server it started. Empties `logs/appium.log` before starting |
| `src/core/driver.ts` | One shared session. Use `$`, `$$`, `getDriver()` from here, never the wdio globals |
| `src/hooks/rootHooks.ts` | Mocha root hooks (via `.mocharc.cjs`): start Appium, ONE session for the whole run, screenshot on failure to `logs/screenshots/`, tear down |
| `tests/screenobjects/BaseScreen.ts` | Shared base class for page identity and behavior such as `expectLoaded()` |
| `tests/screenobjects/AppScreen.ts` | Central registry exporting `app`; register each page object here for access such as `app.login` |
| `tests/screenobjects/` | One page object per screen, extending `BaseScreen` and exporting a singleton. `components/` = widgets shared by several screens |
| `tests/data/` | Flow-specific test inputs and expected result strings, stored in `<flow>TestData.ts` and imported by specs |
| `tests/helpers/` | `Constants.ts` (`PACKAGE_NAME`), `Utils.ts` (`relaunchApp`, `openDeepLinkUrl`), `WebView.ts`, `Biometrics.ts` |
| `tests/specs/*.spec.ts` | Mocha `describe/it` + chai `expect`; page objects are accessed through `app` from `AppScreen.ts` |
| `requirement/` | Source Markdown requirements; the scaffold and heal workflows read these directly |
| `templates/` | Examples for screen objects, specs, and findings log; requirements are stored separately under `requirement/` |

## Env overrides

| Variable | Effect |
|---|---|
| `DEVICE_NAME` | Sets `deviceName` + `udid` |
| `APP_PATH` | Sets `appium:app` (not package/activity!) |
| `APPIUM_HOST` / `APPIUM_PORT` | Default `127.0.0.1:4723` |
| `APPIUM_AUTOSTART=false` | Require an already-running server (`npm run appium`) |
| `APPIUM_LOG_LEVEL` | Default `warn`; `debug` for a full trace |
| `CAPABILITIES_CONFIG` | Alternative capabilities file |

## Timeouts

- `waitforTimeout`: 45s (all `waitFor*` commands)
- `waitForSelectorTimeout`: lowered to 3s in the root hooks, so slow screens need an explicit wait
- Mocha test timeout: 3 min; specs never run in parallel (one device = one session)

## Machine-specific

`.mcp.json` and `capabilities/android.json` contain absolute Windows paths for this machine; update them if the project moves.
