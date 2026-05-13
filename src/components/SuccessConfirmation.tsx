import { useNavigate } from 'react-router-dom';
import { NysIcon } from './wrappers/NysIcon';
import { NysButton } from './wrappers/NysButton';
import styles from './SuccessConfirmation.module.css';

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
    <div className={styles.container}>
      <div className={styles.icon}>
        <NysIcon
          name="check_circle"
          size="5xl"
          color="var(--nys-color-success)"
          ariaLabel="Success"
        />
      </div>
      <h1 className={styles.heading}>Your registration was successfully submitted!</h1>
      <p className={styles.body}>
        Your DFS RAISE Act registration (ID: {registrationId}) was submitted on {formattedDate}.
      </p>
      <p className={styles.body}>
        The Department of Financial Services will review your submission and contact you if additional information is needed.
      </p>
      <div className={styles.button}>
        <NysButton label="Home" variant="filled" onClick={() => navigate('/')} />
      </div>
    </div>
  );
}
