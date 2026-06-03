import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { NysTextinput } from '../components/wrappers/NysTextinput';
import { NysRadiogroup } from '../components/wrappers/NysRadiogroup';
import { NysRadiobutton } from '../components/wrappers/NysRadiobutton';
import { NysDatepicker } from '../components/wrappers/NysDatepicker';
import { NysDivider } from '../components/wrappers/NysDivider';
import { NysFileinput } from '../components/wrappers/NysFileinput';
import { RepeatableFieldGroup } from '../components/RepeatableFieldGroup';
import StepNavigation from '../components/StepNavigation';
import type { Owner } from '../types/registration';

const EMPTY_CURRENT_OWNER: Owner = {
  type: 'person',
  firstName: '',
  lastName: '',
  entityName: '',
  percentageOwned: NaN,
  startDate: '',
};

const EMPTY_FORMER_OWNER: Owner = {
  ...EMPTY_CURRENT_OWNER,
  endDate: '',
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
  isFormer = false,
}: {
  owner: Owner;
  onChange: (o: Owner) => void;
  isFormer?: boolean;
}) {
  function handleInput(field: keyof Owner) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ id: string; value: string }>).detail.value;
      onChange({ ...owner, [field]: value });
    };
  }

  function handleDateInput(field: 'startDate' | 'endDate') {
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

      <NysTextinput
        label="Percentage Owned"
        type="number"
        width="sm"
        required
        value={isNaN(owner.percentageOwned) ? '' : String(owner.percentageOwned)}
        min={0}
        max={100}
        onNysInput={(e: Event) => {
          const raw = (e as CustomEvent<{ value: string }>).detail.value;
          onChange({ ...owner, percentageOwned: raw === '' ? NaN : Number(raw) });
        }}
      />

      <NysDatepicker
        label="Ownership Start Date"
        required
        value={owner.startDate || undefined}
        onNysInput={handleDateInput('startDate')}
      />

      {isFormer && (
        <NysDatepicker
          label="Ownership End Date"
          required
          value={owner.endDate || undefined}
          onNysInput={handleDateInput('endDate')}
        />
      )}
    </div>
  );
}

function OwnerSummary({ owner, isFormer }: { owner: Owner; isFormer: boolean }) {
  const name = getOwnerDisplayName(owner);
  const type = owner.type === 'person' ? 'Person' : 'Entity';
  const pct = isNaN(owner.percentageOwned) ? '' : `${owner.percentageOwned}%`;

  return (
    <div>
      <strong>
        {name} — {type}
      </strong>
      <div>
        {[
          pct && `${pct} owned`,
          owner.startDate && `Start: ${owner.startDate}`,
          isFormer && owner.endDate && `End: ${owner.endDate}`,
        ]
          .filter(Boolean)
          .join(' · ')}
      </div>
    </div>
  );
}

export default function Ownership() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate } = useStepValidation(3, data);

  const { current, former } = data.ownership;

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
        List all individuals or entities with a beneficial ownership interest in the company.
      </p>

      <RepeatableFieldGroup<Owner>
        items={current}
        emptyItem={EMPTY_CURRENT_OWNER}
        addLabel="+ Add additional owner"
        entryLabel="owner"
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
          <OwnerFormFields owner={item} onChange={onChange} isFormer={false} />
        )}
        renderSummary={(item) => <OwnerSummary owner={item} isFormer={false} />}
      />

      <NysDivider />

      {/* Section B: Former Beneficial Owners */}
      <h3>
        Former beneficial owners
      </h3>
      <p>
        List any individuals or entities who previously held a beneficial ownership interest.
      </p>

      <RepeatableFieldGroup<Owner>
        items={former}
        emptyItem={EMPTY_FORMER_OWNER}
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
          <OwnerFormFields owner={item} onChange={onChange} isFormer={true} />
        )}
        renderSummary={(item) => <OwnerSummary owner={item} isFormer={true} />}
      />

      <NysDivider />

      <NysFileinput
        label="Supporting documentation"
        description="Upload any required supporting documents for this registration. You can upload PDF, JPG, or PNG files up to 10MB each"
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
