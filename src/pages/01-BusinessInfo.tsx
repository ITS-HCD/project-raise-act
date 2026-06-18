import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysButton } from '../components/wrappers/NysButton';
import { NysDivider } from '../components/wrappers/NysDivider';
import StepNavigation from '../components/StepNavigation';

export default function BusinessInfo() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(1, data);

  const { legalName, additionalNames } = data.businessInfo;

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

  return (
    <div>
      <h2>Add Your Company Details</h2>

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

      <StepNavigation showBack={false} onContinue={handleContinue} />
    </div>
  );
}
