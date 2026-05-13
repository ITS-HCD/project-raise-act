import { useState, useCallback } from 'react';
import { validateStep, type ValidationErrors } from './validation';
import type { RegistrationData } from '../types/registration';

interface FieldProps {
  showError: boolean;
  errorMessage: string;
}

interface UseStepValidationReturn {
  errors: ValidationErrors;
  validate: () => boolean;
  getFieldProps: (fieldName: string) => FieldProps;
  clearErrors: () => void;
}

// Wrap NYSDS form fields in a container with data-field-name="<fieldName>" so
// this hook can scroll to and focus the first invalid field on validation failure.
export function useStepValidation(
  stepNumber: number,
  data: RegistrationData
): UseStepValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((): boolean => {
    const newErrors = validateStep(stepNumber, data);
    setErrors(newErrors);

    const firstKey = Object.keys(newErrors)[0];
    if (firstKey) {
      requestAnimationFrame(() => {
        const selector = `[data-field-name="${CSS.escape(firstKey)}"]`;
        const container = document.querySelector<HTMLElement>(selector);
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          const focusTarget = container.querySelector<HTMLElement>(
            'nys-textinput, nys-select, nys-radiogroup, nys-datepicker, nys-checkbox, nys-textarea'
          );
          focusTarget?.focus();
        }
      });
      return false;
    }
    return true;
  }, [stepNumber, data]);

  const getFieldProps = useCallback(
    (fieldName: string): FieldProps => ({
      showError: fieldName in errors,
      errorMessage: errors[fieldName] ?? '',
    }),
    [errors]
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  return { errors, validate, getFieldProps, clearErrors };
}
