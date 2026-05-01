import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

export default function Contacts() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
        Step 4: Contacts
      </h2>
      <p style={{ color: 'var(--nys-color-text-secondary)', marginBottom: 'var(--nys-space-400)' }}>
        Contact fields will be implemented in Phase 7.
      </p>
      <StepNavigation
        onBack={() => navigate('/register/ownership')}
        onContinue={() => navigate('/register/documents')}
      />
    </div>
  );
}
