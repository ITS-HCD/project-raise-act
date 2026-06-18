import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysRadiogroup } from '../components/wrappers/NysRadiogroup';
import { NysRadiobutton } from '../components/wrappers/NysRadiobutton';
import { NysDivider } from '../components/wrappers/NysDivider';
import { NysFileinput } from '../components/wrappers/NysFileinput';
import { RepeatableFieldGroup } from '../components/RepeatableFieldGroup';
import StepNavigation from '../components/StepNavigation';
import type { Owner } from '../types/registration';

const EMPTY_OWNER: Owner = {
  type: 'person',
  firstName: '',
  lastName: '',
  entityName: '',
};

function getOwnerDisplayName(owner: Owner): string {
  if (owner.type === 'person') {
    return `${owner.firstName} ${owner.lastName}`.trim() || '(unnamed)';
  }
  return owner.entityName || '(unnamed)';
}

function OwnerFormFields({
  owner,
  onChange,
}: {
  owner: Owner;
  onChange: (o: Owner) => void;
}) {
  function handleInput(field: keyof Owner) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
      onChange({ ...owner, [field]: value });
    };
  }

  return (
    <div>
      <NysRadiogroup label="Owner Type" required>
        <NysRadiobutton
          name="ownerType"
          value="person"
          label="Person"
          checked={owner.type === 'person'}
          onNysChange={(e: Event) => {
            const { checked } = (e as CustomEvent<{ checked: boolean; value: string }>).detail;
            if (checked) onChange({ ...owner, type: 'person' });
          }}
        />
        <NysRadiobutton
          name="ownerType"
          value="entity"
          label="Entity"
          checked={owner.type === 'entity'}
          onNysChange={(e: Event) => {
            const { checked } = (e as CustomEvent<{ checked: boolean; value: string }>).detail;
            if (checked) onChange({ ...owner, type: 'entity' });
          }}
        />
      </NysRadiogroup>

      {owner.type === 'person' && (
        <>
          <NysTextinput
            label="Owner First Name"
            required
            value={owner.firstName}
            onNysInput={handleInput('firstName')}
          />
          <NysTextinput
            label="Owner Last Name"
            required
            value={owner.lastName}
            onNysInput={handleInput('lastName')}
          />
        </>
      )}

      {owner.type === 'entity' && (
        <NysTextinput
          label="Entity Name"
          required
          value={owner.entityName}
          onNysInput={handleInput('entityName')}
        />
      )}
    </div>
  );
}

function OwnerSummary({ owner }: { owner: Owner }) {
  const name = getOwnerDisplayName(owner);
  const type = owner.type === 'person' ? 'Person' : 'Entity';

  return (
    <div>
      <strong>
        {name} — {type}
      </strong>
    </div>
  );
}

export default function Ownership() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate } = useStepValidation(3, data);

  const { current, former } = data.ownership;
  const { ownershipStructure } = data.businessInfo;

  function handleContinue() {
    if (validate()) navigate('/register/contacts');
  }

  function handleFilesChange(e: Event) {
    const { files } = (e as CustomEvent<{ id: string; files: File[] }>).detail;
    dispatch({ type: 'SET_DOCUMENTS', payload: files });
  }

  return (
    <div>
      <h2>Ownership</h2>

      {/* Section A: Current Beneficial Owners */}
      <h3>
        Current beneficial owners
      </h3>
      <p>
        List each person or entity that beneficially owns the applicable ownership threshold as of the filing date (privately or closely held: 5% or more; publicly traded: 50% or more).
      </p>

      <RepeatableFieldGroup<Owner>
        items={current}
        emptyItem={EMPTY_OWNER}
        addLabel="+ Add additional owner"
        entryLabel="owner"
        openWhenEmpty
        onAdd={(owner) =>
          dispatch({ type: 'SET_CURRENT_OWNERS', payload: [...current, owner] })
        }
        onUpdate={(index, owner) => {
          const updated = [...current];
          updated[index] = owner;
          dispatch({ type: 'SET_CURRENT_OWNERS', payload: updated });
        }}
        onRemove={(index) =>
          dispatch({
            type: 'SET_CURRENT_OWNERS',
            payload: current.filter((_, i) => i !== index),
          })
        }
        renderForm={(item, onChange) => (
          <OwnerFormFields owner={item} onChange={onChange} />
        )}
        renderSummary={(item) => <OwnerSummary owner={item} />}
      />

      {ownershipStructure === 'private' && (
        <>
          <NysDivider />

          {/* Section B: Former Beneficial Owners */}
          <h3>
            Former beneficial owners
          </h3>
          <p>
            If the large frontier developer or its ultimate parent is privately or closely held, then list any person or entity who held a beneficial ownership interest of 5% or more that ended within the past 5 years.
          </p>

          <RepeatableFieldGroup<Owner>
            items={former}
            emptyItem={EMPTY_OWNER}
            addLabel="+ Add additional former owner"
            entryLabel="former owner"
            onAdd={(owner) =>
              dispatch({ type: 'SET_FORMER_OWNERS', payload: [...former, owner] })
            }
            onUpdate={(index, owner) => {
              const updated = [...former];
              updated[index] = owner;
              dispatch({ type: 'SET_FORMER_OWNERS', payload: updated });
            }}
            onRemove={(index) =>
              dispatch({
                type: 'SET_FORMER_OWNERS',
                payload: former.filter((_, i) => i !== index),
              })
            }
            renderForm={(item, onChange) => (
              <OwnerFormFields owner={item} onChange={onChange} />
            )}
            renderSummary={(item) => <OwnerSummary owner={item} />}
          />
        </>
      )}

      <NysDivider />

      <NysFileinput
        label="Supporting documentation"
        description="Upload any required supporting documents for this disclosure statement. You can upload PDF, JPG, or PNG files up to 10MB each"
        multiple
        dropzone
        accept=".pdf,.jpg,.jpeg,.png"
        onNysChange={handleFilesChange}
      />
      {data.documents.length > 0 && (
        <p>
          {data.documents.length} file{data.documents.length !== 1 ? 's' : ''} staged for submission.
        </p>
      )}
      <NysDivider />
      <StepNavigation
        onBack={() => navigate('/register/addresses')}
        onContinue={handleContinue}
      />
    </div>
  );
}
