# RAISE Act Portal — Prompt History

A record of prompts used to build this project with Claude Code and the NYS Design System. Intended as a reference for the team on how to structure prompts for DS-integrated projects.

---

## Session 1: PRD Generation (2026-04-29)

### Prompt 1 — Initial project brief + interview request

```
Create a PRD for a registration portal where AI development companies will log in and
submit information about their companies. Don't worry about login, that will come later.
Focus primarily on the front-end presentation here as backend integration will come later.
Build this out using the NYS Design System. Use DS components when possible. When a
component doesn't exist, use DS tokens to build custom components using the same
engineering approach and practices. At the end, generate a gap analysis for missing
components. Use the images in /screenshots as guidance for the application setup. Use
Vite, Typescript, and React (you'll need to use the Lit React package to wrap our DS
components). Interview me to do this to the best of your ability.

Our DS fonts are currently in the fonts folder. Here's the instructions for installing them:
Extract and Move Files:
Move bundle contents into a folder in your project, e.g. assets/fonts/.

Include the Preconfigured CSS:
Use the provided nysds-fonts.css file to automatically configure font usage:

<link rel="stylesheet" href="/assets/fonts/nysds-fonts.css">
Alternatively, you can import the CSS file in your project's main stylesheet:

@import url('/assets/fonts/nysds-fonts.css');
Or incorporate it into your build process with a tool like Vite, Webpack, or Gulp.

Review the paths in nysds-fonts.css to make sure they correctly point to the font files.

Preloading (Optional):
Preload critical fonts for performance optimization:

<link rel="preload" href="/assets/fonts/proximanova-regular.woff2" as="font" type="font/woff2">
```

> **What happened:** Claude explored the screenshots (10 mockup images of a 6-step registration wizard), queried the NYSDS MCP server for all available components, and began a structured interview to fill in requirements gaps. Key techniques: asking Claude to "interview me" front-loads requirements gathering before any code is written, and pointing it at screenshots gives it visual context for the target UI.

---

### Interview Batch 1 — Context & scope

**Claude asked about:** RAISE Act context, which screenshot layout to target (simple vs. full-app), whether the 6 steps were complete, and who the target users are.

**Answers given:**
- It's about frontier AI companies registering with NY State; DFS reviews submissions; part of a larger portal but we're focused on business registrations.
- 01a shows the full layout; the rest are just main body content — all screens should use the full layout.
- The 6 steps + success page are the complete flow.
- Varied roles (not just compliance officers).

---

### Interview Batch 2 — Form behavior & validation

**Claude asked about:** Save progress, validation depth, ownership section structure, and document upload requirements.

**Answers given:**
- Yes, stub API calls because we'll be handing this off to a backend team for integration.
- Full client-side validation (recommended).
- Ownership step should contain options to add current AND former owners (was an oversight in screenshots).
- Document requirements are unknown right now.

---

### Interview Batch 3 — Technical & UI details

**Claude asked about:** Stepper navigation behavior, agency theme, repeatable field limits, and routing approach.

**Answers given:**
- Clickable completed steps, but use the nys-stepper in the way it's documented.
- Business theme (not admin or default). Also noted: add to Obsidian daily note that we need to update the MCP server to make theme selection easier for LLMs.
- Limits on repeatable entries are unknown — create a section in the PRD with unknowns for stakeholder review.
- React Router (recommended) — each step gets its own route.

---

### Interview Batch 4 — Final details

**Claude asked about:** DFS-specific theme availability, sidebar vs. top stepper layout, and responsive requirements.

**Answers given:**
- Business theme confirmed (no DFS-specific theme exists in NYSDS).
- Sidebar stepper layout (3-col stepper / 9-col form content), matching the DS grid example.
- Responsive behavior should be included in the PRD.

---

### Prompt 2 — Write PRD to project folder

```
Write this plan to the project folder, named raise-act-prd.md
```

> **What happened:** Claude wrote the complete PRD to `raise-act-prd.md` covering technical architecture, all 6 step specs with field-level component mapping, data model, API stubs, validation rules, 18 DS components mapped, 5 gap analysis items, 10 open stakeholder questions, responsive specs, and a verification plan. Also added an MCP server improvement task to the Obsidian daily note.

---

### Prompt 3 — Commit and push

```
commit this and push this up to a new private repo ITS-HCD/project-raise-act
```

> **What happened:** Claude initialized the git repo, created a .gitignore, committed all files (PRD, screenshots, fonts), created the private repo on GitHub via `gh`, and pushed to `ITS-HCD/project-raise-act`.

---

### Prompt 4 — Create prompt history

```
Create a record of the prompts used so far so I can share with the team to help them
better understand best practices for building projects with Claude Code and the NYS
Design System. Write the file to prompt-history.md in the project folder. No need to
capture the Claude Output, though a 1 sentence recap of the output may help orient the
reader. Keep this updated going forward.
```

> **What happened:** This file was created.

---

## Best Practices Observed

1. **Start with "interview me"** — Asking Claude to interview you before generating anything produces much better requirements coverage than trying to write everything upfront.

2. **Provide visual specs** — Putting screenshots in the project folder gives Claude visual context. It read all 10 images and mapped them to specific steps and component needs.

3. **Point to the Design System MCP server** — The NYSDS MCP server (`mcp__nysds__*` tools) lets Claude query component APIs, tokens, themes, and utility classes directly rather than guessing. This produced accurate component-to-field mapping.

4. **Request a gap analysis** — Asking for missing DS components alongside the PRD captures design system feedback that can flow back to the DS team.

5. **Stub the backend** — Specifying "stub API calls for backend handoff" keeps the front-end prototype functional while making integration points explicit for the backend team.

6. **Use plan mode for complex work** — Claude used plan mode to research, interview, and draft before writing anything, which prevented premature code generation.

7. **Batch your interview answers** — Claude asked 3-4 questions at a time with multiple-choice options. Answering in batches is faster than free-form back-and-forth.

8. **Say "I don't know" when you don't** — For unknowns (document types, field limits), saying "I don't know" prompted Claude to add a stakeholder questions section rather than guessing.
