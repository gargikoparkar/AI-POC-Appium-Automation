---
name: automate-flow
description: Supporting end-to-end sequence for turning a Markdown requirement under requirement/ into tested Android Appium automation. The requirement remains the source of truth; no feature document is created.
argument-hint: <requirement file>
---

# Automate a requirement flow

Use the Markdown requirement directly under `requirement/` as the source of truth. Follow the active `$scaffold` workflow to inspect the app and framework, update screen objects and specs, run typecheck/lint/the targeted test, then use `$heal` for test defects. Keep the source requirement unchanged and do not create a feature document.

Stop if the device, Appium server, or app blocks live inspection. Report each scenario's inspection, implementation, and verification status, with reasons for any gaps. Preserve expected assertions when observed app behavior differs, and include screenshot evidence when available. Close Appium MCP before Mocha.
