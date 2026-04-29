# PRD: DFS RAISE Act — Frontier AI Company Registration Portal

## Context

New York State requires frontier AI development companies to register with the Department of Financial Services (DFS) under the RAISE Act. This portal is the company registration flow within a larger RAISE system. The focus of this PRD is the **front-end presentation layer** — backend integration will be handled separately by another team.

The registration is a 6-step wizard where authorized company representatives submit business information, addresses, ownership details, contacts, supporting documents, and a final certification. The screenshots in `/screenshots/` serve as the visual spec.

---

## 1. Technical Architecture

| Concern | Choice |
|---|---|
| Build tool | Vite |
| Language | TypeScript (strict mode) |
| UI framework | React 18+ |
| DS integration | NYSDS web components via `@lit/react` wrappers |
| Routing | React Router v6 (each step = route) |
| Theme | `business` (`data-theme="business"`, primary: `#084b52`) |
| Fonts | Proxima Nova + D Sari from `/fonts/`, loaded via `nysds-fonts.css` |
| State management | React Context + `useReducer` for form state across steps |
| API layer | Stub fetch calls to placeholder endpoints (ready for backend swap) |

### Project Structure

```
project-raise-act/
├── fonts/                          # NYSDS font files (existing)
├── screenshots/                    # Visual specs (existing)
├── public/
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Router + shell layout
│   ├── components/
│   │   ├── wrappers/               # @lit/react wrapper components
│   │   │   ├── NysButton.ts
│   │   │   ├── NysTextinput.ts
│   │   │   ├── NysStepper.ts
│   │   │   └── ...                 # One wrapper per DS component used
│   │   ├── AppShell.tsx            # Global header/footer + stepper layout
│   │   ├── StepNavigation.tsx      # Back / Continue button pair
│   │   ├── RepeatableFieldGroup.tsx # Custom: add/edit/remove pattern
│   │   ├── ReviewSection.tsx       # Custom: summary card with Edit link
│   │   └── SuccessConfirmation.tsx # Custom: success page layout
│   ├── steps/
│   │   ├── BusinessInfo.tsx        # Step 1
│   │   ├── Addresses.tsx           # Step 2
│   │   ├── Ownership.tsx           # Step 3
│   │   ├── Contacts.tsx            # Step 4
│   │   ├── Documents.tsx           # Step 5
│   │   └── ReviewCertify.tsx       # Step 6
│   ├── context/
│   │   └── RegistrationContext.tsx # Form state + dispatch
│   ├── api/
│   │   └── stubs.ts               # Stubbed API endpoints
│   ├── types/
│   │   └── registration.ts        # TypeScript interfaces
│   ├── utils/
│   │   └── validation.ts          # Validation helpers
│   └── styles/
│       └── app.css                 # Global styles, font imports, theme
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 2. Application Shell

The full-app layout wraps every step with a consistent chrome.

### Layout (top to bottom)
1. **`nys-unavheader`** — Universal NY State header (hideSearch, hideTranslate for this app)
2. **`nys-globalheader`** — `appName="RAISE"`, `agencyName="Department of Financial Services"`, `nysLogo`
3. **Main content area** — Grid layout:
   - Left sidebar (col-3 on desktop, col-12 on mobile): `nys-stepper` with `nys-step` children + "Save & exit" button in `actions` slot
   - Right main (col-9 on desktop, col-12 on mobile): Active step form content
4. **`nys-globalfooter`** — Agency footer
5. **`nys-unavfooter`** — Universal NY State footer

### Grid Layout
```html
<div class="nys-grid-container">
  <div class="nys-grid-row">
    <nys-stepper class="nys-grid-col-12 nys-desktop:nys-grid-col-3" label="Register your Company">
      <nys-step label="Business Info" ...></nys-step>
      <nys-step label="Addresses" ...></nys-step>
      <nys-step label="Ownership" ...></nys-step>
      <nys-step label="Contacts" ...></nys-step>
      <nys-step label="Documents" ...></nys-step>
      <nys-step label="Review & Certify" ...></nys-step>
      <div slot="actions">
        <nys-button label="Save and Exit" variant="outline" size="sm" fullWidth></nys-button>
      </div>
    </nys-stepper>
    <main class="nys-grid-col-12 nys-desktop:nys-grid-col-9" id="main-content">
      <!-- Active step renders here via React Router <Outlet /> -->
    </main>
  </div>
