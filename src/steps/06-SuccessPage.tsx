import { useLocation } from 'react-router-dom';
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
  <SuccessConfirmation
    registrationId={registrationId}
    submittedAt={submittedAt}
    contactEmail={contactEmail}
  />
  );
}
