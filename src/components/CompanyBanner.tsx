import { useState } from 'react';
import { useRegistration } from '../context/RegistrationContext';
import type { ReviewState } from '../types/registration';
import { NysIcon } from './wrappers/NysIcon';
import { NysBadge } from './wrappers/NysBadge';

type Intent = 'success' | 'warning' | 'error' | 'neutral';

interface StatusItem {
  label: string;
  value: string;
  intent: Intent;
  // True for placeholder values not yet wired to real data — flagged in the UI.
  sample?: boolean;
}

// "Disclosure on File" reflects the actual review lifecycle state so it's never
// shown as filed/active before the disclosure has been submitted.
const DISCLOSURE_STATUS: Record<ReviewState, Omit<StatusItem, 'label'>> = {
  not_started: { value: 'Not Filed', intent: 'neutral' },
  in_progress: { value: 'In Progress', intent: 'neutral' },
  under_review: { value: 'Under Review', intent: 'warning' },
  needs_info: { value: 'Action Needed', intent: 'error' },
  approved: { value: 'Active', intent: 'success' },
};

// Fee/report statuses are illustrative only. BACKEND: replace with real values
// for the signed-in company.
const SAMPLE_STATUS_ITEMS: StatusItem[] = [
  { label: 'Assessment Fee', value: 'Due in 33 Days', intent: 'warning', sample: true },
  { label: 'Other Fees/Penalties', value: 'None', intent: 'success', sample: true },
  { label: 'Quarterly Reports', value: '1 Overdue', intent: 'error', sample: true },
  { label: 'Incident Reports', value: '2 Under Review', intent: 'warning', sample: true },
];

export function CompanyBanner() {
  const { data } = useRegistration();
  const [expanded, setExpanded] = useState(false);

  const name = data.companyNameOnFile;
  if (!name) return null;

  const statusItems: StatusItem[] = [
    { label: 'Disclosure on File', ...DISCLOSURE_STATUS[data.reviewState] },
    ...SAMPLE_STATUS_ITEMS,
  ];

  // Registration number and filing date only exist once the full disclosure is
  // submitted; before that, show a pending placeholder.
  const registrationNumber = data.submission?.disclosureId ?? 'Pending submission';
  const filedOn = data.submission?.submittedAt
    ? new Date(data.submission.submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Pending submission';

  return (
    <div className="company-banner">
      <div className="company-banner__inner">
        <div className="company-banner__bar">
          <p className="company-banner__name">{name}</p>
          <button
            type="button"
            className="company-banner__toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? 'Show Less' : 'Show More'}
            <NysIcon name={expanded ? 'expand_less' : 'expand_more'} size="sm" />
          </button>
        </div>

        {expanded && (
          <>
            <hr className="company-banner__divider" />
            <div className="company-banner__details nys-display-flex nys-flex-column nys-tablet:nys-flex-row">
              <div className="company-banner__meta">
                <p>
                  <strong>Registration Number:</strong> {registrationNumber}
                </p>
                <p>
                  <strong>Filed On:</strong> {filedOn}
                </p>
              </div>
              <div className="company-banner__stats nys-display-flex nys-flex-wrap">
                {statusItems.map(item => (
                  <div
                    key={item.label}
                    className="company-banner__stat nys-display-flex nys-flex-column"
                  >
                    <span className="company-banner__stat-label">{item.label}</span>
                    <NysBadge intent={item.intent} label={item.value} prefixIcon size="sm" />
                    {item.sample && <span className="company-banner__stat-note">Sample data</span>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
