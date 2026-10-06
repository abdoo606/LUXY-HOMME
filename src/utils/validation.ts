export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentFormData {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - allows international formats
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;

// Credit card validation (length + digits; Luhn check omitted for demo purposes)
const cardRegex = /^[0-9]{13,19}$/;

// CVV validation
const cvvRegex = /^[0-9]{3,4}$/;

// Expiry date validation (MM/YY format)
const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

// ZIP code validation
const zipRegex = /^[A-Za-z0-9\s-]{3,10}$/;

export function validateShippingForm(data: ShippingFormData, language: string = 'en'): ValidationErrors {
  const errors: ValidationErrors = {};

  const messages = {
    en: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      invalidZip: 'Please enter a valid postal code',
      minLength: (field: string, len: number) => `${field} must be at least ${len} characters`,
    },
    ar: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صالح',
      invalidPhone: 'يرجى إدخال رقم هاتف صالح',
      invalidZip: 'يرجى إدخال رمز بريدي صالح',
      minLength: (field: string, len: number) => `${field} يجب أن يكون على الأقل ${len} أحرف`,
    },
    fr: {
      required: 'Ce champ est requis',
      invalidEmail: 'Veuillez entrer une adresse email valide',
      invalidPhone: 'Veuillez entrer un numéro de téléphone valide',
      invalidZip: 'Veuillez entrer un code postal valide',
      minLength: (field: string, len: number) => `${field} doit contenir au moins ${len} caractères`,
    },
    es: {
      required: 'Este campo es obligatorio',
      invalidEmail: 'Por favor ingrese un email válido',
      invalidPhone: 'Por favor ingrese un número de teléfono válido',
      invalidZip: 'Por favor ingrese un código postal válido',
      minLength: (field: string, len: number) => `${field} debe tener al menos ${len} caracteres`,
    },
    de: {
      required: 'Dieses Feld ist erforderlich',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      invalidPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
      invalidZip: 'Bitte geben Sie eine gültige Postleitzahl ein',
      minLength: (field: string, len: number) => `${field} muss mindestens ${len} Zeichen lang sein`,
    },
    tr: {
      required: 'Bu alan zorunludur',
      invalidEmail: 'Lütfen geçerli bir e-posta adresi girin',
      invalidPhone: 'Lütfen geçerli bir telefon numarası girin',
      invalidZip: 'Lütfen geçerli bir posta kodu girin',
      minLength: (field: string, len: number) => `${field} en az ${len} karakter olmalıdır`,
    },
  };

  const msg = messages[language as keyof typeof messages] || messages.en;

  // First Name
  if (!data.firstName.trim()) {
    errors.firstName = msg.required;
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = msg.minLength('First name', 2);
  }

  // Last Name
  if (!data.lastName.trim()) {
    errors.lastName = msg.required;
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = msg.minLength('Last name', 2);
  }

  // Email
  if (!data.email.trim()) {
    errors.email = msg.required;
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = msg.invalidEmail;
  }

  // Phone
  if (!data.phone.trim()) {
    errors.phone = msg.required;
  } else if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = msg.invalidPhone;
  }

  // Address
  if (!data.address.trim()) {
    errors.address = msg.required;
  } else if (data.address.trim().length < 5) {
    errors.address = msg.minLength('Address', 5);
  }

  // City
  if (!data.city.trim()) {
    errors.city = msg.required;
  } else if (data.city.trim().length < 2) {
    errors.city = msg.minLength('City', 2);
  }

  // State
  if (!data.state.trim()) {
    errors.state = msg.required;
  }

  // ZIP
  if (!data.zip.trim()) {
    errors.zip = msg.required;
  } else if (!zipRegex.test(data.zip.trim())) {
    errors.zip = msg.invalidZip;
  }

  // Country
  if (!data.country.trim()) {
    errors.country = msg.required;
  }

  return errors;
}

export function validatePaymentForm(data: PaymentFormData, paymentMethod: string, language: string = 'en'): ValidationErrors {
  const errors: ValidationErrors = {};

  // Only validate card details for credit card payment
  if (paymentMethod !== 'credit') {
    return errors;
  }

  const messages = {
    en: {
      required: 'This field is required',
      invalidCard: 'Please enter a valid card number',
      invalidExpiry: 'Please enter a valid expiry date (MM/YY)',
      invalidCvv: 'Please enter a valid CVV',
      expiredCard: 'This card has expired',
    },
    ar: {
      required: 'هذا الحقل مطلوب',
      invalidCard: 'يرجى إدخال رقم بطاقة صالح',
      invalidExpiry: 'يرجى إدخال تاريخ انتهاء صالح (MM/YY)',
      invalidCvv: 'يرجى إدخال رمز CVV صالح',
      expiredCard: 'هذه البطاقة منتهية الصلاحية',
    },
    fr: {
      required: 'Ce champ est requis',
      invalidCard: 'Veuillez entrer un numéro de carte valide',
      invalidExpiry: 'Veuillez entrer une date d\'expiration valide (MM/AA)',
      invalidCvv: 'Veuillez entrer un CVV valide',
      expiredCard: 'Cette carte est expirée',
    },
    es: {
      required: 'Este campo es obligatorio',
      invalidCard: 'Por favor ingrese un número de tarjeta válido',
      invalidExpiry: 'Por favor ingrese una fecha de vencimiento válida (MM/AA)',
      invalidCvv: 'Por favor ingrese un CVV válido',
      expiredCard: 'Esta tarjeta ha expirado',
    },
    de: {
      required: 'Dieses Feld ist erforderlich',
      invalidCard: 'Bitte geben Sie eine gültige Kartennummer ein',
      invalidExpiry: 'Bitte geben Sie ein gültiges Ablaufdatum ein (MM/JJ)',
      invalidCvv: 'Bitte geben Sie einen gültigen CVV ein',
      expiredCard: 'Diese Karte ist abgelaufen',
    },
    tr: {
      required: 'Bu alan zorunludur',
      invalidCard: 'Lütfen geçerli bir kart numarası girin',
      invalidExpiry: 'Lütfen geçerli bir son kullanma tarihi girin (AA/YY)',
      invalidCvv: 'Lütfen geçerli bir CVV girin',
      expiredCard: 'Bu kart süresi dolmuş',
    },
  };

  const msg = messages[language as keyof typeof messages] || messages.en;

  // Card Number
  const cleanCardNumber = data.cardNumber.replace(/\s/g, '');
  if (!cleanCardNumber) {
    errors.cardNumber = msg.required;
  } else if (!cardRegex.test(cleanCardNumber)) {
    errors.cardNumber = msg.invalidCard;
  }

  // Expiry Date
  if (!data.cardExpiry.trim()) {
    errors.cardExpiry = msg.required;
  } else if (!expiryRegex.test(data.cardExpiry.trim())) {
    errors.cardExpiry = msg.invalidExpiry;
  } else {
    // Check if card is expired (valid through the last day of its expiry month)
    const [month, year] = data.cardExpiry.split('/').map(Number);
    // First moment of the month AFTER the expiry month
    const expiry = new Date(2000 + year, month, 1);
    const now = new Date();
    if (expiry <= now) {
      errors.cardExpiry = msg.expiredCard;
    }
  }

  // CVV
  if (!data.cardCvv.trim()) {
    errors.cardCvv = msg.required;
  } else if (!cvvRegex.test(data.cardCvv.trim())) {
    errors.cardCvv = msg.invalidCvv;
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ').substring(0, 19) : '';
}

export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  }
  return cleaned;
}
