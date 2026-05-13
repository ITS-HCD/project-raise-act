import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysDivider } from '../components/wrappers/NysDivider';
import StepNavigation from '../components/StepNavigation';
import type { Contact } from '../types/registration';

const EMPTY_CONTACT: Contact = {
  firstName: '',
  lastName: '',
  title: '',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nys-space-300)' }}>
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
      <div data-field-name={`${prefix}.phone`}>
        <NysTextinput
          label="Business Phone Number"
          type="tel"
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
    if (validate()) navigate('/register/documents');
  }

  function getFieldError(key: string) {
    return getFieldProps(key);
  }

  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-3xl)',
          marginBottom: 'var(--nys-space-200)',
        }}
      >
        Contacts
      </h2>
      <p
        style={{
          fontFamily: 'var(--nys-font-body)',
          fontSize: 'var(--nys-font-size-sm)',
          color: 'var(--nys-color-text-secondary)',
          marginBottom: 'var(--nys-space-400)',
        }}
      >
        Provide contact information for company representatives who can be reached regarding this
        registration.
      </p>

      {/* Primary Contact */}
      <h3
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-xl)',
          marginBottom: 'var(--nys-space-300)',
        }}
      >
        Primary Contact
      </h3>
      <ContactFields
        contact={primary}
        required={true}
        onChange={(update) => dispatch({ type: 'UPDATE_PRIMARY_CONTACT', payload: update })}
        getFieldError={getFieldError}
        prefix="primary"
      />

      <div style={{ margin: 'var(--nys-space-400) 0' }}>
        <NysDivider />
      </div>

      {/* Secondary Contact */}
      <h3
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-xl)',
          marginBottom: 'var(--nys-space-300)',
        }}
      >
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

      <div style={{ margin: 'var(--nys-space-400) 0' }}>
        <NysDivider />
      </div>

      {/* Tertiary Contact */}
      <h3
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-xl)',
          marginBottom: 'var(--nys-space-300)',
        }}
      >
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

      <StepNavigation
        onBack={() => navigate('/register/ownership')}
        onContinue={handleContinue}
      />
    </div>
  );
}
