import { useNavigate } from 'react-router-dom';
import { NysUnavHeader } from '../components/wrappers/NysUnavHeader';
import { NysUnavFooter } from '../components/wrappers/NysUnavFooter';
import { NysGlobalHeader } from '../components/wrappers/NysGlobalHeader';
import { NysGlobalFooter } from '../components/wrappers/NysGlobalFooter';
import { NysAlert } from '../components/wrappers/NysAlert';
import { NysButton } from '../components/wrappers/NysButton';
import { NysAvatar } from '../components/wrappers/NysAvatar';

const COMPANY_NAME = 'Example Frontier Systems Inc.';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader appName="Responsible AI Safety and Education (RAISE) Act">
              <NysButton
                slot="user-actions"
                label="User Name"
                prefixIcon="slotted"
              >
                <NysAvatar
                  slot="prefix-icon"
                  ariaLabel="User avatar"
                  initials="NY"
                />
              </NysButton>
            </NysGlobalHeader>
      <div className="nys-grid-container">
        <div className="nys-grid-row">
          <main className="nys-grid-col-12" id="main-content">
            <h1
              style={{
                fontFamily: 'var(--nys-font-family-ui, "Proxima Nova")',
                fontSize: 'var(--nys-font-size-ui-xl, 20px)',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'var(--nys-font-lineheight-ui-xl, 28px)',
                letterSpacing: 'var(--nys-font-letterspacing-ui-xl, 0.017px)',
                margin: '0',
              }}
            >
              {COMPANY_NAME}
            </h1>

            <NysAlert
              style={{ margin: 'var(--nys-space-250) 0' }}
              type="warning"
              heading="Disclosure Statement required to operate under the RAISE Act"
              text={`${COMPANY_NAME} must be registered with the Department of Financial Services before submitting reports, disclosures, or incident filings. Registration ensures you meet New York State requirements.`}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid var(--nys-color-neutral-200)',
                borderRadius: 'var(--nys-radius-md)',
                gap: 'var(--nys-space-200)',
                padding: 'var(--nys-space-200)',
                textAlign: 'center',
                maxWidth: '880px',
                margin: '0 auto var(--nys-space-400) auto',
              }}
            >
              <p
                style={{
                  color: 'var(--nys-color-theme, #084B52)',
                  textAlign: 'center',
                  fontFamily: 'var(--nys-type-family-ui, "Proxima Nova")',
                  fontSize: 'var(--nys-type-size-ui-xl, 20px)',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'var(--nys-font-lineheight-ui-xl, 28px)',
                  letterSpacing: 'var(--nys-font-letterspacing-ui-xl, 0.017px)',
                }}
              >
                No filings yet
              </p>
              <p>
                {COMPANY_NAME} must be registered with the Department of Financial Services
                before submitting reports, disclosures, or incident filings. Registration
                ensures you meet New York State requirements.
              </p>
              <NysButton
                label="Start Registration"
                variant="filled"
                onNysClick={() => navigate('/register/business-info')}
              />
            </div>
          </main>
        </div>
      </div>
      <NysGlobalFooter agencyName="Responsible AI Safety and Education (RAISE) Act" />
      <NysUnavFooter />
    </>
  );
}
