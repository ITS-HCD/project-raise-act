import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { NysFileinput } from '../components/wrappers/NysFileinput';
import StepNavigation from '../components/StepNavigation';

export default function Documents() {
  const navigate = useNavigate();
  const { data, dispatch } = useRegistration();

  function handleFilesChange(e: Event) {
    const { files } = (e as CustomEvent<{ id: string; files: File[] }>).detail;
    dispatch({ type: 'SET_DOCUMENTS', payload: files });
  }

  return (
    <div style={{ padding: 'var(--nys-space-400)' }}>
      <h2
        style={{
          fontFamily: 'var(--nys-font-heading)',
          fontSize: 'var(--nys-font-size-3xl)',
          marginBottom: 'var(--nys-space-200)',
        }}
      >
        Supporting Documents
      </h2>
      <p
        style={{
          fontFamily: 'var(--nys-font-body)',
          fontSize: 'var(--nys-font-size-sm)',
          color: 'var(--nys-color-text-secondary)',
          marginBottom: 'var(--nys-space-400)',
        }}
      >
        Upload any supporting documentation for your RAISE Act registration. Accepted formats: PDF,
        DOC, DOCX.
      </p>

      <NysFileinput
        label="Supporting documentation"
        multiple
        dropzone
        accept=".pdf,.doc,.docx"
        optional
        onNysChange={handleFilesChange}
      />

      {data.documents.length > 0 && (
        <p
          style={{
            fontFamily: 'var(--nys-font-body)',
            fontSize: 'var(--nys-font-size-sm)',
            color: 'var(--nys-color-text-secondary)',
            marginTop: 'var(--nys-space-200)',
          }}
        >
          {data.documents.length} file{data.documents.length !== 1 ? 's' : ''} staged for submission.
        </p>
      )}

      <StepNavigation
        onBack={() => navigate('/register/contacts')}
        onContinue={() => navigate('/register/review')}
        continueLabel="Continue to review"
      />
    </div>
  );
}
