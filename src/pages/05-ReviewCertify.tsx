import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useStepValidation } from '../utils/useStepValidation';
import { submitRegistration } from '../api/stubs';
import { ReviewSection } from '../components/ReviewSection';
import { NysCheckbox } from '../components/wrappers/NysCheckbox';
import { NysButton } from '../components/wrappers/NysButton';
import { NysIcon } from '../components/wrappers/NysIcon';
import { NysDivider } from '../components/wrappers/NysDivider';
import type { Address, Owner, Contact } from '../types/registration';
import styles from '../components/ReviewSection.module.css';

const ownershipLabels: Record<string, string> = {
  private: 'Privately or closely held',
  public: 'Publicly traded',
};

function ownerName(owner: Owner): string {
  return owner.type === 'person'
    ? `${owner.firstName} ${owner.lastName}`.trim()
    : owner.entityName.trim();
}

function contactPhone(contact: Contact): string {
  if (!contact.phone) return '';
  const base =
    contact.phoneCountryCode && contact.phoneCountryCode !== '+1'
      ? `${contact.phoneCountryCode} ${contact.phone}`
      : contact.phone;
  return contact.phoneExtension ? `${base} ext. ${contact.phoneExtension}` : base;
}

// Descriptive label with the value stacked underneath; supports multi-line values.
function StackedField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <p className={styles.fieldLabel}>{label}</p>
      <div className={styles.fieldValue}>{children}</div>
    </div>
  );
}

// Inline "Label: value" line used inside owner blocks.
function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p className={styles.line}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

function AddressLines({ addr }: { addr: Address }) {
  const cityStateZip = [[addr.city, addr.state].filter(Boolean).join(', '), addr.zip]
    .filter(Boolean)
    .join(' ');
  return (
    <>
      {addr.street && <div>{addr.street}</div>}
      {addr.suite && <div>{addr.suite}</div>}
      {cityStateZip && <div>{cityStateZip}</div>}
      {addr.country && <div>{addr.country}</div>}
    </>
  );
}

function OwnerBlock({ owner }: { owner: Owner }) {
  return (
    <div className={styles.block}>
      <Line label="Owner name" value={ownerName(owner) || '(unnamed)'} />
      <Line label="Owner type" value={owner.type === 'person' ? 'Person' : 'Entity'} />
    </div>
  );
}

function ContactBlock({ heading, contact }: { heading: string; contact: Contact }) {
  const name = `${contact.firstName} ${contact.lastName}`.trim();
  const phone = contactPhone(contact);
  return (
    <div className={styles.block}>
      <p className={styles.blockHeading}>{heading}</p>
      {name && <div>{name}</div>}
      {contact.title && <div>{contact.title}</div>}
      {contact.email && <div>{contact.email}</div>}
      {phone && <div>{phone}</div>}
    </div>
  );
}

export default function ReviewCertify() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const { validate, getFieldProps } = useStepValidation(5, data);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { businessInfo, addresses, ownership, contacts, documents, certification } = data;
  const certProps = getFieldProps('certification');

  const additionalNames = businessInfo.additionalNames.filter(n => n.trim());
  const ownershipStructure = ownershipLabels[businessInfo.ownershipStructure];

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await submitRegistration(data);
      const confirmationEmail = data.contacts.primary.email;
      // Persist submission so the dashboard can show the "under review" card
      // (and so it survives a refresh) rather than relying only on route state.
      dispatch({
        type: 'SET_SUBMISSION',
        payload: {
          disclosureId: response.registrationId,
          submittedAt: response.submittedAt,
          // Not yet approved — set server-side when the review decision lands.
          approvedAt: null,
          confirmationEmail,
        },
      });
      navigate('/register/success', {
        state: {
          registrationId: response.registrationId,
          submittedAt: response.submittedAt,
          contactEmail: confirmationEmail,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Review &amp; Certify</h2>
      <p>Review the information below before submitting.</p>
      <NysDivider />

      {/* Entity Information */}
      <ReviewSection title="Entity Information" onEdit={() => navigate('/register/business-info')}>
        <StackedField label="Legal name of large frontier developer:">
          {businessInfo.legalName || '—'}
        </StackedField>
        {additionalNames.length > 0 && (
          <StackedField label="All names under which the large frontier developer conducts business:">
            {additionalNames.join(', ')}
          </StackedField>
        )}
      </ReviewSection>

      {/* Addresses */}
      <ReviewSection title="Addresses" onEdit={() => navigate('/register/addresses')}>
        <StackedField label="Principal place of business:">
          <AddressLines addr={addresses.principal} />
        </StackedField>
        {addresses.nyOffices.length > 0 && (
          <StackedField label="New York office addresses:">
            {addresses.nyOffices.map((addr, i) => (
              <div key={i} className={styles.block}>
                <AddressLines addr={addr} />
              </div>
            ))}
          </StackedField>
        )}
      </ReviewSection>

      {/* Ownership */}
      <ReviewSection title="Ownership" onEdit={() => navigate('/register/ownership')}>
        {ownershipStructure && (
          <StackedField label="Ownership structure:">{ownershipStructure}</StackedField>
        )}
        {ownership.current.length > 0 && (
          <StackedField label="Current beneficial owners to disclose:">
            {ownership.current.map((o, i) => (
              <OwnerBlock key={i} owner={o} />
            ))}
          </StackedField>
        )}
        {ownership.former.length > 0 && (
          <StackedField label="Previous beneficial owners to disclose (only for privately or closely held large frontier developer or ultimate parent):">
            {ownership.former.map((o, i) => (
              <OwnerBlock key={i} owner={o} />
            ))}
          </StackedField>
        )}
      </ReviewSection>

      {/* Contacts */}
      <ReviewSection title="Contacts" onEdit={() => navigate('/register/contacts')}>
        <ContactBlock heading="Point of Contact" contact={contacts.primary} />
        {contacts.secondary && (
          <ContactBlock heading="Secondary Contact" contact={contacts.secondary} />
        )}
        {contacts.tertiary && (
          <ContactBlock heading="Tertiary Contact" contact={contacts.tertiary} />
        )}
      </ReviewSection>

      {/* Documents */}
      {documents.length > 0 && (
        <ReviewSection title="Documents" onEdit={() => navigate('/register/ownership')}>
          {documents.map((file, i) => (
            <div key={i} className={styles.doc}>
              <NysIcon name="attach_file" size="sm" />
              <span>{file.name}</span>
            </div>
          ))}
        </ReviewSection>
      )}

      {/* Certification */}
      <div data-field-name="certification">
        <h3>Certification</h3>
        <NysCheckbox
          label="I certify that the information provided in this submission is true, complete, and current to the best of my knowledge."
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
      <NysDivider />
      <NysButton
        label="Print to PDF"
        variant="outline"
        type="button"
        onNysClick={() => window.print()}
      />
      <NysDivider />
      {/* Navigation — Submit first in the DOM (first tab stop); CSS renders it
          on the right and Back on the left. */}
      <div className="wizard-nav">
        <NysButton
          label={isSubmitting ? 'Submitting…' : 'Submit'}
          variant="filled"
          type="button"
          disabled={isSubmitting}
          onNysClick={handleSubmit}
        />
        <NysButton
          label="Back"
          variant="text"
          type="button"
          onNysClick={() => navigate('/register/contacts')}
        />
      </div>
    </div>
  );
}
