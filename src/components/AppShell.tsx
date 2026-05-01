import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { NysUnavHeader } from './wrappers/NysUnavHeader';
import { NysGlobalHeader } from './wrappers/NysGlobalHeader';
import { NysStepper } from './wrappers/NysStepper';
import { NysStep } from './wrappers/NysStep';
import { NysButton } from './wrappers/NysButton';
import { NysGlobalFooter } from './wrappers/NysGlobalFooter';
import { NysUnavFooter } from './wrappers/NysUnavFooter';

const STEPS = [
  { label: 'Business Info', route: '/register/business-info' },
  { label: 'Addresses', route: '/register/addresses' },
  { label: 'Ownership', route: '/register/ownership' },
  { label: 'Contacts', route: '/register/contacts' },
  { label: 'Documents', route: '/register/documents' },
  { label: 'Review & Certify', route: '/register/review' },
];

function routeToStepIndex(pathname: string): number {
  const idx = STEPS.findIndex(s => s.route === pathname);
  return idx >= 0 ? idx : 0;
}

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedStep = routeToStepIndex(location.pathname);
  const currentStep = STEPS.length - 1;

  return (
    <>
      <NysUnavHeader hideSearch hideTranslate />
      <NysGlobalHeader
        appName="RAISE"
        agencyName="Department of Financial Services"
      />
      <div className="nys-grid-container">
        <div className="nys-grid-row">
          <NysStepper
            label="Register your Company"
            className="nys-grid-col-12 nys-desktop:nys-grid-col-3"
          >
            {STEPS.map((step, idx) => (
              <NysStep
                key={step.route}
                label={step.label}
                href={step.route}
                current={idx === currentStep}
                selected={idx === selectedStep && selectedStep !== currentStep}
                onNysStepClick={(e: CustomEvent) => {
                  e.preventDefault();
                  const detail = e.detail as { href: string };
                  navigate(detail.href);
                }}
              />
            ))}
            <div slot="actions">
              <NysButton
                label="Save and Exit"
                variant="outline"
                size="sm"
                fullWidth
              />
            </div>
          </NysStepper>
          <main
            className="nys-grid-col-12 nys-desktop:nys-grid-col-9"
            id="main-content"
          >
            <Outlet />
          </main>
        </div>
      </div>
      <NysGlobalFooter agencyName="Department of Financial Services" />
      <NysUnavFooter />
    </>
  );
}
