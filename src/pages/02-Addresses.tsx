import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import type { Address } from '../types/registration';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysSelect } from '../components/wrappers/NysSelect';
import { NysDivider } from '../components/wrappers/NysDivider';
import { NysFileinput } from '../components/wrappers/NysFileinput';
import { NysButton } from '../components/wrappers/NysButton';
import StepNavigation from '../components/StepNavigation';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'CN', label: 'China' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SG', label: 'Singapore' },
  { value: 'OTHER', label: 'Other' },
];

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

const emptyNyAddress = () => ({ country: 'US', street: '', suite: '', state: 'NY', city: '', zip: '' });

export default function Addresses() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(2, data);

  const { principal, nyOffices } = data.addresses;

  const isUS = principal.country === 'US' || principal.country === '';

  function handleContinue() {
    if (validate()) navigate('/register/ownership');
  }

  function update(field: keyof typeof principal) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
      dispatch({ type: 'UPDATE_PRINCIPAL_ADDRESS', payload: { [field]: value } });
    };
  }

  function updateNyOffice(index: number, field: keyof Address) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
      const updated = nyOffices.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr));
      dispatch({ type: 'SET_NY_OFFICES', payload: updated });
    };
  }

  function addNyOffice() {
    dispatch({ type: 'SET_NY_OFFICES', payload: [...nyOffices, emptyNyAddress()] });
  }

  function removeNyOffice(index: number) {
    dispatch({ type: 'SET_NY_OFFICES', payload: nyOffices.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <h2>Address of the principal place of business</h2>

      <NysSelect
        label="Country"
        width="lg"
        required
        value={principal.country}
        showError={getFieldProps('principal.country').showError}
        errorMessage={getFieldProps('principal.country').errorMessage}
        onNysChange={update('country')}
      >
        <option value="">-- Select a country --</option>
        {COUNTRIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </NysSelect>

      <NysTextinput
        label="Street Address"
        required
        value={principal.street}
        showError={getFieldProps('principal.street').showError}
        errorMessage={getFieldProps('principal.street').errorMessage}
        onNysInput={update('street')}
      />

      <NysTextinput
        label="Suite/Unit"
        optional
        value={principal.suite}
        onNysInput={update('suite')}
      />

      {isUS ? (
        <NysSelect
          label="State"
          width="sm"
          required
          value={principal.state}
          showError={getFieldProps('principal.state').showError}
          errorMessage={getFieldProps('principal.state').errorMessage}
          onNysChange={update('state')}
        >
          <option value="">-- Select a state --</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.value}
            </option>
          ))}
        </NysSelect>
      ) : (
        <NysTextinput
          label="State/Province/Region"
          value={principal.state}
          onNysInput={update('state')}
          width="sm"
        />
      )}

      <NysTextinput
        label="City"
        width="md"
        required
        value={principal.city}
        showError={getFieldProps('principal.city').showError}
        errorMessage={getFieldProps('principal.city').errorMessage}
        onNysInput={update('city')}
      />

      {isUS ? (
        <NysTextinput
          label="Zip"
          required
          value={principal.zip}
          width="md"
          pattern="^\d{5}(-\d{4})?$"
          showError={getFieldProps('principal.zip').showError}
          errorMessage={getFieldProps('principal.zip').errorMessage}
          onNysInput={update('zip')}
        />
      ) : (
        <NysTextinput
          label="Postal Code"
          value={principal.zip}
          onNysInput={update('zip')}
          width="md"
        />
      )}

      <NysDivider />

      <h2>New York office addresses</h2>
      <p>List each office address maintained in New York State other than the principal place of business. If none, leave blank.</p>

      {nyOffices.map((office, index) => (
        <div key={index} style={{margin: 'var(--nys-space-150) 0', gap: 'var(--nys-space-150)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Address {index + 1}</h3>
            <NysButton
              variant="text"
              label="Remove"
              type="button"
              className="remove-btn"
              onClick={() => removeNyOffice(index)}
            />
          </div>

          <NysTextinput
            label="Street Address"
            required
            value={office.street}
            onNysInput={updateNyOffice(index, 'street')}
          />

          <NysTextinput
            label="Suite/Unit"
            optional
            value={office.suite}
            onNysInput={updateNyOffice(index, 'suite')}
          />

          <NysTextinput
            label="State"
            width="sm"
            value="NY"
            readonly
          >
            <option value="NY">NY</option>
          </NysTextinput>

          <NysTextinput
            label="City"
            width="md"
            required
            value={office.city}
            onNysInput={updateNyOffice(index, 'city')}
          />

          <NysTextinput
            label="Zip"
            width="md"
            required
            value={office.zip}
            pattern="^\d{5}(-\d{4})?$"
            onNysInput={updateNyOffice(index, 'zip')}
          />
        </div>
      ))}

      <NysButton
        variant="text"
        label="Add additional address"
        prefixIcon="add"
        type="button"
        onClick={addNyOffice}
        style={{ '--nys-button-color': 'var(--nys-color-theme)', '--nys-button-color--hover': 'var(--nys-color-theme-strong)', '--nys-button-color--active': 'var(--nys-color-theme-stronger)' } as React.CSSProperties}
      />

      <NysDivider />

      <NysFileinput
        label="Supporting documentation"
        description="Upload any required supporting documents for this registration. You can upload PDF, JPG, or PNG files up to 10MB each"
        multiple
        dropzone
        accept=".pdf,.jpg,.jpeg,.png"
        onNysChange={(e: Event) => {
          const { files } = (e as CustomEvent<{ id: string; files: File[] }>).detail;
          dispatch({ type: 'SET_DOCUMENTS', payload: files });
        }}
      />
      
      <NysDivider />

      <StepNavigation
        onBack={() => navigate('/register/business-info')}
        onContinue={handleContinue}
      />
    </div>
  );
}
