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
    <div className="success-confirmation">
      <div className="success-confirmation__alert">
        <NysAlert
          type="success"
          heading="Your disclosure statement was successfully submitted!"
          text={`Your disclosure statement in the RAISE System has been received on ${formattedDate}.`}
        />
      </div>

      <p>
        {contactEmail && (
          <>
            <strong>A confirmation email has been sent to {contactEmail}.</strong>
            <br />
          </>
        )}
        <strong>Disclosure ID:</strong> {registrationId}
      </p>

      <p>
        New York State is currently reviewing your disclosure statement and will update
        you when the status of your disclosure statement has changed, or to request
        additional information.
      </p>

      <NysButton
        label="Return to Dashboard"
        variant="filled"
        onNysClick={() => navigate('/')}
      />
    </div>
  );
}
