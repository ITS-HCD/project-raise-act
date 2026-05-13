import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysTextarea } from '../components/wrappers/NysTextarea';
import { NysRadiogroup } from '../components/wrappers/NysRadiogroup';
import { NysRadiobutton } from '../components/wrappers/NysRadiobutton';
import { RepeatableFieldGroup } from '../components/RepeatableFieldGroup';
import StepNavigation from '../components/StepNavigation';

export default function BusinessInfo() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(1, data);

  const { legalName, additionalNames, ownershipStructure } = data.businessInfo;

  function handleContinue() {
    if (validate()) navigate('/register/addresses');
  }

  function handleLegalNameInput(e: Event) {
    const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { legalName: value } });
  }

  function handleOwnershipChange(value: 'private' | 'public') {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { ownershipStructure: value } });
  }

  const legalNameProps = getFieldProps('legalName');
  const ownershipProps = getFieldProps('ownershipStructure');

  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-3xl)',
          marginBottom: 'var(--nys-space-400)',
        }}
      >
        Business Information
      </h2>

      {/* Legal Company Name */}
      <div data-field-name="legalName" style={{ marginBottom: 'var(--nys-space-400)' }}>
        <NysTextinput
          label="Legal Company Name"
          required
          value={legalName}
          maxlength={200}
          showError={legalNameProps.showError}
          errorMessage={legalNameProps.errorMessage}
          onNysInput={handleLegalNameInput}
        />
      </div>

      {/* Additional Names */}
      <div style={{ marginBottom: 'var(--nys-space-400)' }}>
        <p
          style={{
            fontFamily: 'var(--nys-font-body)',
            fontWeight: 'var(--nys-font-weight-semibold)',
            fontSize: 'var(--nys-font-size-md)',
            marginBottom: 'var(--nys-space-100)',
          }}
        >
          Additional Names
        </p>
        <p
          style={{
            fontFamily: 'var(--nys-font-body)',
            fontSize: 'var(--nys-font-size-sm)',
            color: 'var(--nys-color-text-secondary)',
            marginBottom: 'var(--nys-space-200)',
          }}
        >
          Include any trade names, DBAs, or other names your company is known by.
        </p>
        <RepeatableFieldGroup<string>
          items={additionalNames}
          emptyItem=""
          addLabel="+ Add name"
          entryLabel="name"
          onAdd={(name) =>
            dispatch({
              type: 'UPDATE_BUSINESS_INFO',
              payload: { additionalNames: [...additionalNames, name] },
            })
          }
          onUpdate={(index, name) => {
            const updated = [...additionalNames];
            updated[index] = name;
            dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { additionalNames: updated } });
          }}
          onRemove={(index) =>
            dispatch({
              type: 'UPDATE_BUSINESS_INFO',
              payload: { additionalNames: additionalNames.filter((_, i) => i !== index) },
            })
          }
          renderForm={(item, onChange) => (
            <NysTextarea
              label="Additional Name"
              value={item}
              rows={2}
              onNysInput={(e: Event) => {
                const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
                onChange(value);
              }}
            />
          )}
          renderSummary={(item) => (
            <span style={{ fontFamily: 'var(--nys-font-body)' }}>{item}</span>
          )}
        />
      </div>

      {/* Ownership Structure */}
      <div data-field-name="ownershipStructure" style={{ marginBottom: 'var(--nys-space-400)' }}>
        <NysRadiogroup
          label="Ownership structure"
          required
          showError={ownershipProps.showError}
          errorMessage={ownershipProps.errorMessage}
        >
          <NysRadiobutton
            name="ownershipStructure"
            value="private"
            label="Privately or closely held"
            checked={ownershipStructure === 'private'}
            onNysChange={(e: Event) => {
              const detail = (e as CustomEvent<{ id: string; checked: boolean; name: string; value: string }>).detail;
              if (detail.checked) handleOwnershipChange('private');
            }}
          />
          <NysRadiobutton
            name="ownershipStructure"
            value="public"
            label="Publicly traded"
            checked={ownershipStructure === 'public'}
            onNysChange={(e: Event) => {
              const detail = (e as CustomEvent<{ id: string; checked: boolean; name: string; value: string }>).detail;
              if (detail.checked) handleOwnershipChange('public');
            }}
          />
        </NysRadiogroup>
      </div>

      <StepNavigation showBack={false} onContinue={handleContinue} />
    </div>
  );
}
