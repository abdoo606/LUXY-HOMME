export interface PatientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  reason: string;
  notes: string;
  isNew: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export type Errors<T> = Partial<Record<keyof T, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,18}$/;

export function validatePatient(data: PatientForm, t: (k: string) => string): Errors<PatientForm> {
  const errors: Errors<PatientForm> = {};
  if (!data.firstName.trim()) errors.firstName = t('general.required');
  if (!data.lastName.trim()) errors.lastName = t('general.required');
  if (!data.email.trim()) errors.email = t('general.required');
  else if (!emailRegex.test(data.email.trim())) errors.email = t('general.invalidEmail');
  if (!data.phone.trim()) errors.phone = t('general.required');
  else if (!phoneRegex.test(data.phone.trim())) errors.phone = t('general.invalidPhone');
  if (!data.dob.trim()) errors.dob = t('general.required');
  if (!data.reason.trim()) errors.reason = t('general.required');
  return errors;
}

export function validateContact(data: ContactForm, t: (k: string) => string): Errors<ContactForm> {
  const errors: Errors<ContactForm> = {};
  if (!data.name.trim()) errors.name = t('general.required');
  if (!data.email.trim()) errors.email = t('general.required');
  else if (!emailRegex.test(data.email.trim())) errors.email = t('general.invalidEmail');
  if (!data.phone.trim()) errors.phone = t('general.required');
  else if (!phoneRegex.test(data.phone.trim())) errors.phone = t('general.invalidPhone');
  if (!data.subject.trim()) errors.subject = t('general.required');
  if (!data.message.trim()) errors.message = t('general.required');
  return errors;
}

export function hasErrors<T>(errors: Errors<T>): boolean {
  return Object.keys(errors).length > 0;
}
