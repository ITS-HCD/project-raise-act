import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

export default function Ownership() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
        Step 3: Ownership
      </h2>
      <p style={{ color: 'var(--nys-color-text-secondary)', marginBottom: 'var(--nys-space-400)' }}>
        Ownership fields will be implemented in Phase 7.
      </p>
      <StepNavigation
        onBack={() => navigate('/register/addresses')}
        onContinue={() => navigate('/register/contacts')}
      />
    </div>
  );
}
