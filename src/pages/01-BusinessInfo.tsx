import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysRadiogroup } from '../components/wrappers/NysRadiogroup';
import { NysRadiobutton } from '../components/wrappers/NysRadiobutton';
import { NysButton } from '../components/wrappers/NysButton';
import { NysDivider } from '../components/wrappers/NysDivider';
import { NysFileinput } from '../components/wrappers/NysFileinput';
import StepNavigation from '../components/StepNavigation';

export default function BusinessInfo() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(1, data);

  const { legalName, additionalNames, ownershipStructure } = data.businessInfo;

  function handleContinue() {
    if (validate()) {
      dispatch({ type: 'MARK_BUSINESS_INFO_SUBMITTED' });
      navigate('/register/addresses');
    }
  }

  function handleLegalNameInput(e: Event) {
    const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { legalName: value } });
  }

  function handleOwnershipChange(value: 'private' | 'public') {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { ownershipStructure: value } });
  }

  function handleAddName() {
    dispatch({
      type: 'UPDATE_BUSINESS_INFO',
      payload: { additionalNames: [...additionalNames, ''] },
    });
  }

  function handleUpdateName(index: number, value: string) {
    const updated = [...additionalNames];
    updated[index] = value;
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { additionalNames: updated } });
  }

  function handleRemoveName(index: number) {
    dispatch({
      type: 'UPDATE_BUSINESS_INFO',
      payload: { additionalNames: additionalNames.filter((_, i) => i !== index) },
    });
  }

  const legalNameProps = getFieldProps('legalName');
  const ownershipProps = getFieldProps('ownershipStructure');

  return (
    <div>
      <h2>Register your Company</h2>

      {/* Legal Company Name */}
      <NysTextinput
        label="Legal Company Name"
        required
        value={legalName}
        maxlength={200}
        showError={legalNameProps.showError}
        errorMessage={legalNameProps.errorMessage}
        onNysInput={handleLegalNameInput}
      />

      <NysDivider />

      {/* Additional Names */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nys-space-200)' }}>
        {additionalNames.map((name, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 'var(--nys-space-100)',
            }}
          >
            <div style={{ flex: 1 }}>
              <NysTextinput
                label={index === 0 ? 'Additional Names' : undefined}
                description={
                  index === 0
                    ? 'All names under which the large frontier developer conducts business.'
                    : undefined
                }
                value={name}
                onNysInput={(e: Event) => {
                  const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
                  handleUpdateName(index, value);
                }}
              />
            </div>
            <NysButton
              label="Remove"
              variant="text"
              className="remove-btn"
              style={{ visibility: index > 0 ? 'visible' : 'hidden' } as React.CSSProperties}
              onNysClick={() => handleRemoveName(index)}
            />
          </div>
        ))}

        <NysButton label="+ Add additional name" variant="text" onNysClick={handleAddName} />
      </div>

      <NysDivider />

      {/* Ownership Structure */}
      <div data-field-name="ownershipStructure">
        <NysRadiogroup
          label="Ownership structure of LFD or ultimate parent"
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
              const detail = (e as CustomEvent<{ id: string; checked: boolean; name: string; value: string }>)
                .detail;
              if (detail.checked) handleOwnershipChange('private');
            }}
          />
          <NysRadiobutton
            name="ownershipStructure"
            value="public"
            label="Publicly traded"
            checked={ownershipStructure === 'public'}
            onNysChange={(e: Event) => {
              const detail = (e as CustomEvent<{ id: string; checked: boolean; name: string; value: string }>)
                .detail;
              if (detail.checked) handleOwnershipChange('public');
            }}
          />
        </NysRadiogroup>
      </div>

      <NysDivider />

      {/* Supporting Documentation */}
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

      <StepNavigation showBack={false} onContinue={handleContinue} />
    </div>
  );
}
