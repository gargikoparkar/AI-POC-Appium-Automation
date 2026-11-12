---
name: coding-conventions
description: "Coding rules for this project: TypeScript/ESM imports, locator strategy order and formats, screen object, component and spec structure. Use before writing, editing or reviewing any file in tests/."
user-invocable: false
---

# Coding conventions

## TypeScript

- ESM project (`"type": "module"`): relative imports **must** end in `.js`, even for `.ts` files (`import X from './X.js'`).
- 4-space indent, single quotes, semicolons (enforced by `npm run lint`).
- `async`/`await` everywhere, no floating promises, no `any`.

## Locators

Order of preference:

| # | Strategy | Format passed to `$()` |
|---|---|---|
| 1 | accessibility id | `~button-login` |
| 2 | resource-id | `id:com.app:id/submit` |
| 3 | UiSelector | `android=new UiSelector().textContains("Invalid")` |
| 4 | XPath (last resort) | `//android.widget.TextView[@text="Item"]`, never absolute or index-based, reason documented |

Locators are observed in the live app and used directly in screen objects; never invent them. The source requirement under `requirement/` defines expected behavior.

## Screen objects

- One class per screen, extends `BaseScreen`, `export default new XScreen()`.
- Elements are private getters; actions and state reads are public `async` methods.
- All waits live here (`waitForIsShown`, `waitForDisplayed`, `waitUntil`), never in specs.
- UI shared by several screens goes in `components/` (static methods, no state).
- `BaseScreen.ts` provides shared screen behavior such as `expectLoaded()`. `AppScreen.ts` exports the `app` registry. Register each page object there and access it in specs as `app.<page>`; do not create a separate registry/index file.
- Keep selectors and UI interactions in page objects. Do not keep flow inputs, credentials, or expected result text in page objects.

## Specs

- File: `tests/specs/app.<flow>.spec.ts`. One `describe` per feature, one `it` per scenario, title starts with the scenario ID (`S1: should ...`).
- `before(async () => { await relaunchApp(); })`: all specs share one session, always start clean. Navigation to the screen goes in `beforeEach`.
- No selectors, waits or `driver.pause` in specs. Use page objects through the `app` registry imported from `tests/screenobjects/AppScreen.ts`.
- Put flow-specific test data and expected result strings in `tests/data/<flow>TestData.ts`. Import them into specs; do not define test data constants or credentials in specs or page objects. Specs should contain scenario steps and assertions.
- Device info and app package only in `capabilities/` and `Constants.ts`.
