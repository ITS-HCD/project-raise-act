# RAISE Act Registration Portal — Agent Instructions

## Project Overview

This is the **DFS RAISE Act Frontier AI Company Registration Portal** — a 6-step wizard where AI development companies register with the New York State Department of Financial Services. This project is the front-end presentation layer only; backend integration will be handled by a separate team.

**PRD:** See `raise-act-prd.md` for complete requirements, data model, component mapping, and gap analysis.

**Visual specs:** See `/screenshots/` for mockup images of each step.

## Tech Stack

- **Vite** + **TypeScript** (strict mode)
- **React 18+** with React Router v6
- **NYSDS web components** wrapped via `@lit/react`
- **NYSDS `business` theme** (`data-theme="business"`)
- **Proxima Nova / D Sari fonts** loaded from `/fonts/nysds-fonts.css`
- React Context + `useReducer` for cross-step form state
- Stubbed API endpoints (fetch calls with mock responses)

## NYSDS Design System Rules

- **Always use the NYSDS MCP server** (`mcp__nysds__*` tools) for component documentation, design tokens, utility classes, and installation guidance. The MCP server is the authoritative source.
- **Do NOT** read or explore `node_modules/@nysds/` or sibling NYSDS project folders for DS information.
- Available MCP tools: `find_components`, `get_component`, `get_tokens`, `get_utility_classes`, `validate_component_api`
- **Use DS components first.** Only build custom components when no DS component exists (see gap analysis in PRD section 8).
- **Custom components must use DS tokens** (`--nys-color-*`, `--nys-space-*`, `--nys-font-*`, etc.) — never hard-code colors, spacing, or typography values.
- **Use DS utility classes** for layout (`nys-grid-container`, `nys-grid-row`, `nys-grid-col-*`) and responsive breakpoints (`nys-desktop:nys-grid-col-*`).

## Component Wrapping Pattern

Every NYSDS web component used in this project needs a `@lit/react` wrapper in `src/components/wrappers/`. Consult the NYSDS MCP server (`get_component`) for the component's properties, events, and slots before writing each wrapper. Map custom events (e.g., `nys-input`, `nys-change`, `nys-step-click`) to React event handlers.

## Architecture Decisions

- **One route per step** — React Router with routes under `/register/*`. The stepper's `nys-step` elements use `href` attributes matching these routes.
- **Stepper integration** — Use `nys-step-click` events with `e.preventDefault()` + React Router `navigate()` for SPA navigation. Do not allow native link navigation.
- **Form state lives in context** — `RegistrationContext` provides form data and dispatch to all step components. Each step reads/writes its slice of state.
- **API stubs simulate latency** — All stubs in `src/api/stubs.ts` use `setTimeout` (~500ms) to simulate real API behavior. Return typed responses matching the data model in `src/types/registration.ts`.

## File Conventions

- Wrapper components: `src/components/wrappers/Nys{ComponentName}.ts` (e.g., `NysButton.ts`)
- Step components: `src/steps/{StepName}.tsx` (e.g., `BusinessInfo.tsx`)
- Shared UI components: `src/components/{ComponentName}.tsx`
- Types: `src/types/registration.ts`
- Validation utilities: `src/utils/validation.ts`
- Global styles + font imports: `src/styles/app.css`

## What NOT to Do

- Do not add authentication or login flows — that comes later.
- Do not build a real backend — use stubs only.
- Do not use CSS-in-JS or Tailwind — use NYSDS tokens and utility classes for all styling.
- Do not hard-code color values, font stacks, or spacing — always reference DS tokens.
- Do not guess at component APIs — query the NYSDS MCP server for accurate props, events, and slots.
- Do not add AI attribution to git commits (see global CLAUDE.md).