</div>
```

### Stepper Behavior (per `nys-step` docs)
- Each `nys-step` gets an `href` matching its route (e.g., `/register/business-info`)
- `current` attribute marks the furthest step reached
- `selected` attribute tracks which step is being viewed
- Previous steps are automatically navigable (clickable)
- Steps beyond `current` are not navigable
- Listen for `nys-step-click` events to integrate with React Router navigation
- On mobile, stepper collapses to compact view

### Routes
| Route | Step | Component |
|---|---|---|
| `/register/business-info` | 1 | `BusinessInfo` |
| `/register/addresses` | 2 | `Addresses` |
| `/register/ownership` | 3 | `Ownership` |
| `/register/contacts` | 4 | `Contacts` |
| `/register/documents` | 5 | `Documents` |
| `/register/review` | 6 | `ReviewCertify` |
| `/register/success` | — | `SuccessConfirmation` |

---

## 3. Step Specifications

### Step 1: Business Info (`/register/business-info`)

**Fields:**

| Field | Component | Props | Validation |
|---|---|---|---|
| Legal Company Name | `nys-textinput` | `label="Legal Company Name"`, `required` | Required, max 200 chars |
| Additional Names | `nys-textarea` | `label="Additional Names"`, `description="..."` | Optional |
| Add Name button | `nys-button` | `label="+ Add name"`, `variant="outline"`, `size="sm"` | — |
| Ownership Structure | `nys-radiogroup` + `nys-radiobutton` | `label="Ownership structure"`, `required` | Required, one selection |

**Repeatable section: Additional Names**
- User enters a name in the textarea, clicks "+ Add name"
- Added names appear as items below with a "Remove" text button
- Uses the custom `RepeatableFieldGroup` component

**Radio options for Ownership Structure:**
- "Privately or closely held"
- "Publicly traded"

**Navigation:** Continue button only (first step, no Back).

---

### Step 2: Addresses (`/register/addresses`)

**Section A: Principal Place of Business**

| Field | Component | Props | Validation |
|---|---|---|---|
| Street | `nys-textinput` | `label="Street"`, `required` | Required |
| Suite / Unit | `nys-textinput` | `label="Suite / Unit"`, `optional` | Optional |
| City | `nys-textinput` | `label="City"`, `required` | Required |
| State | `nys-select` | `label="State"`, `required` | Required, all US states + territories |
| Zip | `nys-textinput` | `label="Zip"`, `required`, `width="md"` | Required, 5 or 9 digit format (XXXXX or XXXXX-XXXX) |

**Section B: New York Office Addresses**
- Description text: explanatory paragraph about NY office requirements
- Uses `RepeatableFieldGroup` with the same address field set as Section A
- Each added address shows as a summary line (e.g., "456 Broadway, Albany, NY 12207-1413") with Edit and Remove links

**Navigation:** Back + Continue

---

### Step 3: Ownership (`/register/ownership`)

**Section A: Current Beneficial Owners**

Uses `RepeatableFieldGroup`. Each entry has:

| Field | Component | Props | Validation |
|---|---|---|---|
| Owner Type | `nys-radiogroup` | `label="Owner Type"`, `required` | Required |
| — Person | `nys-radiobutton` | `value="person"`, `label="Person"` | — |
| — Entity | `nys-radiobutton` | `value="entity"`, `label="Entity"` | — |
| First Name | `nys-textinput` | `label="Owner First Name"`, `required` | Required (if Person) |
| Last Name | `nys-textinput` | `label="Owner Last Name"`, `required` | Required (if Person) |
| Entity Name | `nys-textinput` | `label="Entity Name"`, `required` | Required (if Entity) |
| Percentage Owned | `nys-textinput` | `label="Percentage Owned"`, `type="number"`, `required`, `width="sm"` | Required, 0-100, total across all current owners should sum logically |
| Start Date | `nys-datepicker` | `label="Ownership Start Date"`, `required` | Required, valid date |

Add button: `nys-button` with `label="+ Add additional owner"`, `variant="outline"`, `size="sm"`

Added owners display as summary items: "James Grant - Person" with Percentage Owned, Start Date, and Edit/Remove links.

**Section B: Former Beneficial Owners**

Same field structure as Current, with the addition of:

| Field | Component | Props | Validation |
|---|---|---|---|
| End Date | `nys-datepicker` | `label="Ownership End Date"`, `required` | Required, must be after Start Date |

Add button: `label="+ Add additional former owner"`

**Navigation:** Back + Continue

---

### Step 4: Contacts (`/register/contacts`)

Description text at top: "Point of Contact" explanatory paragraph.

Three contact sections with identical fields:

**Primary Contact (required)**

| Field | Component | Props | Validation |
|---|---|---|---|
| First Name | `nys-textinput` | `label="First Name"`, `required` | Required |
| Last Name | `nys-textinput` | `label="Last Name"`, `required` | Required |
| Title | `nys-textinput` | `label="Title"`, `required` | Required |
| Business Phone | `nys-textinput` | `label="Business Phone Number"`, `type="tel"`, `required` | Required, US phone format (auto-masked by DS) |
| Business Email | `nys-textinput` | `label="Business Email"`, `type="email"`, `required` | Required, valid email format |

**Secondary Contact** — Same fields, all optional.

**Tertiary Contact** — Same fields, all optional.

**Navigation:** Back + Continue

---

### Step 5: Documents (`/register/documents`)

| Field | Component | Props |
|---|---|---|
| Supporting Documentation | `nys-fileinput` | `label="Supporting documentation"`, `multiple`, `dropzone`, `accept=".pdf,.doc,.docx"` |

The file input uses the dropzone variant for drag-and-drop support. Uploaded files display with status and a remove action (built into `nys-fileinput` / `nys-fileitem`).

**Navigation:** Back + "Continue to review" (label change on Continue button)

---

### Step 6: Review & Certify (`/register/review`)

Displays all submitted data in read-only summary format using the custom `ReviewSection` component. Each section has an "Edit Section" link that navigates back to the corresponding step (setting `selected` on the stepper without changing `current`).

**Sections:**
1. **Business Info** — Legal name, additional names, ownership structure
2. **Addresses** — Principal place of business, NY office addresses
3. **Ownership** — Current beneficial owners (name, type, percentage, start date), former beneficial owners (+ end date)
4. **Contacts** — Primary, secondary, tertiary contact details
5. **Documents** — List of uploaded file names with file type indicators

**Certification Checkbox:**

| Field | Component | Props | Validation |
|---|---|---|---|
| Certification | `nys-checkbox` | `label="I certify that the information provided in this registration is true, complete, and current to the best of my knowledge."`, `required` | Required — must be checked to submit |

**Navigation:** Back + Submit (Submit triggers API stub and navigates to success page)

---

### Success Page (`/register/success`)

Custom layout (no stepper sidebar):
- Green checkmark icon (`nys-icon` with `name="check_circle"`)
- Heading: "Your registration was successfully submitted!"
- Body text with submission date and registration ID (from API response)
- Advisory text about DFS review process
- "Home" button (`nys-button`, `variant="filled"`)

---

## 4. Data Model

```typescript
interface RegistrationData {
  businessInfo: {
    legalName: string;
    additionalNames: string[];
    ownershipStructure: 'private' | 'public';
  };
  addresses: {
    principal: Address;
    nyOffices: Address[];
  };
  ownership: {
    current: Owner[];
    former: Owner[];
  };
  contacts: {
    primary: Contact;
    secondary: Contact | null;
    tertiary: Contact | null;
  };
  documents: File[];
  certification: boolean;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
}

