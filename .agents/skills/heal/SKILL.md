---
name: heal
description: Diagnose and repair a failing Android Appium Mocha spec while preserving required behavior. Use with a spec path and optional Mocha title filter.
argument-hint: <spec path> [-g "test title"]
---

# Diagnose and repair an Appium spec

Accept a spec path and optional Mocha title filter. Follow `AGENTS.md` and inspect only files relevant to the failing flow.

## Workflow

1. Confirm there is no Appium MCP session open and `adb devices` shows the device as `device`. If a session cannot start or the device is unavailable, classify it as an environment failure, report the evidence, and stop without changing application or test code.
2. Run the targeted spec with `npx mocha <spec>`, adding `-g "title"` when supplied.
3. For a failure, diagnose in order: Mocha error and stack; the matching requirement under `requirement/`; filtered Appium errors using `Select-String -Pattern 'error|exception' logs/appium.log | Select-Object -Last 50`; then the relevant failure screenshot in `logs/screenshots/` if the UI state is not clear from the error. If the requirement cannot be matched from the spec or flow ID, inspect only relevant requirement files.
4. Classify the cause before editing:
   - Test defect (locator, wait, setup, or logic): fix the root cause without weakening required behavior. If existing code and evidence do not establish the locator, use one focused `generate_locators` MCP call against the live app. Never invent locators or create a feature doc to record them.
   - App behavior mismatch: keep the required assertion intact. Do not skip, rename, delete, or rewrite the test to match the app. Report expected versus observed behavior and screenshot evidence; continue healing other failing tests.
   - Environment failure: stop immediately and do not change code.
5. Limit the diagnosis and repair loop to three attempts. After a fix, rerun the targeted test to confirm it. Report each scenario/test's verification result and leave the source requirement unchanged.
6. When a test implementation defect is fixed, append an entry to `Agent mistakes` in `docs/poc-findings.md` when applicable. Create it from `templates/poc-findings.md` if missing. Do not read all of a large findings file just to append.

Never add sleeps or `driver.pause`, raise timeouts blindly, weaken assertions, or change root hooks, `src/core/`, or capabilities to hide a spec problem. Never read the whole `logs/appium.log`.

Report attempts and scenario-level coverage: for each scenario/test, state whether it passed, was fixed, failed because app behavior differs, or could not run, with the reason. Include the cause and fix, expected versus observed behavior for app mismatches, screenshot paths when available, and relevant environment evidence.
