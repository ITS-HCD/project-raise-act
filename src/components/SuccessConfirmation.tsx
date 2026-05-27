import { useNavigate } from 'react-router-dom';
import { NysAlert } from './wrappers/NysAlert';
import { NysButton } from './wrappers/NysButton';

interface SuccessConfirmationProps {
  registrationId: string;
  submittedAt: string;
  contactEmail?: string;
}

export function SuccessConfirmation({
  registrationId,
  submittedAt,
  contactEmail,
}: SuccessConfirmationProps) {
  const navigate = useNavigate();
  const formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <div style={{ marginBottom: 'var(--nys-space-400)' }}>
        <NysAlert
          type="success"
          heading="Your registration was successfully submitted!"
          text={`Your recent registration submission in the DFS RAISE System has been received on ${formattedDate}.`}
        />
      </div>

      <p style={{ fontFamily: 'var(--nys-font-family-body)', marginBottom: 'var(--nys-space-300)' }}>
        DFS is currently reviewing your submission and will update you when the status of
        your registration has changed, or to request additional information.
      </p>

      {contactEmail && (
        <p style={{ fontFamily: 'var(--nys-font-family-body)', marginBottom: 'var(--nys-space-300)' }}>
          <strong>Confirmation email sent to:</strong> {contactEmail}
        </p>
      )}

      <p style={{ fontFamily: 'var(--nys-font-family-body)', marginBottom: 'var(--nys-space-400)' }}>
        If you need to refer to this registration, you can reference:
        <br />
        <strong>Registration ID:</strong> {registrationId}
      </p>

      <NysButton
        label="Return to Dashboard"
        variant="filled"
        onNysClick={() => navigate('/')}
      />
    </div>
  );
}
