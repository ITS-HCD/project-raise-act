import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { NysUnavHeader } from './wrappers/NysUnavHeader';
import { NysGlobalHeader } from './wrappers/NysGlobalHeader';
import { NysStepper } from './wrappers/NysStepper';
import { NysStep } from './wrappers/NysStep';
import { NysButton } from './wrappers/NysButton';
import { NysGlobalFooter } from './wrappers/NysGlobalFooter';
import { NysUnavFooter } from './wrappers/NysUnavFooter';
import { useRegistration } from '../context/RegistrationContext';
import { saveRegistration } from '../api/stubs';

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
  const { data, farthestStep, advanceToStep } = useRegistration();
  const stepperRef = useRef<HTMLElement | null>(null);

  const selectedStep = routeToStepIndex(location.pathname);

  useEffect(() => {
    advanceToStep(selectedStep);
  }, [selectedStep]);

  // toggleAttribute for `current` only — fixes a Lit initialization timing bug where
  // _validateSteps() runs before React props settle, marking all steps as `previous`.
  // `selected` stays in React props so the stepper's own update cycle manages it correctly.
  useLayoutEffect(() => {
    const steps = Array.from(stepperRef.current?.querySelectorAll<HTMLElement>('nys-step') ?? []);
    steps.forEach((el, i) => {
      el.toggleAttribute('current', i === farthestStep);
    });
  }, [farthestStep]);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>('#main-content h1, #main-content h2');
    if (el) {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus();
    }
  }, [location.pathname]);

  async function handleSaveAndExit() {
    await saveRegistration(selectedStep + 1, data);
    navigate('/');
  }

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
            ref={stepperRef}
            label="Register your Company"
            className="nys-grid-col-12 nys-desktop:nys-grid-col-3"
          >
            {STEPS.map((step, idx) => (
              <NysStep
                key={step.route}
                label={step.label}
                href={step.route}
                selected={idx === selectedStep || undefined}
                onNysStepClick={(e: CustomEvent) => {
                  e.preventDefault();
                  navigate(step.route);
                }}
              />
            ))}
            <div slot="actions">
              <NysButton
                label="Save and Exit"
                variant="outline"
                size="sm"
                fullWidth
                onNysClick={handleSaveAndExit}
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
