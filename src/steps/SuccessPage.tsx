import { NysUnavHeader } from '../components/wrappers/NysUnavHeader';
import { NysGlobalHeader } from '../components/wrappers/NysGlobalHeader';
import { NysGlobalFooter } from '../components/wrappers/NysGlobalFooter';
import { NysUnavFooter } from '../components/wrappers/NysUnavFooter';

export default function SuccessPage() {
  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader
        appName="RAISE"
        agencyName="Department of Financial Services"
      />
      <div className="nys-grid-container">
        <div className="nys-grid-row">
          <main
            className="nys-grid-col-12"
            id="main-content"
            style={{ padding: 'var(--nys-space-600) var(--nys-space-400)', textAlign: 'center' }}
          >
            <h1 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
              Your registration was successfully submitted!
            </h1>
            <p style={{ color: 'var(--nys-color-text-secondary)' }}>
              Success page content will be implemented in Phase 8.
            </p>
          </main>
        </div>
      </div>
      <NysGlobalFooter agencyName="Department of Financial Services" />
      <NysUnavFooter />
    </>
  );
}
