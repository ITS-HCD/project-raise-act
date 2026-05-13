import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { submitRegistration } from '../api/stubs';
import { ReviewSection } from '../components/ReviewSection';
import { NysCheckbox } from '../components/wrappers/NysCheckbox';
import { NysButton } from '../components/wrappers/NysButton';
import type { Address, Owner, Contact } from '../types/registration';

function formatAddress(addr: Address): string {
  const parts = [addr.street];
  if (addr.suite) parts.push(addr.suite);
  if (addr.city || addr.state || addr.zip) {
    parts.push(`${addr.city}, ${addr.state} ${addr.zip}`.trim());
  }
  return parts.filter(Boolean).join(', ') || '—';
}

function formatOwner(owner: Owner, isFormer: boolean): string {
  const name =
    owner.type === 'person'
      ? `${owner.firstName} ${owner.lastName}`.trim() || '(unnamed)'
      : owner.entityName || '(unnamed)';
  const type = owner.type === 'person' ? 'Person' : 'Entity';
  const pct = isNaN(owner.percentageOwned) ? '' : `, ${owner.percentageOwned}%`;
  const dates = [
    owner.startDate && `Start: ${owner.startDate}`,
    isFormer && owner.endDate && `End: ${owner.endDate}`,
  ]
    .filter(Boolean)
    .join(' · ');
  return `${name} — ${type}${pct}${dates ? ` (${dates})` : ''}`;
}

function formatContact(contact: Contact): string {
  return [
    `${contact.firstName} ${contact.lastName}`.trim(),
    contact.title,
    contact.phone,
    contact.email,
  ]
    .filter(Boolean)
    .join(' · ');
}

const ownershipLabels: Record<string, string> = {
  private: 'Privately or closely held',
  public: 'Publicly traded',
};

interface ReviewFieldProps {
  label: string;
  value: React.ReactNode;
}

function ReviewField({ label, value }: ReviewFieldProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--nys-space-300)',
        marginBottom: 'var(--nys-space-200)',
        fontFamily: 'var(--nys-font-body)',
      }}
    >
      <span
        style={{
          fontWeight: 'var(--nys-font-weight-semibold)',
          minWidth: '180px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ color: 'var(--nys-color-text)' }}>{value || '—'}</span>
    </div>
  );
}

export default function ReviewCertify() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(6, data);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { businessInfo, addresses, ownership, contacts, documents, certification } = data;
  const certProps = getFieldProps('certification');

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await submitRegistration(data);
      navigate('/register/success', {
        state: { registrationId: response.registrationId, submittedAt: response.submittedAt },
      });
    } finally {
      setIsSubmitting(false);
    }
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
        Review &amp; Certify
      </h2>
      <p
        style={{
          fontFamily: 'var(--nys-font-body)',
          fontSize: 'var(--nys-font-size-sm)',
          color: 'var(--nys-color-text-secondary)',
          marginBottom: 'var(--nys-space-400)',
        }}
      >
        Review your registration information below. Use "Edit Section" to make corrections before
        submitting.
      </p>

      {/* Business Info */}
      <ReviewSection
        title="Business Information"
        onEdit={() => navigate('/register/business-info')}
      >
        <ReviewField label="Legal Company Name" value={businessInfo.legalName} />
        <ReviewField
          label="Additional Names"
          value={
            businessInfo.additionalNames.length > 0
              ? businessInfo.additionalNames.join(', ')
              : 'None'
          }
        />
        <ReviewField
          label="Ownership Structure"
          value={ownershipLabels[businessInfo.ownershipStructure] ?? '—'}
        />
      </ReviewSection>

      {/* Addresses */}
      <ReviewSection title="Addresses" onEdit={() => navigate('/register/addresses')}>
        <ReviewField
          label="Principal Address"
          value={formatAddress(addresses.principal)}
        />
        <ReviewField
          label="NY Office Addresses"
          value={
            addresses.nyOffices.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 'var(--nys-space-300)' }}>
                {addresses.nyOffices.map((addr, i) => (
                  <li key={i}>{formatAddress(addr)}</li>
                ))}
              </ul>
            ) : (
              'None'
            )
          }
        />
      </ReviewSection>

      {/* Ownership */}
      <ReviewSection title="Ownership" onEdit={() => navigate('/register/ownership')}>
        <ReviewField
          label="Current Owners"
          value={
            ownership.current.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 'var(--nys-space-300)' }}>
                {ownership.current.map((o, i) => (
                  <li key={i}>{formatOwner(o, false)}</li>
                ))}
              </ul>
            ) : (
              'None'
            )
          }
        />
        <ReviewField
          label="Former Owners"
          value={
            ownership.former.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 'var(--nys-space-300)' }}>
                {ownership.former.map((o, i) => (
                  <li key={i}>{formatOwner(o, true)}</li>
                ))}
              </ul>
            ) : (
              'None'
            )
          }
        />
      </ReviewSection>

      {/* Contacts */}
      <ReviewSection title="Contacts" onEdit={() => navigate('/register/contacts')}>
        <ReviewField label="Primary Contact" value={formatContact(contacts.primary)} />
        {contacts.secondary && (
          <ReviewField label="Secondary Contact" value={formatContact(contacts.secondary)} />
        )}
        {contacts.tertiary && (
          <ReviewField label="Tertiary Contact" value={formatContact(contacts.tertiary)} />
        )}
      </ReviewSection>

      {/* Documents */}
      <ReviewSection title="Documents" onEdit={() => navigate('/register/documents')}>
        <ReviewField
          label="Uploaded Files"
          value={
            documents.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 'var(--nys-space-300)' }}>
                {documents.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            ) : (
              'No documents uploaded'
            )
          }
        />
      </ReviewSection>

      {/* Certification */}
      <div
        data-field-name="certification"
        style={{ marginTop: 'var(--nys-space-400)', marginBottom: 'var(--nys-space-400)' }}
      >
        <NysCheckbox
          label="I certify that the information provided in this registration is true, complete, and current to the best of my knowledge."
          required
          checked={certification}
          showError={certProps.showError}
          errorMessage={certProps.errorMessage}
          onNysChange={(e: Event) => {
            const { checked } = (e as CustomEvent<{ id: string; checked: boolean; name: string; value: string }>).detail;
            dispatch({ type: 'SET_CERTIFICATION', payload: checked });
          }}
        />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 'var(--nys-space-200)' }}>
        <NysButton
          label="Back"
          variant="outline"
          type="button"
          onNysClick={() => navigate('/register/documents')}
        />
        <NysButton
          label={isSubmitting ? 'Submitting…' : 'Submit'}
          variant="filled"
          type="button"
          disabled={isSubmitting}
          onNysClick={handleSubmit}
        />
      </div>
    </div>
  );
}
