import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import type { ReviewState } from '../types/registration';
import { NysAlert } from '../components/wrappers/NysAlert';
import { NysButton } from '../components/wrappers/NysButton';
import { NysRadiogroup } from '../components/wrappers/NysRadiogroup';
import { NysRadiobutton } from '../components/wrappers/NysRadiobutton';
import { AdditionalInfoAlert, INFO_REQUEST_REASON } from '../components/AdditionalInfoAlert';

const WIZARD_START = '/register/business-info';

// Read-only card shown once a disclosure statement has reached a decision-ish
// state (under review / approved): heading, a sentence, a divider, then a
// labeled date row and the confirmation email.
function DetailCard({
  heading,
  body,
  dateLabel,
  dateValue,
  email,
}: {
  heading: string;
  body: string;
  dateLabel: string;
  dateValue: string;
  email: string;
}) {
  return (
    <div className="dashboard-card">
      <p className="dashboard-card__heading">{heading}</p>
      <p className="dashboard-card__body">{body}</p>
      <hr className="dashboard-card__divider" />
      <div className="dashboard-card__details">
        <p>
          <strong>{dateLabel}</strong> {dateValue}
        </p>
        {email && (
          <p>
            <strong>Confirmation sent to:</strong> {email}
          </p>
        )}
      </div>
    </div>
  );
}

// Options shown in the reviewer preview toggle at the bottom of the page.
const STATE_OPTIONS: { value: ReviewState; label: string; description: string }[] = [
  {
    value: 'not_started',
    label: 'Not started',
    description: 'No disclosure statement has been started yet.',
  },
  {
    value: 'in_progress',
    label: 'Saved / in progress',
    description: 'Saved as a draft but not yet submitted.',
  },
  {
    value: 'under_review',
    label: 'Under review',
    description: 'Submitted and awaiting a decision from New York State.',
  },
  {
    value: 'needs_info',
    label: 'Additional information requested',
    description: 'New York State has requested more information before deciding.',
  },
  {
    value: 'approved',
    label: 'Approved',
    description: 'New York State has approved the disclosure statement.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();
  const companyName = data.businessInfo.legalName || 'Your company';
  const { reviewState, submission } = data;

  const requirementText = `${companyName} must submit a disclosure statement before submitting reports or incident filings. A disclosure statement ensures you meet New York State requirements.`;

  function renderStateContent() {
    switch (reviewState) {
      case 'in_progress':
        return (
          <>
            <NysAlert
              className="dashboard__alert"
              type="success"
              heading="Your progress has been saved."
              text="Your disclosure statement has been saved successfully."
            />
            <div className="dashboard-card">
              <p className="dashboard-card__heading">Your disclosure statement has not been submitted yet.</p>
              <p className="dashboard-card__body">{requirementText}</p>
              <NysButton
                label="Continue Disclosure Statement"
                variant="filled"
                onNysClick={() => navigate(WIZARD_START)}
              />
            </div>
          </>
        );

      case 'under_review': {
        const submittedOn = new Date(
          submission?.submittedAt ?? Date.now(),
        ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const confirmationEmail = submission?.confirmationEmail || data.contacts.primary.email;
        return (
          <DetailCard
            heading="Your disclosure statement is under review"
            body={`${companyName} has submitted a disclosure statement to New York State. You'll receive an email notification once a decision has been made.`}
            dateLabel="Submitted on:"
            dateValue={submittedOn}
            email={confirmationEmail}
          />
        );
      }

      case 'approved': {
        // Real approvals carry an `approvedAt` set by the backend; the reviewer
        // toggle has no such timestamp, so fall back to the current date.
        const approvedOn = new Date(
          submission?.approvedAt ?? Date.now(),
        ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const confirmationEmail = submission?.confirmationEmail || data.contacts.primary.email;
        const approvedBody = `The disclosure statement submitted by ${companyName} has been approved. New York State will be in contact with next steps.`;
        return (
          <>
            <NysAlert
              className="dashboard__alert"
              type="success"
              heading="Your disclosure statement has been approved!"
              text={approvedBody}
            />
            <DetailCard
              heading="Your disclosure statement has been approved."
              body={approvedBody}
              dateLabel="Approved on:"
              dateValue={approvedOn}
              email={confirmationEmail}
            />
          </>
        );
      }

      case 'needs_info':
        return (
          <>
            <AdditionalInfoAlert className="dashboard__alert" />
            <div className="dashboard-card">
              <p className="dashboard-card__heading">Your disclosure statement requires additional information.</p>
              <p className="dashboard-card__body">{INFO_REQUEST_REASON}</p>
              <NysButton
                label="Update Disclosure Statement"
                variant="filled"
                onNysClick={() => navigate(WIZARD_START)}
              />
            </div>
          </>
        );

      case 'not_started':
      default:
        return (
          <>
            <NysAlert
              className="dashboard__alert"
              type="warning"
              heading="Disclosure Statement required to operate under the RAISE Act"
              text={requirementText}
            />
            <div className="dashboard-card">
              <p className="dashboard-card__heading">Your disclosure statement has not been started.</p>
              <p className="dashboard-card__body">{requirementText}</p>
              <NysButton
                label="Start Disclosure Statement"
                variant="filled"
                onNysClick={() => navigate(WIZARD_START)}
              />
            </div>
          </>
        );
    }
  }

  return (
    <div className="dashboard">
      {renderStateContent()}

      {/* Reviewer preview toggle — lets people testing the app switch between
          disclosure statement states. Not part of the real filer experience. */}
      <section className="dashboard__toggle">
        <NysRadiogroup
          label="Preview disclosure statement state (demo only)"
          description="For reviewers testing this prototype. Switch the state to see how the dashboard and forms respond. This control is not part of the real filer experience."
          size="sm"
        >
          {STATE_OPTIONS.map(option => (
            <NysRadiobutton
              key={option.value}
              name="reviewState"
              value={option.value}
              label={option.label}
              description={option.description}
              checked={reviewState === option.value}
              onNysChange={(e: Event) => {
                const detail = (e as CustomEvent<{ checked: boolean; value: string }>).detail;
                if (detail.checked) {
                  dispatch({ type: 'SET_REVIEW_STATE', payload: option.value });
                }
              }}
            />
          ))}
        </NysRadiogroup>

        <NysButton
          className="dashboard__toggle-action"
          label="Clear company name"
          prefixIcon="delete"
          variant="outline"
          size="sm"
          onNysClick={() => dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: { legalName: '' } })}
        />
      </section>
    </div>
  );
}
