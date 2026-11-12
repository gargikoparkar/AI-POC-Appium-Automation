# Appium Android test framework

This repository contains an Android only Appium (UiAutomator2) test framework using TypeScript and Mocha. WebdriverIO is the client library; the project does not use the WebdriverIO runner.

`README.md` contains upstream material that may be outdated. Prefer this file, the relevant project skill, and `package.json` for current conventions.

## Commands and environment

- `npm test` runs all specs.
- `npx mocha tests/specs/app.<flow>.spec.ts` runs one spec; add `-g "title"` to filter a test.
- Run `npm run typecheck` and `npm run lint` after code changes.
- Requires Node >= 20.19, `ANDROID_HOME`, and an Android device visible as `device` in `adb devices`.
- Close any Appium MCP session before `npm test`; one device supports one session.

## Project conventions

- Import `$`, `$$`, and `getDriver` from `src/core/driver.js`; relative imports end in `.js`.
- Locator preference: accessibility id, resource id, UiSelector, then XPath as a last resort. Use locators observed in the live app; never invent them.
- Use the Page Object Model: one page object per screen under `tests/screenobjects/`, extending `BaseScreen` and exporting a singleton. `BaseScreen.ts` provides shared screen behavior such as `expectLoaded()`; `AppScreen.ts` is the central registry and exports `app` with named page objects (for example, `app.login`). Register every new page object in `AppScreen.ts`. Specs import `app` from `AppScreen.ts` and use its page objects directly; do not create a separate registry/index file.
- Keep locators, screen actions, and waits in page objects. Keep test data and expected result strings in `tests/data/<flow>TestData.ts`; do not define test data in specs or page objects. Specs contain scenario steps and assertions and import test data from `tests/data/`.
- Do not use `driver.pause` or weaken assertions to make a test pass.
- Every spec calls `relaunchApp()` in `before()`.
- Start new test code files from matching templates in `templates/`.
- Device information and app package belong in `capabilities/` and `Constants.ts`.

## Efficient inspection

- Never read all of `logs/appium.log`; inspect only `Select-String -Pattern 'error|exception' logs/appium.log | Select-Object -Last 50`.
- Appium page source is expensive. Prefer `generate_locators` and use at most one page source call per screen state.
- Read only files needed for the current task.

## Workflow entry points

Project skills and supporting guides live under `.agents/skills/`; use the two entry skills for normal workflow and consult supporting guides only when relevant.
These workflow definitions in `AGENTS.md` take precedence over older or narrower instructions in supporting skill files.

### `$scaffold` — requirement to verified automation

Accept a Markdown requirement file directly under `requirement/`, with any basename (including spaces), or its flow ID. The requirement file is the source of truth. Derive a kebab-case flow ID from its filename (for example `requirement/Parabank_Bill Pay_testcases.md` becomes `parabank-bill-pay-testcases`) unless it explicitly specifies one.

Invoke it with the source path, quoting paths that contain spaces: `$scaffold "requirement/<filename>.md"`. Do not require users to rename or move their source requirement. Do not create a feature document; use the requirement, live inspection, and existing framework code directly.

1. Read the requirement and inspect only the framework files needed to understand the existing driver, hooks, screen objects, test data, helpers, templates, and naming conventions.
2. Check the APK, capabilities, Appium server, and device setup. Use Appium MCP to launch or attach to the app, walk each requested scenario, and inspect exact locators, result text, and discrepancies. Never invent locators. Close the MCP session before running Mocha.
3. Compare the requirement with the existing framework and tests. Reuse existing code where appropriate; create or update page objects, components, test data, helpers, and spec from matching templates. Use one page object per screen, extend `BaseScreen`, register it in `AppScreen.ts`, and access pages in specs through `app.<page>`. Put flow test data and expected result strings in `tests/data/<flow>TestData.ts`, never inline in specs or page objects. Use only locators observed in the app. Keep waits in page objects and assertions aligned with the requirement, even when the app differs. Do not create `requirement/features/` records.
4. Run `npm run typecheck`, `npm run lint`, and the targeted spec. Fix test implementation defects found during the run. If behavior differs from the requirement, retain the expected assertion and report expected versus observed behavior with evidence, including a screenshot path when available.

Report per-scenario inspection, implementation, and verification results in the final summary. Stop and report when the device, Appium server, or app prevents live inspection, including which scenarios remain uninspected. Explain every scenario gap. Do not claim the flow is verified until the targeted spec has run.

### `$heal` — diagnose and repair a failing spec

Accept a failing spec path and optional Mocha title filter. Start with the Mocha failure and stack, then compare the failing steps and expected behavior with the matching source requirement under `requirement/`. Inspect only relevant Appium log lines (`Select-String -Pattern 'error|exception' logs/appium.log | Select-Object -Last 50`) and inspect the failure snapshot in `logs/screenshots/` when the failure text does not establish the actual UI state. Use focused live inspection when the requirement and existing evidence do not establish the correct locator or behavior. Classify the cause before editing:

- For a test defect (locator, wait, state setup, or test logic), fix the root cause without weakening the required behavior, then rerun the targeted test.
- For an app behavior mismatch, keep the expected assertion intact; do not skip, rename, delete, or rewrite the failing test to match the app. Report expected versus observed behavior and the failure snapshot path.
- For an environment failure (for example, unavailable device, session, server, or app), do not change application or test code; report the blocking error and relevant filtered log evidence.

Limit the diagnosis and repair loop to three attempts. After a fix, rerun the targeted spec to confirm it. Stop immediately for an environment failure. Append agent-caused mistakes to `docs/poc-findings.md` when applicable. Report each scenario/test as passed, fixed, failed due to app behavior, or unable to run, with the reason.

## Supporting references

- `.agents/skills/coding-conventions/SKILL.md`: TypeScript, locator, screen object, and spec rules.
- `.agents/skills/project-architecture/SKILL.md`: framework layout, configuration, environment variables, and timeouts.
- `.agents/skills/agent-workflow/SKILL.md`: framework workflow and templates.
- `.agents/skills/explore-flow/SKILL.md`: Appium MCP exploration limits and evidence format.
- `.agents/skills/review-test/SKILL.md`: optional read-only review when requested.

The discoverable entry skills are `.agents/skills/scaffold/SKILL.md` and `.agents/skills/heal/SKILL.md`. Invoke them as `$scaffold` and `$heal`; the other skills under `.agents/skills/` are supporting references. The requirement under `requirement/` remains the source of truth; do not create a feature document.
