import { useNavigate } from 'react-router-dom';
import { NysIcon } from './wrappers/NysIcon';
import { NysButton } from './wrappers/NysButton';
import { NysDivider } from './wrappers/NysDivider';

interface SuccessConfirmationProps {
  registrationId: string;
  submittedAt: string;
}

export function SuccessConfirmation({ registrationId, submittedAt }: SuccessConfirmationProps) {
  const navigate = useNavigate();
  const formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nys-space-200)', marginBottom: 'var(--nys-space-300)' }}>
        <NysIcon name="check_circle" size="2xl" color="var(--nys-color-success)" ariaLabel="Success" />
        <h1 style={{ fontFamily: 'var(--nys-font-heading)', fontSize: 'var(--nys-font-size-2xl)', margin: 0 }}>
          Your registration was successfully submitted!
        </h1>
      </div>
      <NysDivider />
      <div style={{ margin: 'var(--nys-space-400) 0' }}>
        <p style={{ fontFamily: 'var(--nys-font-body)', marginBottom: 'var(--nys-space-300)' }}>
          Your recent registration submission in the DFS RAISE System has been received on {formattedDate}.
        </p>
        <p style={{ fontFamily: 'var(--nys-font-body)', marginBottom: 'var(--nys-space-300)' }}>
          DFS is currently reviewing your submission and will update you when the status of your registration has changed, or to request additional information.
        </p>
        <p style={{ fontFamily: 'var(--nys-font-body)' }}>
          If you need to refer to this registration, you can reference Registration ID {registrationId}.
        </p>
      </div>
      <NysDivider />
      <div style={{ marginTop: 'var(--nys-space-400)' }}>
        <NysButton label="Home" variant="filled" onNysClick={() => navigate('/')} />
      </div>
    </div>
  );
}
