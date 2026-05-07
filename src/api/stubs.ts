import type { RegistrationData } from '../types/registration';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface SaveResponse {
  success: boolean;
  registrationId: string;
}

export interface SubmitResponse {
  success: boolean;
  registrationId: string;
  submittedAt: string;
}

export interface LoadResponse {
  data: Partial<RegistrationData>;
  currentStep: number;
}

export async function saveRegistration(
  step: number,
  data: Partial<RegistrationData>
): Promise<SaveResponse> {
  await delay(500);
  console.log('[stub] saveRegistration', { step, data });
  return { success: true, registrationId: 'REG-DRAFT-001' };
}

export async function submitRegistration(
  data: RegistrationData
): Promise<SubmitResponse> {
  await delay(500);
  console.log('[stub] submitRegistration', data);
  return {
    success: true,
    registrationId: 'REG-2024-00042',
    submittedAt: new Date().toISOString(),
  };
}

export async function loadRegistration(id: string): Promise<LoadResponse> {
  await delay(500);
  console.log('[stub] loadRegistration', id);
  return { data: {}, currentStep: 1 };
}
