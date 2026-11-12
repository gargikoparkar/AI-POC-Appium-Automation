---
name: scaffold
description: Turn a Markdown requirement under requirement/ into inspected Android Appium tests by comparing it with the app and existing framework. Does not create feature documents.
argument-hint: <requirement path or flow ID>
---

# Scaffold an Appium test flow

Accept a Markdown requirement directly under `requirement/` or its flow ID. The requirement is the sole source of truth. Preserve it and derive a kebab-case flow ID from its filename unless it specifies one. Do not create or update a feature document.

Follow the repository's `AGENTS.md`; it takes precedence over older supporting skill text. Read `.agents/skills/coding-conventions/SKILL.md`, `.agents/skills/project-architecture/SKILL.md`, `.agents/skills/agent-workflow/SKILL.md`, and `.agents/skills/explore-flow/SKILL.md` only as relevant to the current step.

## Workflow

1. Read the requirement and inspect only framework files needed for its driver, hooks, page objects, test data, helpers, existing tests, and naming. Use matching `templates/` examples for new code files; never use the legacy feature document template in this workflow.
2. Check APK, capabilities, Appium server, and device availability. Use Appium MCP to launch or attach to the app and walk each requested scenario. Observe screens, exact locators, result text, and discrepancies. Prefer `generate_locators`; use at most one page-source call per screen state. Never invent locators. If live inspection is blocked, stop and report the evidence and scenarios left uninspected.
3. Compare the requirement and live app with existing framework code and tests. Reuse existing code; create or update one page object per screen, components, flow test data, helpers, and spec from matching templates. Page objects extend `BaseScreen` and are registered in `AppScreen.ts`; specs import `app` and access pages as `app.<page>`. Do not create a separate registry/index file. Store flow inputs and expected result strings under `tests/data/<flow>TestData.ts`, not in specs or page objects. Use only locators observed in the app. Keep waits in page objects and assertions aligned with the requirement even if the app differs. Do not create `requirement/features/` files or write observations into a generated feature document.
4. Close the MCP session before Mocha. Run `npm run typecheck`, `npm run lint`, and the targeted spec. Fix test implementation defects. If behavior differs from the requirement, retain the expected assertion and report expected versus observed behavior with evidence, including a screenshot path when available.
5. Do not claim verification until the targeted spec has run. Report created/changed files and each scenario's inspection, implementation, and verification status. Explain every gap.

Use `relaunchApp()` in every spec's `before()`. Import `$`, `$$`, and `getDriver` from `src/core/driver.js`; relative imports end in `.js`. Follow locator priority in `AGENTS.md`. Do not use `driver.pause` or weaken assertions.
