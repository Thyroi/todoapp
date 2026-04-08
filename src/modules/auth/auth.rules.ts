export const passwordMinLength = 8;

const uppercasePattern = /[A-Z]/;
const numberPattern = /\d/;
const specialCharacterPattern = /[^A-Za-z0-9]/;

export function isValidEmailAddress(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getPasswordRuleChecks(password: string) {
  return [
    {
      id: "length",
      label: `Al menos ${passwordMinLength} caracteres`,
      passed: password.length >= passwordMinLength,
    },
    {
      id: "uppercase",
      label: "Una letra mayuscula",
      passed: uppercasePattern.test(password),
    },
    {
      id: "number",
      label: "Un numero",
      passed: numberPattern.test(password),
    },
    {
      id: "special",
      label: "Un caracter especial",
      passed: specialCharacterPattern.test(password),
    },
  ] as const;
}

export function isStrongPassword(password: string) {
  return getPasswordRuleChecks(password).every((rule) => rule.passed);
}
