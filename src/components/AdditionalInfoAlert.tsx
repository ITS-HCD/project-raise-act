import { NysAlert } from './wrappers/NysAlert';

// Placeholder copy until the real "reason" is wired through from the reviewing
// office. Shown both on the dashboard and atop each wizard step when the
// disclosure statement is in the `needs_info` state.
export const INFO_REQUEST_REASON = '[PLACEHOLDER REASON]';

export function AdditionalInfoAlert({ className }: { className?: string }) {
  return (
    <NysAlert
      className={className}
      type="warning"
      heading="Additional information requested"
      text={INFO_REQUEST_REASON}
    />
  );
}
