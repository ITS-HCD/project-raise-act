# Implementation Plan — RAISE Act Registration Portal

Reference: `raise-act-prd.md` for detailed specs.

---

## Phase 1: Project Scaffolding & DS Integration

**Goal:** Working Vite + React + TypeScript app with NYSDS components rendering correctly, themed, with fonts loaded.

### Tasks

- [x] 1.1 — Scaffold Vite project with React + TypeScript template (`npm create vite@latest`)
- [x] 1.2 — Install dependencies: `react-router-dom`, `@lit/react`, NYSDS packages (`@nysds/components`, `@nysds/styles`)
- [x] 1.3 — Configure TypeScript strict mode in `tsconfig.json`
- [x] 1.4 — Set up font loading: `@font-face` declarations in `src/styles/app.css` pointing to `/fonts/` (files in `public/fonts/`)
- [x] 1.5 — Apply `business` theme: set `data-theme="business"` on the root `<html>` element
- [x] 1.6 — Import NYSDS global styles (`@nysds/styles/full` — reset, typography, grid utilities, CSS variables) in `app.css`
- [x] 1.7 — Create wrappers for all DS components used (re-exports of `@nysds/components/react` — NYSDS ships its own React wrappers):
  - `NysUnavHeader`, `NysGlobalHeader`, `NysGlobalFooter`, `NysUnavFooter`
  - `NysStepper`, `NysStep`
  - `NysButton`, `NysTextinput`, `NysTextarea`, `NysSelect`, `NysDatepicker`
  - `NysRadiogroup`, `NysRadiobutton`
  - `NysCheckbox`, `NysFileinput`
  - `NysIcon`, `NysDivider`, `NysAlert`
- [x] 1.8 — Verify: `App.tsx` renders `nys-unavheader`, `nys-globalheader`, and `nys-button` — dev server confirmed 200 on all assets, fonts load from `/fonts/`, TypeScript passes with strict mode

**Deliverable:** Empty app shell with DS components rendering, correct theme, and fonts.

---

## Phase 2: Application Shell & Routing

**Goal:** Full page chrome (headers, footers, stepper sidebar) with React Router wired to 6 step routes + success page.

### Tasks

- [x] 2.1 — Set up React Router with routes (see PRD section 2 — Routes table):
  - `/register/business-info` through `/register/review` + `/register/success`
  - Redirect `/` and `/register` to `/register/business-info`
- [x] 2.2 — Build `AppShell.tsx`: full layout with `nys-unavheader`, `nys-globalheader` (appName="RAISE", agencyName="Department of Financial Services"), grid container, `nys-globalfooter`, `nys-unavfooter`
- [x] 2.3 — Add `nys-stepper` in left sidebar (col-3) with 6 `nys-step` children, each with `href` matching its route
- [x] 2.4 — Add "Save and Exit" button in stepper's `actions` slot
- [x] 2.5 — Wire stepper navigation: listen for `nys-step-click` events, `preventDefault()`, use React Router `navigate()`
- [x] 2.6 — Render `<Outlet />` in the right main area (col-9) for step content
- [x] 2.7 — Create placeholder components for all 6 steps + success page (just headings for now)
- [x] 2.8 — Build `StepNavigation.tsx`: reusable Back + Continue button pair. Props: `onBack`, `onContinue`, `showBack` (false for step 1), `continueLabel` (default "Continue", "Continue to review" for step 5, "Submit" for step 6)
- [x] 2.9 — Manage stepper state: track `currentStep` (furthest reached) and `selectedStep` (currently viewing). Update `current` and `selected` attributes on `nys-step` elements as user navigates.
- [x] 2.10 — Verify: click through all steps via Continue/Back, confirm stepper highlights correctly, completed steps are clickable, future steps are not

**Deliverable:** Fully navigable wizard shell with working stepper, headers, footers, and route-based step switching.

---

## Phase 3: Form State & Data Layer

**Goal:** Centralized form state that persists across steps, typed data model, and API stubs.

### Tasks

- [x] 3.1 — Define TypeScript interfaces in `src/types/registration.ts`: `RegistrationData`, `Address`, `Owner`, `Contact` (see PRD section 4)
- [x] 3.2 — Build `RegistrationContext.tsx`: React Context + `useReducer` with actions for updating each section of form data (businessInfo, addresses, ownership, contacts, documents, certification)
- [x] 3.3 — Define initial state with empty/default values for all fields
- [x] 3.4 — Wrap the router in `RegistrationProvider` so all steps can access form state
- [x] 3.5 — Build API stubs in `src/api/stubs.ts`:
  - `saveRegistration(step, data)` — POST stub with ~500ms delay, returns `{ success, registrationId }`
  - `submitRegistration(data)` — POST stub, returns `{ success, registrationId, submittedAt }`
  - `loadRegistration(id)` — GET stub, returns `{ data, currentStep }`
