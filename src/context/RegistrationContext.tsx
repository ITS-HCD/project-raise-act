import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { RegistrationData, Address, Owner, Contact } from '../types/registration';

const emptyAddress: Address = {
  street: '',
  suite: '',
  city: '',
  state: '',
  zip: '',
};

const emptyContact: Contact = {
  firstName: '',
  lastName: '',
  title: '',
  phone: '',
  email: '',
};

const initialState: RegistrationData = {
  businessInfo: {
    legalName: '',
    additionalNames: [],
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
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface RegistrationContextValue {
  data: RegistrationData;
  dispatch: React.Dispatch<Action>;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, initialState);
  return (
    <RegistrationContext.Provider value={{ data, dispatch }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration(): RegistrationContextValue {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used within RegistrationProvider');
  return ctx;
}
