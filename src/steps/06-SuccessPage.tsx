import { useLocation } from 'react-router-dom';
import { NysGlobalHeader } from '../components/wrappers/NysGlobalHeader';
import { NysGlobalFooter } from '../components/wrappers/NysGlobalFooter';
import { SuccessConfirmation } from '../components/SuccessConfirmation';

interface SuccessState {
  registrationId: string;
  submittedAt: string;
  contactEmail?: string;
}

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  const registrationId = state?.registrationId ?? 'REG-2024-00000';
  const submittedAt = state?.submittedAt ?? new Date().toISOString();
  const contactEmail = state?.contactEmail ?? '';

  return (
    <>
      <NysGlobalHeader nysLogo appName="Responsible AI Safety and Education (RAISE) Act" />
      <div className="nys-grid-container">
        <div className="nys-grid-row">
          <main className="nys-grid-col-12" id="main-content">
            <SuccessConfirmation
              registrationId={registrationId}
              submittedAt={submittedAt}
              contactEmail={contactEmail}
            />
          </main>
        </div>
      </div>
      <NysGlobalFooter agencyName="Department of Financial Services" />
    </>
  );
}