- [x] 3.6 — Wire "Save and Exit" button to call `saveRegistration` with current form state
- [x] 3.7 — Verify: update form state from one step, navigate away and back, confirm data persists

**Deliverable:** Form state context that all steps can read and write, with stubbed API endpoints.

---

## Phase 4: Validation Utilities

**Goal:** Reusable validation functions that integrate with NYSDS component error states.

### Tasks

- [x] 4.1 — Build `src/utils/validation.ts` with validators:
  - `isRequired(value)` — non-empty after trim
  - `isValidEmail(value)` — email format (supplement DS built-in)
  - `isValidPhone(value)` — US phone format
  - `isValidZip(value)` — 5 or 9 digit (XXXXX or XXXXX-XXXX)
  - `isValidPercentage(value)` — number 0-100
  - `isDateAfter(date, referenceDate)` — for end date > start date
- [x] 4.2 — Build a `validateStep(stepNumber, data)` function that returns a map of field names to error messages
- [x] 4.3 — Build a `useStepValidation` hook that integrates validation with component error state (`showError`, `errorMessage` props) and scrolls to the first error on Continue click
- [x] 4.4 — Verify: trigger validation on a step with empty required fields, confirm error messages appear on the correct components

**Deliverable:** Validation layer ready for integration into each step.

---

## Phase 5: Custom Shared Components

**Goal:** Build the three custom components identified in the gap analysis that are used across multiple steps.

### Tasks

- [x] 5.1 — Build `RepeatableFieldGroup.tsx`:
  - Accepts a render prop or child function for the form fields of each entry
  - Manages a list of entries with add / edit / remove operations
  - "+ Add" button (nys-button, outline, sm)
  - Added entries render as summary cards with Edit and Remove links (nys-button, text variant)
  - Edit mode swaps the summary card for the inline form
  - Accessible: `aria-live` region for list updates, `aria-label` on each entry
  - Styled with DS tokens only
- [x] 5.2 — Build `ReviewSection.tsx`:
  - Props: `title`, `editRoute`, `children`
  - Renders section heading with "Edit Section" link (nys-button, text variant, navigates to `editRoute`)
  - Children slot for key-value content
  - Separated with `nys-divider` between sections
  - Styled with DS tokens only
- [x] 5.3 — Build `SuccessConfirmation.tsx`:
  - Full-width layout (no stepper sidebar)
  - nys-icon with check_circle, heading, body text with `registrationId` and `submittedAt`, "Home" nys-button
  - Styled with DS tokens only
- [x] 5.4 — Verify: render each component in isolation, confirm correct layout and DS token usage

**Deliverable:** Reusable custom components ready for step integration.

---

## Phase 6: Step Implementation — Steps 1 & 2

**Goal:** Fully functional Business Info and Addresses steps.

### Tasks

- [ ] 6.1 — **Step 1: Business Info** (`src/steps/BusinessInfo.tsx`)
  - Legal Company Name: nys-textinput, required
  - Additional Names: nys-textarea + RepeatableFieldGroup for adding/removing names
  - Ownership Structure: nys-radiogroup with two nys-radiobutton options
  - Wire all fields to RegistrationContext (read initial values, dispatch on change)
  - Continue button triggers step validation, advances to step 2 on success
- [ ] 6.2 — **Step 2: Addresses** (`src/steps/Addresses.tsx`)
  - Section A — Principal address: Street, Suite, City, State (nys-select with all US states/territories), Zip (width="md", pattern validation)
  - Section B — NY office addresses: RepeatableFieldGroup with same address field set, summary shows formatted address string
  - Wire to context, validate on Continue
- [ ] 6.3 — Verify: complete steps 1 and 2 with valid data, confirm data persists in context, navigate back and forth, trigger validation errors

**Deliverable:** Steps 1 and 2 fully functional with validation and state management.

---

## Phase 7: Step Implementation — Steps 3 & 4

**Goal:** Fully functional Ownership and Contacts steps.

### Tasks

