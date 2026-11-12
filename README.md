# Android Appium Test Framework

This repository contains an Android-only Appium automation framework built with TypeScript, Mocha, WebdriverIO as the WebDriver client, and UiAutomator2. It does not use the WebdriverIO runner. The Markdown requirement under `requirement/` is the source of truth for each flow.

## Prerequisites

- Node.js `>=20.19`
- Dependencies installed with `npm install`
- `ANDROID_HOME` configured and `adb` available
- An Android emulator or device listed as `device` by `adb devices`
- The target APK under `apps/`

The current APK and device capabilities are configured in [`capabilities/android.json`](./capabilities/android.json). The configuration currently selects `apps/android.wdio.native.app.v1.0.8.apk` and package `com.wdiodemoapp`.

## Commands

```sh
npm test
npx mocha tests/specs/app.<flow>.spec.ts
npx mocha tests/specs/app.<flow>.spec.ts -g "scenario title"
npm run typecheck
npm run lint
```

The Mocha root hooks start Appium, create one shared session, and close it after the run. Run tests serially. Close an Appium MCP session before running Mocha because one device supports one active session.

## Repository structure

| Path | Purpose |
| --- | --- |
| `requirement/` | Source Markdown requirements; preserve these as the expected behavior. |
| `capabilities/android.json` | Android device and APK capabilities shared by Appium and the test framework. |
| `src/core/driver.ts` | Shared WebdriverIO client and `$`, `$$`, and `getDriver()` helpers. |
| `src/core/config.ts` | Loads capabilities and environment overrides such as `DEVICE_NAME` and `APP_PATH`. |
| `src/core/appiumServer.ts` | Starts or reuses the local Appium server. |
| `src/hooks/rootHooks.ts` | Mocha lifecycle, shared session setup, failure screenshots, and teardown. |
| `tests/screenobjects/` | One `BaseScreen` page object per screen; `AppScreen.ts` exports the shared `app` registry. |
| `tests/screenobjects/components/` | UI components shared across screens. |
| `tests/specs/` | Mocha scenarios and assertions, using pages through `app.<page>`. |
| `tests/data/` | Per-flow inputs and expected result strings. |
| `tests/helpers/` | Shared app, device, and test utilities. |
| `templates/` | Starter examples for specs, screen objects, test data, and findings. |
| `docs/poc-findings.md` | Append-only notes for agent-caused test implementation mistakes and prevention rules. |

## Scaffold a requirement

Use `$scaffold <requirement path or flow ID>`, for example:

```text
$scaffold "requirement/forms.md"
```

The workflow reads the requirement and relevant framework files, checks the Android setup, inspects each scenario in the live app, and records observed locators and result text. It then reuses or adds page objects, flow data, and one spec scenario per requirement scenario. New code follows the matching files in `templates/`. Page objects extend `BaseScreen` and are registered in `AppScreen.ts`; specs use that registry. The workflow does not create a feature document.

Before reporting the flow verified, it runs typecheck, lint, and the targeted spec. When app behavior differs from the requirement, keep the required assertion and report the observed result and evidence.

## Heal a failing spec

Use `$heal <spec path>`, optionally with a Mocha title filter. The workflow reproduces the failure, checks the matching requirement, filtered Appium errors, and failure screenshot when needed, then classifies the cause as test defect, app behavior mismatch, or environment failure. It fixes test defects without weakening requirements. App behavior mismatches remain visible as failures and are reported with expected versus observed behavior.

## Test conventions

- Use accessibility IDs first, resource IDs second, UiSelector third, and XPath only as a last resort. Locators must be observed in the live app.
- Keep selectors, interactions, and waits in page objects; keep inputs and expected strings in `tests/data/<flow>TestData.ts`.
- Use one spec per flow and one `it` per requirement scenario. Each spec calls `relaunchApp()` in `before()`.
- Relative TypeScript imports end in `.js`.
- Do not use `driver.pause` or weaken assertions to make a test pass.

See [`AGENTS.md`](./AGENTS.md) for the full repository workflow and conventions.

## Token consumption and efficiency

The repository does not record model token usage, and no exact token count is available for a completed scaffold run. Token use varies with requirement length, number of unique screens and states, locator and screenshot output, generated code, and repair iterations. The figures below are planning estimates, not measured billing data.

For one short requirement covering roughly 4-8 scenarios on one or two screens, budget approximately **10,000-25,000 model tokens** for a complete scaffold and verification cycle:

| Work stage | Typical planning range |
| --- | ---: |
| Read requirement and relevant framework files | 1,000-3,000 tokens |
| Live app inspection and locator/result evidence | 3,000-8,000 tokens |
| Page object, test data, and spec implementation | 4,000-8,000 tokens |
| Typecheck, lint, targeted run, and focused repair | 2,000-6,000 tokens |
| **Estimated total** | **10,000-25,000 tokens** |

Treat this as a rough working range. A multi-screen flow, long requirement, many distinct UI states, or app mismatch can exceed it. Exact consumption must come from the model or product usage meter for the run; it cannot be reconstructed from repository files.

Token use is kept lower by:

- Reading only the requirement and framework files relevant to its screens and flow.
- Reusing existing page objects, shared helpers, templates, and test data patterns.
- Generating locators once per screen state and avoiding repeated full page-source dumps.
- Filtering Appium logs to relevant error lines instead of reading the complete log.
- Exploring each distinct UI state once, then reusing the observed locator and text evidence across related scenarios.
- Running the targeted spec before considering a full-suite run, and fixing only defects demonstrated by the failure.
- Avoiding feature-document duplication and unnecessary exploratory summaries; the requirement remains the behavior source.

### Current verified flow status

- **Signup:** targeted spec passed all 7 scenarios.
- **Forms:** targeted spec passed all 6 scenarios.
- **Login:** S1, S2, and S5-S8 passed individually. S3 and S4 remain failing because the app returns a `Success` alert for an incorrect password and an unregistered email; the requirement expects rejection. See [`requirement/login.md`](./requirement/login.md). Failure screenshots are in `logs/screenshots/` when available.
