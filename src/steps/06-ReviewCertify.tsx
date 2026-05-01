import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

export default function ReviewCertify() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
        Step 6: Review &amp; Certify
      </h2>
      <p style={{ color: 'var(--nys-color-text-secondary)', marginBottom: 'var(--nys-space-400)' }}>
        Review and certification will be implemented in Phase 8.
      </p>
      <StepNavigation
        onBack={() => navigate('/register/documents')}
        onContinue={() => navigate('/register/success')}
        continueLabel="Submit"
      />
    </div>
  );
}
