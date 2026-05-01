import { NysUnavHeader } from './components/wrappers/NysUnavHeader';
import { NysGlobalHeader } from './components/wrappers/NysGlobalHeader';
import { NysButton } from './components/wrappers/NysButton';
import { NysGlobalFooter } from './components/wrappers/NysGlobalFooter';
import { NysUnavFooter } from './components/wrappers/NysUnavFooter';

function App() {
  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader
        appName="RAISE"
        agencyName="Department of Financial Services"
        nysLogo
      />
      <main style={{ padding: 'var(--nys-space-400)' }}>
        <h1 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
          Phase 1 Verification — DS Components
        </h1>
        <p style={{ marginBottom: 'var(--nys-space-300)' }}>
          If this page renders with the business theme (teal primary color), Proxima Nova font,
          and the header/button below, Phase 1 is complete.
        </p>
        <NysButton label="Continue" variant="filled" />
        <span style={{ display: 'inline-block', width: 'var(--nys-space-200)' }} />
        <NysButton label="Save and Exit" variant="outline" />
      </main>
      <NysGlobalFooter agencyName="Department of Financial Services" />
      <NysUnavFooter />
    </>
  );
}

export default App;
