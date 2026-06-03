import { useNavigate } from 'react-router-dom';
import { NysAlert } from '../components/wrappers/NysAlert';
import { NysButton } from '../components/wrappers/NysButton';

const COMPANY_NAME = 'Example Frontier Systems Inc.';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1
        style={{
          fontFamily: 'var(--nys-font-family-ui, "Proxima Nova")',
          fontSize: 'var(--nys-font-size-ui-xl, 20px)',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'var(--nys-font-lineheight-ui-xl, 28px)',
          letterSpacing: 'var(--nys-font-letterspacing-ui-xl, 0.017px)',
          margin: '0',
          background: 'var(--Neutral-0, #FFF)',
          boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
          display: 'flex',
          height: '71px',
          width: '100vw',
          position: 'relative',
          left: '50%',
          marginLeft: '-50vw',
          padding: '22px 39px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          flexShrink: '0',
          alignSelf: 'stretch',
        }}
      >
        {COMPANY_NAME}
      </h1>

      <NysAlert
        style={{ margin: 'var(--nys-space-250) 0' }}
        type="warning"
        heading="Disclosure Statement required to operate under the RAISE Act"
        text={`${COMPANY_NAME} must submit a disclosure statement before submitting reports or incident filings. A disclosure statement ensures you meet New York State requirements.`}
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
          Your disclosure statement has not been started.
        </p>
        <p>
          {COMPANY_NAME} must submit a disclosure statement before submitting reports or incident filings. 
A disclosure statement ensures you meet New York State requirements.
        </p>
        <NysButton
          label="Start Disclosure Statement"
          variant="filled"
          onNysClick={() => navigate('/register/business-info')}
        />
      </div>
    </>
  );
}
