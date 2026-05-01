import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

export default function Documents() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
        Step 5: Documents
      </h2>
      <p style={{ color: 'var(--nys-color-text-secondary)', marginBottom: 'var(--nys-space-400)' }}>
        Document upload will be implemented in Phase 8.
      </p>
      <StepNavigation
        onBack={() => navigate('/register/contacts')}
        onContinue={() => navigate('/register/review')}
        continueLabel="Continue to review"
      />
    </div>
  );
}
