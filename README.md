# RAISE Act Registration Portal — Backend Handoff

Frontend for the DFS RAISE Act Frontier AI Company Registration Portal. AI development companies use this 6-step wizard to register with the New York State Department of Financial Services. The frontend is complete and production-ready; this document is for the backend team taking over API integration.

- **Framework:** React 19 + TypeScript (strict mode)
- **Build:** Vite 8 (dev server + production bundle)
- **Routing:** React Router 7
- **Design System:** NYSDS 1.18.1 (`business` theme)
- **State:** React Context + `useReducer` (no Redux, no external store)
- **API layer:** Fully stubbed — replace stubs to connect a real backend

## Getting Started

```
npm install
npm run dev        # Dev server on http://localhost:5173
```

### Available scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot reload |
| `npm run build`   | TypeScript check + production bundle  |
| `npm run preview` | Preview production build locally      |
| `npm run lint`    | Run ESLint                            |

### Prerequisites

- Node.js 18+
- npm 9+

No environment variables are required to run the app locally — all API calls are currently stubbed with mock responses and a simulated 500ms delay.

## Project Structure

```
src/
├── api/
│   └── stubs.ts              # ← Replace these with real fetch calls
├── components/
│   ├── wrappers/             # @lit/react wrappers for NYSDS web components
│   ├── AppShell.tsx          # Global layout (headers, footers, stepper sidebar)
│   ├── StepNavigation.tsx    # Back/Continue button pair
│   ├── RepeatableFieldGroup.tsx
│   ├── ReviewSection.tsx
│   └── SuccessConfirmation.tsx
├── context/
│   └── RegistrationContext.tsx   # All form state lives here
├── steps/
│   ├── 01-BusinessInfo.tsx
│   ├── 02-Addresses.tsx
│   ├── 03-Ownership.tsx
│   ├── 04-Contacts.tsx
│   ├── 05-Documents.tsx
│   ├── 06-ReviewCertify.tsx
│   └── 07-SuccessPage.tsx
├── types/
│   └── registration.ts       # TypeScript interfaces — match these in your backend
└── utils/
    └── validation.ts         # Client-side validators (mirror these server-side)
```

## API Integration

All API calls go through `src/api/stubs.ts`. Replace the three stub functions with real `fetch` calls — the frontend code doesn't need to change anywhere else.

### Stub signatures

```typescript
// Save draft at any step
export async function saveRegistration(
  step: number,
  data: Partial<RegistrationData>,
): Promise<SaveResponse>;

// Final submission (called on Step 6 — Review & Certify)
export async function submitRegistration(
  data: RegistrationData,
): Promise<SubmitResponse>;

// Load a saved draft by ID
export async function loadRegistration(id: string): Promise<LoadResponse>;
```

### Expected response shapes

```typescript
interface SaveResponse {
  success: boolean;
  registrationId: string; // e.g. "REG-DRAFT-001"
}

interface SubmitResponse {
  success: boolean;
  registrationId: string; // e.g. "REG-2024-00042" — shown on success page
  submittedAt: string; // ISO 8601 datetime — shown on success page
}

interface LoadResponse {
  data: Partial<RegistrationData>;
  currentStep: number;
}
```

### Routes

| Method | Path                              | Description                 |
| ------ | --------------------------------- | --------------------------- |
| `POST` | `/api/registration/save`          | Save draft for a given step |
| `POST` | `/api/registration/submit`        | Final submission            |
| `GET`  | `/api/registration/:id`           | Load saved draft            |
| `POST` | `/api/registration/:id/documents` | Upload supporting documents |

> Note: The document upload endpoint is not yet stubbed — file handling will need to be added to both `stubs.ts` and Step 5 (`05-Documents.tsx`).

## Data Model

Defined in `src/types/registration.ts`. Mirror this in your backend schema.

```typescript
interface RegistrationData {
  businessInfo: {
    legalName: string;
    additionalNames: string[];
    ownershipStructure: "private" | "public" | "";
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
  type: "person" | "entity";
  firstName: string; // person only
  lastName: string; // person only
  entityName: string; // entity only
  percentageOwned: number;
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate?: string; // ISO date — required for former owners
}

interface Contact {
  firstName: string;
  lastName: string;
  title: string;
  phone: string; // 10 digits, formatting stripped client-side
  email: string;
}
```

