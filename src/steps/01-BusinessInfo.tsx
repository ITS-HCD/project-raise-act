import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

export default function BusinessInfo() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
        Step 1: Business Info
      </h2>
      <p style={{ color: 'var(--nys-color-text-secondary)', marginBottom: 'var(--nys-space-400)' }}>
        Business information fields will be implemented in Phase 6.
      </p>
      <StepNavigation
        showBack={false}
        onContinue={() => navigate('/register/addresses')}
      />
    </div>
  );
}
