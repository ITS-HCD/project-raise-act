# Project Instructions

See `AGENTS.md` for full project context, tech stack, DS rules, architecture decisions, and file conventions.

## Key References

- **PRD:** `raise-act-prd.md` — Complete requirements, data model, component mapping, validation rules, gap analysis
- **Visual specs:** `/screenshots/` — Mockup images for each registration step
- **Prompt history:** `prompt-history.md` — Record of prompts used to build this project

## Quick Rules

1. Query the **NYSDS MCP server** for component docs — do not read `node_modules/@nysds/`.
2. Use **DS components** when they exist; use **DS tokens** for custom components. Never hard-code design values.
3. Wrap NYSDS web components with **`@lit/react`** in `src/components/wrappers/`.
4. All API calls go through **stubs** in `src/api/stubs.ts` — no real backend.
5. No authentication — login is out of scope.
6. Update `prompt-history.md` when new prompts are used in this project.
