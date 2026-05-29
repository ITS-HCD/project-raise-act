import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { NysGlobalHeader } from './wrappers/NysGlobalHeader';
import { NysStepper } from './wrappers/NysStepper';
import { NysStep } from './wrappers/NysStep';
import { NysButton } from './wrappers/NysButton';
import { NysGlobalFooter } from './wrappers/NysGlobalFooter';
import { useRegistration } from '../context/RegistrationContext';
import { saveRegistration } from '../api/stubs';

const STORAGE_KEY = 'stepper-furthest-step';

const STEPS = [
  { label: 'Business Info', route: '/register/business-info' },
  { label: 'Addresses', route: '/register/addresses' },
  { label: 'Ownership', route: '/register/ownership' },
  { label: 'Contacts', route: '/register/contacts' },
  { label: 'Review & Certify', route: '/register/review' },
];

function routeToStepIndex(pathname: string): number {
  const idx = STEPS.findIndex(s => s.route === pathname);
  return idx >= 0 ? idx : 0;
}

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useRegistration();

  const selectedStep = routeToStepIndex(location.pathname);

  const stored = sessionStorage.getItem(STORAGE_KEY);
  const farthestStep = Math.max(stored !== null ? parseInt(stored, 10) : 0, selectedStep);

  useEffect(() => {
    const prev = parseInt(sessionStorage.getItem(STORAGE_KEY) ?? '0', 10);
    sessionStorage.setItem(STORAGE_KEY, String(Math.max(prev, selectedStep)));
  }, [selectedStep]);

  useLayoutEffect(() => {
    (document.querySelector('nys-stepper') as any)?.requestUpdate?.();
  }, [selectedStep, farthestStep]);

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
      <NysGlobalHeader
        nysLogo
        appName="Responsible AI Safety and Education (RAISE) Act"
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
                current={idx === farthestStep || undefined}
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
    </>
  );
}
