---
name: agent-workflow
description: Reference for the Appium requirement-to-test workflow, framework templates, and findings log.
user-invocable: false
---

# Agent workflow

The source of truth is the Markdown requirement directly under `requirement/`. The normal flow is:

```text
requirement → inspect live Android app and existing framework → create/update test code → typecheck, lint, run targeted spec → heal defects and report scenario outcomes
```

`$scaffold` reads the requirement, explores the live app through Appium MCP, compares observations with existing tests and screen objects, and creates or updates automation. `$heal` diagnoses a failing spec against the same requirement and live evidence. Do not create a per-flow feature document or use one as a handoff.

## Templates and framework conventions

New page objects, components, specs, and flow test data start from their matching examples in `templates/`. Put one page object per screen under `tests/screenobjects/`; each extends `BaseScreen` and exports a singleton. Register every page object in `AppScreen.ts`, which exports the `app` registry used by specs (for example, `app.login`). Do not create a separate registry/index file. Put inputs and expected result strings in `tests/data/<flow>TestData.ts`, never in specs or page objects. Copy templates into the matching `tests/` folders and follow the import conventions documented in `AGENTS.md`. The legacy `feature.md` template is not part of the normal workflow.

`docs/poc-findings.md` is an append-only log of agent-caused test implementation mistakes and their prevention rules. Use `templates/poc-findings.md` if the findings file does not exist.

## Appium MCP

Check device and app availability before inspection. Use `generate_locators` where possible and no more than one page-source call per screen state. Close the MCP session before running Mocha because one device supports one session.
