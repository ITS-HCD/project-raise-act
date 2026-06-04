import { useContext } from 'react';
import { RegistrationContext } from '../context/RegistrationContext';
import type { RegistrationContextValue } from '../context/RegistrationContext';

export function useRegistration(): RegistrationContextValue {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistration must be used within RegistrationProvider');
  return ctx;
}
