import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/StepNavigation';

export default function Addresses() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2 style={{ fontFamily: 'var(--nys-font-heading)', marginBottom: 'var(--nys-space-300)' }}>
        Step 2: Addresses
      </h2>
      <p style={{ color: 'var(--nys-color-text-secondary)', marginBottom: 'var(--nys-space-400)' }}>
        Address fields will be implemented in Phase 6.
      </p>
      <StepNavigation
        onBack={() => navigate('/register/business-info')}
        onContinue={() => navigate('/register/ownership')}
      />
    </div>
  );
}
