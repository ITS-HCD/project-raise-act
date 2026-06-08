import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { NysStepper } from './wrappers/NysStepper';
import { NysStep } from './wrappers/NysStep';
import { NysButton } from './wrappers/NysButton';
import { AdditionalInfoAlert } from './AdditionalInfoAlert';
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
  const { data, dispatch } = useRegistration();

  const selectedStep = routeToStepIndex(location.pathname);

  const stored = sessionStorage.getItem(STORAGE_KEY);
  const farthestStep = Math.max(stored !== null ? parseInt(stored, 10) : 0, selectedStep);

  useEffect(() => {
    const prev = parseInt(sessionStorage.getItem(STORAGE_KEY) ?? '0', 10);
    sessionStorage.setItem(STORAGE_KEY, String(Math.max(prev, selectedStep)));
  }, [selectedStep]);

  useLayoutEffect(() => {
    const stepper = document.querySelector('nys-stepper') as HTMLElement & { requestUpdate?: () => void };
    stepper?.requestUpdate?.();
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
    // A saved-but-unsubmitted disclosure shows the "continue" card on the
    // dashboard. Don't downgrade a disclosure that's already been submitted.
    if (data.reviewState === 'not_started' || data.reviewState === 'in_progress') {
      dispatch({ type: 'SET_REVIEW_STATE', payload: 'in_progress' });
    }
    navigate('/');
  }

  return (
    <div className="nys-grid-container">
      <div className="nys-grid-row">
        <NysStepper
          label="Disclosure Statement"
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
        <div
          id="step-content"
          className="nys-grid-col-12 nys-desktop:nys-grid-col-9"
        >
          {data.reviewState === 'needs_info' && (
            <AdditionalInfoAlert className="step-content__alert" />
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
