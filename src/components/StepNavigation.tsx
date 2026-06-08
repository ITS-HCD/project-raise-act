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
    // Primary action first in the DOM (first tab stop); CSS renders it on the
    // right and Back on the left.
    <div className="wizard-nav">
      <NysButton
        label={continueLabel}
        variant="filled"
        type="button"
        onNysClick={onContinue}
      />
      {showBack && (
        <NysButton
          label="Back"
          variant="text"
          type="button"
          onNysClick={onBack}
        />
      )}
    </div>
  );
}
