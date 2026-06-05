import type { RegistrationData } from '../types/registration';

export type ValidationErrors = Record<string, string>;

export function isRequired(value: string | number | undefined | null): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return !isNaN(value);
  // Coerce defensively: a non-string (e.g. a stray Date from a date picker)
  // must not throw on .trim() and bring down the whole validation pass.
  return String(value).trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const d = value.replace(/\D/g, '');
  return d.length >= 4 && d.length <= 15;
}

export function isValidZip(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

export function isValidPercentage(value: string | number): boolean {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(n) && n >= 0 && n <= 100;
}

export function isDateAfter(date: string, referenceDate: string): boolean {
  if (!date || !referenceDate) return false;
  return new Date(date) > new Date(referenceDate);
}

export function validateStep(stepNumber: number, data: RegistrationData): ValidationErrors {
  const errors: ValidationErrors = {};

  switch (stepNumber) {
    case 1: {
      if (!isRequired(data.businessInfo.legalName))
        errors['legalName'] = 'Legal Company Name is required.';
      if (!isRequired(data.businessInfo.ownershipStructure))
        errors['ownershipStructure'] = 'Ownership structure is required.';
      break;
    }

    case 2: {
      const p = data.addresses.principal;
      if (!isRequired(p.country)) errors['principal.country'] = 'Country is required.';
      if (!isRequired(p.street)) errors['principal.street'] = 'Street is required.';
      if (!isRequired(p.city)) errors['principal.city'] = 'City is required.';
      if (p.country === 'US' || p.country === '') {
        if (!isRequired(p.state)) errors['principal.state'] = 'State is required.';
        if (!isRequired(p.zip)) {
          errors['principal.zip'] = 'Zip code is required.';
        } else if (!isValidZip(p.zip)) {
          errors['principal.zip'] = 'Enter a valid zip code (e.g. 12345 or 12345-6789).';
        }
      }
      break;
    }

    case 3: {
      data.ownership.current.forEach((owner, i) => {
        if (!isRequired(owner.type))
          errors[`current[${i}].type`] = 'Owner type is required.';
        if (owner.type === 'person') {
          if (!isRequired(owner.firstName))
            errors[`current[${i}].firstName`] = 'First name is required.';
          if (!isRequired(owner.lastName))
            errors[`current[${i}].lastName`] = 'Last name is required.';
        } else if (owner.type === 'entity') {
          if (!isRequired(owner.entityName))
            errors[`current[${i}].entityName`] = 'Entity name is required.';
        }
        if (!isValidPercentage(owner.percentageOwned))
          errors[`current[${i}].percentageOwned`] = 'Enter a percentage between 0 and 100.';
        if (!isRequired(owner.startDate))
          errors[`current[${i}].startDate`] = 'Start date is required.';
      });

      if (data.businessInfo.ownershipStructure === 'private') {
        data.ownership.former.forEach((owner, i) => {
          if (!isRequired(owner.type))
            errors[`former[${i}].type`] = 'Owner type is required.';
          if (owner.type === 'person') {
            if (!isRequired(owner.firstName))
              errors[`former[${i}].firstName`] = 'First name is required.';
            if (!isRequired(owner.lastName))
              errors[`former[${i}].lastName`] = 'Last name is required.';
          } else if (owner.type === 'entity') {
            if (!isRequired(owner.entityName))
              errors[`former[${i}].entityName`] = 'Entity name is required.';
          }
          if (!isValidPercentage(owner.percentageOwned))
            errors[`former[${i}].percentageOwned`] = 'Enter a percentage between 0 and 100.';
          if (!isRequired(owner.startDate))
            errors[`former[${i}].startDate`] = 'Start date is required.';
          if (!isRequired(owner.endDate)) {
            errors[`former[${i}].endDate`] = 'End date is required.';
          } else if (owner.startDate && !isDateAfter(owner.endDate!, owner.startDate)) {
            errors[`former[${i}].endDate`] = 'End date must be after start date.';
          }
        });
      }
      break;
    }

    case 4: {
      const c = data.contacts.primary;
      if (!isRequired(c.firstName)) errors['primary.firstName'] = 'First name is required.';
      if (!isRequired(c.lastName)) errors['primary.lastName'] = 'Last name is required.';
      if (!isRequired(c.title)) errors['primary.title'] = 'Title is required.';
      if (!isRequired(c.phone)) {
        errors['primary.phone'] = 'Business phone is required.';
      } else if (!isValidPhone(c.phone)) {
        errors['primary.phone'] = 'Enter a valid phone number.';
      }
      if (!isRequired(c.email)) {
        errors['primary.email'] = 'Business email is required.';
      } else if (!isValidEmail(c.email)) {
        errors['primary.email'] = 'Enter a valid email address.';
      }
      break;
    }

    case 5: {
      if (!data.certification)
        errors['certification'] = 'You must certify the information before submitting.';
      break;
    }
  }

  return errors;
}
