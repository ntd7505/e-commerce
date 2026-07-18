export interface PasswordValidationResult {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  digit: boolean;
  special: boolean;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidationResult {
  const length = password.length >= 8;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const digit = /[0-9]/.test(password);
  const special = /[!@#$%^&*]/.test(password);

  return {
    length,
    uppercase,
    lowercase,
    digit,
    special,
    isValid: length && uppercase && lowercase && digit && special,
  };
}
