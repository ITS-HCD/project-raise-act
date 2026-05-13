import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysSelect } from '../components/wrappers/NysSelect';
import { NysDivider } from '../components/wrappers/NysDivider';
import { RepeatableFieldGroup } from '../components/RepeatableFieldGroup';
import StepNavigation from '../components/StepNavigation';
import type { Address } from '../types/registration';

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'GU', label: 'Guam' },
  { value: 'MP', label: 'Northern Mariana Islands' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'VI', label: 'U.S. Virgin Islands' },
];

const EMPTY_ADDRESS: Address = { street: '', suite: '', city: '', state: '', zip: '' };

function formatAddressSummary(addr: Address): string {
  const parts = [addr.street];
  if (addr.suite) parts.push(addr.suite);
  parts.push(`${addr.city}, ${addr.state} ${addr.zip}`);
  return parts.join(', ');
}

interface AddressFormFieldsProps {
  address: Address;
  onChange: (update: Partial<Address>) => void;
  fieldErrors?: { showError: (key: string) => boolean; message: (key: string) => string };
  fieldPrefix?: string;
}

function AddressFormFields({ address, onChange, fieldErrors, fieldPrefix = '' }: AddressFormFieldsProps) {
  function field(name: keyof Address) {
    const key = fieldPrefix ? `${fieldPrefix}.${name}` : name;
    return {
      showError: fieldErrors ? fieldErrors.showError(key) : false,
      errorMessage: fieldErrors ? fieldErrors.message(key) : '',
    };
  }

  function handleInput(fieldName: keyof Address) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
      onChange({ [fieldName]: value });
    };
  }

  function handleStateChange(e: Event) {
    const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
    onChange({ state: value });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nys-space-300)' }}>
      <NysTextinput
        label="Street Address"
        required
        value={address.street}
        showError={field('street').showError}
        errorMessage={field('street').errorMessage}
        onNysInput={handleInput('street')}
      />
      <NysTextinput
        label="Suite/Unit"
        optional
        value={address.suite}
        onNysInput={handleInput('suite')}
      />
      <NysTextinput
        label="City"
        required
        value={address.city}
        showError={field('city').showError}
        errorMessage={field('city').errorMessage}
        onNysInput={handleInput('city')}
      />
      <NysSelect
        label="State"
        required
        value={address.state}
        showError={field('state').showError}
        errorMessage={field('state').errorMessage}
        onNysChange={handleStateChange}
      >
        <option value="">-- Select a state --</option>
        {US_STATES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </NysSelect>
      <NysTextinput
        label="Zip"
        required
        value={address.zip}
        width="md"
        pattern="^\d{5}(-\d{4})?$"
        showError={field('zip').showError}
        errorMessage={field('zip').errorMessage}
        onNysInput={handleInput('zip')}
      />
    </div>
  );
}

export default function Addresses() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(2, data);

  const { principal, nyOffices } = data.addresses;

  function handleContinue() {
    if (validate()) navigate('/register/ownership');
  }

  function updatePrincipal(update: Partial<typeof principal>) {
    dispatch({ type: 'UPDATE_PRINCIPAL_ADDRESS', payload: update });
  }

  const principalErrors = {
    showError: (key: string) => getFieldProps(key).showError,
    message: (key: string) => getFieldProps(key).errorMessage,
  };

  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-3xl)',
          marginBottom: 'var(--nys-space-400)',
        }}
      >
        Addresses
      </h2>

      {/* Section A: Principal Place of Business */}
      <h3
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-xl)',
          marginBottom: 'var(--nys-space-100)',
        }}
      >
        Address of the principal place of business
      </h3>
      <p
        style={{
          fontFamily: 'var(--nys-font-body)',
          fontSize: 'var(--nys-font-size-sm)',
          color: 'var(--nys-color-text-secondary)',
          marginBottom: 'var(--nys-space-300)',
        }}
      >
        Provide the primary business address where your company is headquartered.
      </p>

      <AddressFormFields
        address={principal}
        onChange={updatePrincipal}
        fieldErrors={principalErrors}
        fieldPrefix="principal"
      />

      <div style={{ margin: 'var(--nys-space-400) 0' }}>
        <NysDivider />
      </div>

      {/* Section B: NY Office Addresses */}
      <h3
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-xl)',
          marginBottom: 'var(--nys-space-100)',
        }}
      >
        New York office addresses
      </h3>
      <p
        style={{
          fontFamily: 'var(--nys-font-body)',
          fontSize: 'var(--nys-font-size-sm)',
          color: 'var(--nys-color-text-secondary)',
          marginBottom: 'var(--nys-space-300)',
        }}
      >
        List each office address maintained in New York State other than the principal place of business. If none, leave blank.
      </p>

      <RepeatableFieldGroup<Address>
        items={nyOffices}
        emptyItem={EMPTY_ADDRESS}
        addLabel="+ Add NY office address"
        entryLabel="NY office address"
        onAdd={(addr) =>
          dispatch({ type: 'SET_NY_OFFICES', payload: [...nyOffices, addr] })
        }
        onUpdate={(index, addr) => {
          const updated = [...nyOffices];
          updated[index] = addr;
          dispatch({ type: 'SET_NY_OFFICES', payload: updated });
        }}
        onRemove={(index) =>
          dispatch({ type: 'SET_NY_OFFICES', payload: nyOffices.filter((_, i) => i !== index) })
        }
        renderForm={(item, onChange) => (
          <AddressFormFields address={item} onChange={(update) => onChange({ ...item, ...update })} />
        )}
        renderSummary={(item) => (
          <span style={{ fontFamily: 'var(--nys-font-body)' }}>{formatAddressSummary(item)}</span>
        )}
      />

      <StepNavigation
        onBack={() => navigate('/register/business-info')}
        onContinue={handleContinue}
      />
    </div>
  );
}
