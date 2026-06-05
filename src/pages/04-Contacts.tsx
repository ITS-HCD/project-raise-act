import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysSelect } from '../components/wrappers/NysSelect';
import { NysDivider } from '../components/wrappers/NysDivider';
import StepNavigation from '../components/StepNavigation';
import type { Contact } from '../types/registration';

const COUNTRY_CODES = [
  { value: '+1', label: 'United States (+1)' },
  { value: '+1', label: 'Canada (+1)' },
  { value: '+52', label: 'Mexico (+52)' },
  { value: '+44', label: 'United Kingdom (+44)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+86', label: 'China (+86)' },
  { value: '+49', label: 'Germany (+49)' },
  { value: '+33', label: 'France (+33)' },
  { value: '+91', label: 'India (+91)' },
  { value: '+81', label: 'Japan (+81)' },
  { value: '+82', label: 'South Korea (+82)' },
  { value: '+65', label: 'Singapore (+65)' },
];

const EMPTY_CONTACT: Contact = {
  firstName: '',
  lastName: '',
  title: '',
  phoneCountryCode: '+1',
  phone: '',
  email: '',
};

interface ContactFieldsProps {
  contact: Contact;
  required: boolean;
  onChange: (update: Partial<Contact>) => void;
  getFieldError: (key: string) => { showError: boolean; errorMessage: string };
  prefix: string;
}

function ContactFields({
  contact,
  required,
  onChange,
  getFieldError,
  prefix,
}: ContactFieldsProps) {
  function field(name: keyof Contact) {
    return getFieldError(`${prefix}.${name}`);
  }

  function handleInput(name: keyof Contact) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
      onChange({ [name]: value });
    };
  }

  return (
    <div style={{ gap: 'var(--nys-space-150)', display: 'flex', flexDirection: 'column' }}>
      <div data-field-name={`${prefix}.firstName`}>
        <NysTextinput
          label="First Name"
          required={required}
          optional={!required}
          value={contact.firstName}
          showError={field('firstName').showError}
          errorMessage={field('firstName').errorMessage}
          onNysInput={handleInput('firstName')}
        />
      </div>
      <div data-field-name={`${prefix}.lastName`}>
        <NysTextinput
          label="Last Name"
          required={required}
          optional={!required}
          value={contact.lastName}
          showError={field('lastName').showError}
          errorMessage={field('lastName').errorMessage}
          onNysInput={handleInput('lastName')}
        />
      </div>
      <div data-field-name={`${prefix}.title`}>
        <NysTextinput
          label="Title"
          required={required}
          optional={!required}
          value={contact.title}
          showError={field('title').showError}
          errorMessage={field('title').errorMessage}
          onNysInput={handleInput('title')}
        />
      </div>
      <div data-field-name={`${prefix}.phoneCountryCode`}>
        <NysSelect
          label="Country code"
          width="sm"
          value={contact.phoneCountryCode}
          onNysChange={handleInput('phoneCountryCode')}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </NysSelect>
      </div>
      <div data-field-name={`${prefix}.phone`}>
        <NysTextinput
          label="Business Phone Number"
          type="text"
          required={required}
          optional={!required}
          value={contact.phone}
          showError={field('phone').showError}
          errorMessage={field('phone').errorMessage}
          onNysInput={handleInput('phone')}
        />
      </div>
      <div data-field-name={`${prefix}.email`}>
        <NysTextinput
          label="Business Email"
          type="email"
          required={required}
          optional={!required}
          value={contact.email}
          showError={field('email').showError}
          errorMessage={field('email').errorMessage}
          onNysInput={handleInput('email')}
        />
      </div>
    </div>
  );
}

export default function Contacts() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(4, data);

  const { primary, secondary, tertiary } = data.contacts;

  function handleContinue() {
    if (validate()) navigate('/register/review');
  }

  function getFieldError(key: string) {
    return getFieldProps(key);
  }

  return (
    <div>
      <h2>
        Point of Contact
      </h2>
      <p>
        This contact is responsible for receiving inquiries from the office or other governmental entities.
      </p>
      <NysDivider />

      {/* Primary Contact */}
      <h3>
        Primary Contact
      </h3>
      <ContactFields
        contact={primary}
        required={true}
        onChange={(update) => dispatch({ type: 'UPDATE_PRIMARY_CONTACT', payload: update })}
        getFieldError={getFieldError}
        prefix="primary"
      />

      <NysDivider />

      {/* Secondary Contact */}
      <h3>
        Secondary Contact
      </h3>
      <ContactFields
        contact={secondary ?? EMPTY_CONTACT}
        required={false}
        onChange={(update) =>
          dispatch({ type: 'UPDATE_SECONDARY_CONTACT', payload: update })
        }
        getFieldError={getFieldError}
        prefix="secondary"
      />

      <NysDivider />

      {/* Tertiary Contact */}
      <h3>
        Tertiary Contact
      </h3>
      <ContactFields
        contact={tertiary ?? EMPTY_CONTACT}
        required={false}
        onChange={(update) =>
          dispatch({ type: 'UPDATE_TERTIARY_CONTACT', payload: update })
        }
        getFieldError={getFieldError}
        prefix="tertiary"
      />
      <NysDivider />
      <StepNavigation
        onBack={() => navigate('/register/ownership')}
        onContinue={handleContinue}
      />
    </div>
  );
}
