---
name: explore-flow
description: Supporting procedure for inspecting an Android requirement flow with Appium MCP. Used during scaffold; does not create a feature document or test code.
---

# Live flow inspection

Input: a scenario from the Markdown requirement directly under `requirement/`. This is a supporting procedure for `$scaffold`, not a separate document-generation stage.

1. Check device, app, capabilities, and Appium availability. Stop and report which scenarios cannot be inspected if the environment blocks the app.
2. Use Appium MCP to follow requirement steps on the live app. Prefer `generate_locators`; use at most one page-source call per screen state.
3. Record exact observed locators, screens, result text, and discrepancies for direct use in the screen objects, tests, and final report. Do not write them into a generated feature document.
4. Use accessibility id, resource id, UiSelector, then XPath. If XPath is needed, explain why. Never invent a locator.
5. Note loaders, animations, permissions, keyboard overlays, and webview transitions that affect waits or actions.
6. Close the MCP session before running Mocha.

Do not alter the requirement's expected behavior to match the app. Report differences with evidence.
