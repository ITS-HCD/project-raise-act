import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { RegistrationData, Address, Owner, Contact, ReviewState } from '../types/registration';

const STORAGE_KEY = 'raise-registration';

const emptyAddress: Address = {
  country: '',
  street: '',
  suite: '',
  state: '',
  city: '',
  zip: '',
};

const emptyContact: Contact = {
  firstName: '',
  lastName: '',
  title: '',
  phoneCountryCode: '+1',
  phone: '',
  email: '',
};

const initialState: RegistrationData = {
  businessInfo: {
    legalName: '',
    additionalNames: [''],
    ownershipStructure: '',
  },
  addresses: {
    principal: { ...emptyAddress },
    nyOffices: [],
  },
  ownership: {
    current: [],
    former: [],
  },
  contacts: {
    primary: { ...emptyContact },
    secondary: null,
    tertiary: null,
  },
  documents: [],
  certification: false,
  businessInfoSubmitted: false,
  companyNameOnFile: '',
  submission: null,
  reviewState: 'not_started',
};

type Action =
  | { type: 'UPDATE_BUSINESS_INFO'; payload: Partial<RegistrationData['businessInfo']> }
  | { type: 'UPDATE_PRINCIPAL_ADDRESS'; payload: Partial<Address> }
  | { type: 'SET_NY_OFFICES'; payload: Address[] }
  | { type: 'SET_CURRENT_OWNERS'; payload: Owner[] }
  | { type: 'SET_FORMER_OWNERS'; payload: Owner[] }
  | { type: 'UPDATE_PRIMARY_CONTACT'; payload: Partial<Contact> }
  | { type: 'UPDATE_SECONDARY_CONTACT'; payload: Partial<Contact> | null }
  | { type: 'UPDATE_TERTIARY_CONTACT'; payload: Partial<Contact> | null }
  | { type: 'SET_DOCUMENTS'; payload: File[] }
  | { type: 'SET_CERTIFICATION'; payload: boolean }
  | { type: 'MARK_BUSINESS_INFO_SUBMITTED' }
  | { type: 'CLEAR_COMPANY' }
  | { type: 'SET_SUBMISSION'; payload: NonNullable<RegistrationData['submission']> }
  | { type: 'SET_REVIEW_STATE'; payload: ReviewState }
  | { type: 'RESET' };

function reducer(state: RegistrationData, action: Action): RegistrationData {
  switch (action.type) {
    case 'UPDATE_BUSINESS_INFO':
      return { ...state, businessInfo: { ...state.businessInfo, ...action.payload } };
    case 'UPDATE_PRINCIPAL_ADDRESS':
      return {
        ...state,
        addresses: {
          ...state.addresses,
          principal: { ...state.addresses.principal, ...action.payload },
        },
      };
    case 'SET_NY_OFFICES':
      return { ...state, addresses: { ...state.addresses, nyOffices: action.payload } };
    case 'SET_CURRENT_OWNERS':
      return { ...state, ownership: { ...state.ownership, current: action.payload } };
    case 'SET_FORMER_OWNERS':
      return { ...state, ownership: { ...state.ownership, former: action.payload } };
    case 'UPDATE_PRIMARY_CONTACT':
      return {
        ...state,
        contacts: { ...state.contacts, primary: { ...state.contacts.primary, ...action.payload } },
      };
    case 'UPDATE_SECONDARY_CONTACT':
      return {
        ...state,
        contacts: {
          ...state.contacts,
          secondary: action.payload === null ? null : { ...(state.contacts.secondary ?? emptyContact), ...action.payload },
        },
      };
    case 'UPDATE_TERTIARY_CONTACT':
      return {
        ...state,
        contacts: {
          ...state.contacts,
          tertiary: action.payload === null ? null : { ...(state.contacts.tertiary ?? emptyContact), ...action.payload },
        },
      };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'SET_CERTIFICATION':
      return { ...state, certification: action.payload };
    case 'MARK_BUSINESS_INFO_SUBMITTED':
      // Snapshot the name now so the banner reflects the submitted value, not
      // subsequent live edits to the field.
      return {
        ...state,
        businessInfoSubmitted: true,
        companyNameOnFile: state.businessInfo.legalName,
      };
    case 'CLEAR_COMPANY':
      // Demo helper: hide the banner and reset the company name.
      return {
        ...state,
        businessInfoSubmitted: false,
        companyNameOnFile: '',
        businessInfo: { ...state.businessInfo, legalName: '' },
      };
    case 'SET_SUBMISSION':
      return { ...state, submission: action.payload, reviewState: 'under_review' };
    case 'SET_REVIEW_STATE':
      return { ...state, reviewState: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export interface RegistrationContextValue {
  data: RegistrationData;
  dispatch: React.Dispatch<Action>;
}

export const RegistrationContext = createContext<RegistrationContextValue | null>(null);

// Rehydrate from localStorage so entered data (e.g. the company name) survives
// a page refresh. Uploaded `documents` are File objects that can't be serialized,
// so they're always restored empty.
function loadState(fallback: RegistrationData): RegistrationData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<RegistrationData>;
      const merged = { ...fallback, ...parsed, documents: [] };
      // Backfill the banner snapshot for sessions saved before this field
      // existed, so the banner doesn't disappear on first load after upgrade.
      if (!merged.companyNameOnFile && merged.businessInfoSubmitted) {
        merged.companyNameOnFile = merged.businessInfo.legalName;
      }
      return merged;
    }
  } catch {
    // Corrupt/unavailable storage — fall back to the empty state.
  }
  return fallback;
}

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, documents: [] }));
    } catch {
      // Ignore quota/serialization errors — persistence is best-effort.
    }
  }, [data]);

  return (
    <RegistrationContext.Provider value={{ data, dispatch }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}