- [ ] 7.1 — **Step 3: Ownership** (`src/steps/Ownership.tsx`)
  - Section A — Current beneficial owners: RepeatableFieldGroup with Owner Type radio (Person/Entity), conditional fields (first/last name for Person, entity name for Entity), Percentage Owned (number, width="sm"), Start Date (nys-datepicker)
  - Section B — Former beneficial owners: same fields + End Date (nys-datepicker, must be after Start Date)
  - Summary cards show "Name - Type" with percentage and date
  - Wire to context, validate on Continue
- [ ] 7.2 — **Step 4: Contacts** (`src/steps/Contacts.tsx`)
  - Three contact sections (Primary, Secondary, Tertiary) using a shared `ContactFields` sub-component
  - Primary: all fields required. Secondary/Tertiary: all fields optional
  - Fields: First Name, Last Name, Title, Business Phone (type="tel"), Business Email (type="email")
  - Wire to context, validate on Continue
- [ ] 7.3 — Verify: add multiple owners (both current and former), confirm conditional fields toggle correctly, fill all three contacts, validate

**Deliverable:** Steps 3 and 4 fully functional.

---

## Phase 8: Step Implementation — Steps 5 & 6 + Success

**Goal:** Document upload, review page, and success page — completing the full wizard flow.

### Tasks

- [ ] 8.1 — **Step 5: Documents** (`src/steps/Documents.tsx`)
  - nys-fileinput with `multiple`, `dropzone`, `accept=".pdf,.doc,.docx"`
  - Wire uploaded files to context (store File objects or file metadata)
  - Continue button label: "Continue to review"
- [ ] 8.2 — **Step 6: Review & Certify** (`src/steps/ReviewCertify.tsx`)
  - Render 5 ReviewSection components (Business Info, Addresses, Ownership, Contacts, Documents)
  - Each section reads from RegistrationContext and displays formatted summary
  - "Edit Section" links navigate to the corresponding step route (stepper shows `selected` on that step, `current` stays on step 6)
  - Certification nys-checkbox, required
  - Submit button calls `submitRegistration` API stub, navigates to `/register/success` on success
- [ ] 8.3 — **Success page** — Wire `SuccessConfirmation` component with registration ID and submission date from API response
- [ ] 8.4 — Verify: complete full wizard end-to-end — fill all steps, review all data on step 6, click "Edit Section" links and return, submit, see success page

**Deliverable:** Complete, end-to-end functional registration wizard.

---

## Phase 9: Polish & Responsive

**Goal:** Responsive behavior, accessibility checks, visual polish against screenshots.

### Tasks

- [ ] 9.1 — Test at desktop (>=1024px), tablet (768-1023px), and mobile (<768px) widths
- [ ] 9.2 — Confirm stepper collapses to compact view on tablet/mobile
- [ ] 9.3 — Confirm form fields stack vertically on mobile, buttons are full-width
- [ ] 9.4 — Compare each step against its screenshot — adjust spacing, field widths, section headings, divider placement
- [ ] 9.5 — Keyboard navigation: tab through all fields and buttons in order, confirm focus management
- [ ] 9.6 — Screen reader testing: verify form labels, error messages announced, stepper state communicated
- [ ] 9.7 — Focus management: when navigating between steps, focus moves to the step heading or first field
- [ ] 9.8 — Error scroll: on validation failure, scroll to and focus the first field with an error
- [ ] 9.9 — Verify: full end-to-end walkthrough at each breakpoint, no layout breaks, all interactions accessible

**Deliverable:** Production-quality, accessible, responsive registration portal.

---

## Phase Summary

| Phase | Description | Estimated Tasks |
|---|---|---|
| 1 | Project scaffolding & DS integration | 8 |
| 2 | Application shell & routing | 10 |
| 3 | Form state & data layer | 7 |
| 4 | Validation utilities | 4 |
| 5 | Custom shared components | 4 |
| 6 | Steps 1 & 2 (Business Info, Addresses) | 3 |
| 7 | Steps 3 & 4 (Ownership, Contacts) | 3 |
| 8 | Steps 5 & 6 + Success (Documents, Review, Confirmation) | 4 |
| 9 | Polish & responsive | 9 |
| **Total** | | **52 tasks** |

### Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
                                  ↓
                              Phase 5
                                  ↓
                         Phase 6 → Phase 7 → Phase 8 → Phase 9
```

Phases 1-4 are sequential (each builds on the last). Phase 5 can start once phase 3 is done (needs context for state management). Phases 6-8 are sequential (each step builds on the previous). Phase 9 is a final pass after all steps are built.
