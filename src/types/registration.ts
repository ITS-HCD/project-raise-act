export interface Address {
  country: string;
  street: string;
  suite: string;
  state: string;
  city: string;
  zip: string;
}

export interface Owner {
  type: 'person' | 'entity';
  firstName: string;
  lastName: string;
  entityName: string;
}

export interface Contact {
  firstName: string;
  lastName: string;
  title: string;
  phoneCountryCode: string;
  phone: string;
  phoneExtension: string;
  email: string;
}

// Lifecycle of the disclosure statement as far as the filer's dashboard is
// concerned. Drives which card the home page shows and whether wizard steps
// display the "additional information requested" banner.
//   not_started  — nothing submitted yet (default)
//   in_progress  — saved but not yet submitted (e.g. via "Save and Exit")
//   under_review — submitted, awaiting a decision from New York State
//   needs_info   — New York State has requested additional information
//   approved     — New York State has approved the disclosure statement
export type ReviewState =
  | 'not_started'
  | 'in_progress'
  | 'under_review'
  | 'needs_info'
  | 'approved';

export interface RegistrationData {
  businessInfo: {
    legalName: string;
    additionalNames: string[];
    ownershipStructure: 'private' | 'public' | '';
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
  // True once the Business Info step has been submitted (passed validation and
  // advanced). Gates the global company banner so it only appears afterward.
  businessInfoSubmitted: boolean;
  // Snapshot of the legal company name taken when the Business Info step is
  // submitted. The global banner shows THIS (not the live, still-editable
  // `legalName`) so it doesn't update keystroke-by-keystroke while editing.
  companyNameOnFile: string;
  // Set once the full disclosure statement has been submitted from the final
  // review step. Drives the "under review" dashboard card and survives refresh
  // via localStorage. Null until submission succeeds.
  submission: {
    disclosureId: string;
    // ISO 8601 timestamp set when the filer submits the disclosure statement.
    submittedAt: string;
    // ISO 8601 timestamp set server-side when New York State approves the
    // disclosure statement. Null until an approval decision is recorded.
    // BACKEND: populate this when the review status transitions to "approved".
    approvedAt: string | null;
    confirmationEmail: string;
  } | null;
  // Current lifecycle state shown on the dashboard. Set by submission and by
  // the reviewer preview toggle on the home page.
  reviewState: ReviewState;
}
