---
name: review-test
description: Use to review a spec or screen object against the project's rules without editing it. Read-only.
argument-hint: <file path>
allowed-tools: Read, Grep, Glob
---

# review-test

Input: `$ARGUMENTS` (spec or screen object path). Read-only: don't edit unless asked.

Compare against the `coding-conventions` skill (`.agents/skills/coding-conventions/SKILL.md`), the matching template in `templates/`, and the matching source requirement under `requirement/`. Do not require a generated feature document.

## Check

- Locator order and quality (XPath? absolute or index-based?), and whether locators are supported by live app evidence
- `$` / `$$` / `getDriver` imported from `src/core/driver.js`, not used as WebdriverIO globals (`browser`, `driver`)
- Selectors or waits leaking into specs
- Sleeps / `driver.pause`, hardcoded timeouts without a reason
- `relaunchApp()` in `before()`, tests independent of each other
- Scenarios from the source requirement not covered, or `it` titles without the scenario ID
- Missing `.js` extension in relative imports, indent not 4 spaces
- Duplicated logic that belongs in a screen object, component or helper
- Weak or missing assertions, magic strings
- `any` types, floating promises (missing `await`)
- Hardcoded device info or app package outside `capabilities/` and `Constants.ts`

## Output

Short list grouped **Must fix / Should fix / Nice to have**, each with `file:line` and a one-line fix. If something looks like a recurring agent mistake, suggest a one-line rule for AGENTS.md or the responsible skill.