## Validation Rules

Client-side validation is in `src/utils/validation.ts`. These rules should be mirrored server-side.

| Field                  | Rule                                             |
| ---------------------- | ------------------------------------------------ |
| Required fields        | Non-empty string or valid number                 |
| Email                  | Standard format (`user@domain.tld`)              |
| Phone                  | 10 digits after stripping non-numeric characters |
| Zip code               | `12345` or `12345-6789`                          |
| Percentage             | 0–100 (numeric)                                  |
| Former owner `endDate` | Must be after `startDate`                        |
| Certification          | Must be `true` to submit                         |

### Step-by-step required fields

| Step                 | Required                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1 — Business Info    | `legalName`, `ownershipStructure`                                                                                    |
| 2 — Addresses        | `principal.street`, `principal.city`, `principal.state`, `principal.zip`                                             |
| 3 — Ownership        | Per owner: `type`, name fields (based on type), `percentageOwned`, `startDate`; former owners also require `endDate` |
| 4 — Contacts         | `primary`: all five fields (`firstName`, `lastName`, `title`, `phone`, `email`)                                      |
| 5 — Documents        | No required fields — upload is optional                                                                              |
| 6 — Review & Certify | `certification: true`                                                                                                |

## Frontend Routes

The app is a single-page application. All routes are client-side — your backend only needs to serve `index.html` for any path under `/register/*`.

| Route                     | Step                                  |
| ------------------------- | ------------------------------------- |
| `/register/business-info` | Step 1 — Business Info                |
| `/register/addresses`     | Step 2 — Addresses                    |
| `/register/ownership`     | Step 3 — Ownership                    |
| `/register/contacts`      | Step 4 — Contacts                     |
| `/register/documents`     | Step 5 — Documents                    |
| `/register/review`        | Step 6 — Review & Certify             |
| `/register/success`       | Success page (shown after submission) |

## Design System (NYSDS)

The frontend uses the [New York State Design System](https://designsystem.ny.gov/) (NYSDS) v1.17.0. You do not need to interact with NYSDS for backend work, but here is context in case you need to run or modify the frontend:

- **Theme:** `business` — set via `data-theme="business"` on `<html>` in `index.html`
- **Components:** NYSDS ships as HTML custom elements (web components). In this React project they are wrapped with `@lit/react` — see `src/components/wrappers/`
- **Fonts:** Proxima Nova and D Sari, loaded from `/public/fonts/` — no CDN dependency
- **Styling:** All custom styles use NYSDS CSS design tokens (`--nys-color-*`, `--nys-space-*`, etc.) — no hardcoded values

If you need to look up a component's API or available tokens, the NYSDS documentation is at [designsystem.ny.gov](https://designsystem.ny.gov/).

## What the Backend Needs to Build

1. **API endpoints** — Implement the three routes above (save, submit, load). See stub signatures for request/response shapes.
2. **Database schema** — Store draft and submitted registrations. The `RegistrationData` interface above is the shape of the data you will receive.
3. **File storage** — Step 5 collects supporting documents. The frontend currently has no upload endpoint wired up — this needs to be built on both sides.
4. **Registration ID generation** — The success page displays the `registrationId` returned by `submitRegistration`. Use a human-readable format (e.g., `REG-2025-00042`).
5. **Session / draft persistence** — The frontend calls `saveRegistration` on each step's Continue click. The backend should associate drafts with a session or user so they can be resumed.
6. **Authentication** — Not yet implemented on the frontend. User login, session management, and authorized representative verification are out of scope for the frontend handoff.
7. **Email notifications** — Send a confirmation email after successful submission. The `submittedAt` timestamp and `registrationId` from `SubmitResponse` appear on the success page and should also go in the email.
8. **Server-side validation** — Mirror the client-side rules in `src/utils/validation.ts`. Never trust client-only validation for final submission.

## Key Documents

| File                        | Description                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `raise-act-prd.md`          | Full product requirements — data model, business rules, gap analysis                        |
| `implementation-plan.md`    | Frontend build plan (all phases complete) — useful for understanding what was built and why |
| `src/api/stubs.ts`          | The three API stubs to replace                                                              |
| `src/types/registration.ts` | TypeScript data model                                                                       |
| `src/utils/validation.ts`   | All client-side validation rules                                                            |
| `screenshots/`              | Visual mockups for each step                                                                |
