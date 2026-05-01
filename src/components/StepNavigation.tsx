import { NysButton } from './wrappers/NysButton';

interface StepNavigationProps {
  onBack?: () => void;
  onContinue: () => void;
  showBack?: boolean;
  continueLabel?: string;
}

export default function StepNavigation({
  onBack,
  onContinue,
  showBack = true,
  continueLabel = 'Continue',
}: StepNavigationProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--nys-space-200)', marginTop: 'var(--nys-space-400)' }}>
      {showBack && (
        <NysButton
          label="Back"
          variant="outline"
          type="button"
          onNysClick={onBack}
        />
      )}
      <NysButton
        label={continueLabel}
        variant="filled"
        type="button"
        onNysClick={onContinue}
      />
    </div>
  );
}
