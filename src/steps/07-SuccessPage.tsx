import { useLocation } from 'react-router-dom';
import { NysUnavHeader } from '../components/wrappers/NysUnavHeader';
import { NysGlobalHeader } from '../components/wrappers/NysGlobalHeader';
import { NysGlobalFooter } from '../components/wrappers/NysGlobalFooter';
import { NysUnavFooter } from '../components/wrappers/NysUnavFooter';
import { SuccessConfirmation } from '../components/SuccessConfirmation';

interface SuccessState {
  registrationId: string;
  submittedAt: string;
}

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  const registrationId = state?.registrationId ?? 'REG-2024-00000';
  const submittedAt = state?.submittedAt ?? new Date().toISOString();

  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader
        appName="RAISE"
        agencyName="Department of Financial Services"
      />
      <div className="nys-grid-container">
        <div className="nys-grid-row">
          <main className="nys-grid-col-12" id="main-content">
            <SuccessConfirmation
              registrationId={registrationId}
              submittedAt={submittedAt}
            />
          </main>
        </div>
      </div>
      <NysGlobalFooter agencyName="Department of Financial Services" />
      <NysUnavFooter />
    </>
  );
}
