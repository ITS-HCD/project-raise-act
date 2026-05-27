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
  percentageOwned: number;
  startDate: string;
  endDate?: string;
}

export interface Contact {
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  email: string;
}

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
}