interface Owner {
  type: 'person' | 'entity';
  firstName: string;    // Person only
  lastName: string;     // Person only
  entityName: string;   // Entity only
  percentageOwned: number;
  startDate: string;    // ISO date
  endDate?: string;     // ISO date, former owners only
}

interface Contact {
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
}
```

---

## 5. API Stubs

All stubs return mock data with artificial delay (~500ms) to simulate real API behavior. Each returns typed responses matching the data model.

```typescript
// POST /api/registration/save — Save draft at any step
// Request: { step: number, data: Partial<RegistrationData> }
// Response: { success: boolean, registrationId: string }

// POST /api/registration/submit — Final submission
// Request: RegistrationData
// Response: { success: boolean, registrationId: string, submittedAt: string }

// GET /api/registration/:id — Load saved draft
// Response: { data: Partial<RegistrationData>, currentStep: number }
```

The "Save & exit" button calls the save endpoint with current form state. On return, the load endpoint restores state and navigates to the correct step.

---

## 6. Validation Rules

Client-side validation fires on blur (per DS component behavior) and on "Continue" click.

| Field | Rule |
|---|---|
| Required fields | Non-empty after trim |
| Email | Valid email format (built into `nys-textinput type="email"`) |
| Phone | US format (auto-masked by `nys-textinput type="tel"`) |
| Zip code | Pattern: `^\d{5}(-\d{4})?$` (use `pattern` prop) |
| Percentage Owned | Number 0-100 |
| End Date (former owners) | Must be after Start Date |
| Certification checkbox | Must be checked to submit |

**Step-level validation:** The Continue button validates all required fields on the current step. If any fail, scroll to the first error and set `showError` + `errorMessage` on the relevant component.

---

## 7. NYSDS Component Mapping

### DS Components Used Directly

| Component | Usage |
|---|---|
| `nys-unavheader` | Universal state header |
| `nys-globalheader` | App/agency header |
| `nys-stepper` | Step progress sidebar |
| `nys-step` | Individual step indicators (x6) |
| `nys-textinput` | All single-line text fields |
| `nys-textarea` | Additional names input |
| `nys-radiogroup` | Ownership structure, owner type |
| `nys-radiobutton` | Radio options within groups |
| `nys-select` | State dropdown |
| `nys-datepicker` | Ownership start/end dates |
| `nys-fileinput` | Document upload (dropzone mode) |
| `nys-checkbox` | Certification agreement |
| `nys-button` | All actions (Continue, Back, Save & exit, Add, Remove, Edit, Home) |
| `nys-icon` | Success page checkmark |
| `nys-divider` | Section separators |
| `nys-globalfooter` | Agency footer |
| `nys-unavfooter` | Universal state footer |
| `nys-alert` | Error summaries, success messaging |

### DS Utility Classes Used

| Class Pattern | Usage |
|---|---|
| `nys-grid-container` / `nys-grid-row` / `nys-grid-col-*` | Page layout, form field layout |
| `nys-desktop:nys-grid-col-*` | Responsive breakpoints |

### DS Tokens Used (for custom components)

Custom components should consume NYSDS design tokens (CSS custom properties) rather than hard-coded values. Key token categories:
- `--nys-color-*` — Text, background, border colors
- `--nys-space-*` — Padding, margins, gaps
- `--nys-font-*` — Font families, sizes, weights
- `--nys-radius-*` — Border radii
- `--nys-border-*` — Border styles
- `--nys-shadow-*` — Box shadows

---

## 8. Gap Analysis — Missing DS Components

The following UI patterns required by this application do not exist as NYSDS components and must be custom-built using DS tokens:

### 8.1 Repeatable Field Group (`RepeatableFieldGroup`)
**What it is:** A pattern for adding, editing, and removing multiple entries of the same field set (e.g., addresses, owners, names).

**Where it's needed:** Steps 1 (additional names), 2 (NY office addresses), 3 (current + former owners)

**What it includes:**
- Empty state with just the "+ Add" button
- Inline form fields for adding a new entry
- List of added entries as summary cards
- Each card has Edit and Remove actions
- Edit mode replaces the summary card with the inline form
- Accessible labeling for dynamic list management

**DS consideration:** This is a common form pattern that could become a DS component like `nys-repeatable-group` or `nys-dynamic-list`.

---

### 8.2 Review Summary Section (`ReviewSection`)
**What it is:** A read-only summary of form data grouped by section with an "Edit Section" navigation link.

**Where it's needed:** Step 6 (Review & Certify page)

**What it includes:**
- Section heading (e.g., "Business Info")
- Key-value display of submitted data
- "Edit Section" link aligned to the right of the heading
- Supports nested data (e.g., multiple addresses, multiple owners)
- Visual hierarchy with section dividers

**DS consideration:** This pattern is common in multi-step form applications. Could become `nys-summary-list` or `nys-review-section`.

---

### 8.3 Success / Confirmation Page
**What it is:** A centered confirmation layout with icon, heading, description, and a reference ID.

**Where it's needed:** Post-submission success page

**What it includes:**
- Large success icon (checkmark in circle)
- Confirmation heading
- Descriptive body text with dynamic values (date, ID)
- Primary action button ("Home")

**DS consideration:** Could be a variant of `nys-alert` (full-page mode) or a standalone `nys-confirmation` component.

---

### 8.4 User Profile Indicator
**What it is:** The logged-in user's name and avatar displayed in the global header area.

**Where it's needed:** Screenshots show "Joe Google" with avatar in the top-right header area.

**Note:** This is out of scope for this phase (login comes later), but the `nys-globalheader` does not natively support a user profile slot. The `nys-avatar` component exists and could be composed into the header's nav slot.

**DS consideration:** `nys-globalheader` could benefit from a dedicated `user` slot or `userName` prop for authenticated app contexts.

---

### 8.5 Form Section Heading
**What it is:** A styled heading with optional description text used to divide form steps into sub-sections.

**Where it's needed:** Within steps 2 ("Address of the principal place of business", "New York office addresses"), step 3 ("Current beneficial owners", "Former beneficial owners"), step 4 ("Primary Contact", "Secondary Contact", "Tertiary Contact")

**What it includes:**
- Heading text (h2/h3 level)
- Optional description paragraph below

**DS consideration:** While achievable with HTML + DS typography tokens, a `nys-form-section` or `nys-fieldset` component would formalize this pattern and ensure consistent spacing/styling.

---

## 9. Open Questions for Stakeholders

| # | Question | Impact |
|---|---|---|
| 1 | Are there maximum limits on repeatable entries (additional names, NY addresses, owners)? | Affects validation rules and UI performance |
| 2 | What specific document types are required for upload? Are certain documents mandatory? | Affects Step 5 UI — could need named upload slots vs. general upload |
| 3 | What file types and size limits apply to document uploads? | Affects `nys-fileinput` `accept` prop and validation |
| 4 | Should ownership percentages across all current owners sum to 100%? | Affects cross-field validation logic |
| 5 | Are there specific field length limits (e.g., max chars for company name, address)? | Affects `maxlength` props |
| 6 | What happens when a user clicks "Save & exit"? Where do they return to? | Affects save/restore flow and routing |
| 7 | Is there an idle timeout / session expiry requirement? | Affects UX and save behavior |
| 8 | Should the "Entity" owner type show different fields than "Person"? | Affects conditional form rendering in Step 3 |
| 9 | Will registration IDs be generated client-side (temporary) or server-side? | Affects success page implementation |
| 10 | Are there accessibility requirements beyond WCAG 2.1 AA? | NYSDS components are AA-compliant; confirms no additional needs |

---

## 10. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (>= 1024px) | Sidebar stepper (3-col) + form content (9-col) |
| Tablet (768-1023px) | Stepper collapses to compact view above form content (full-width) |
| Mobile (< 768px) | Compact stepper, single-column stacked form fields, full-width buttons |

The `nys-stepper` component handles its own responsive collapse to compact view. Form fields using `width="full"` naturally stack. The grid system's responsive classes (`nys-desktop:nys-grid-col-*`) handle the sidebar-to-stacked transition.

---

## 11. Verification Plan

1. **Scaffold the project:** `npm create vite@latest` with React + TypeScript template, install NYSDS packages and `@lit/react`
2. **Fonts:** Verify Proxima Nova / D Sari load correctly via `nysds-fonts.css`
3. **Theme:** Confirm `data-theme="business"` applies correct color palette
4. **Each step:** Navigate through all 6 steps, verify field rendering, validation on blur, and Continue/Back behavior
5. **Stepper interaction:** Verify completed steps are clickable, future steps are not, compact view works on mobile
6. **Repeatable fields:** Add, edit, remove entries in each repeatable section
7. **File upload:** Test drag-and-drop and click-to-browse, verify file list display
8. **Review page:** Confirm all entered data renders correctly, "Edit Section" links navigate to correct step
9. **Certification + Submit:** Verify checkbox required, submit triggers API stub, success page renders
10. **Save & exit:** Verify API stub is called with current state
11. **Responsive:** Test at desktop, tablet, and mobile widths
12. **Accessibility:** Keyboard-navigate entire flow, test with screen reader, verify ARIA attributes
