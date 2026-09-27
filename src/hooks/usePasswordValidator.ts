// Define the input properties expected by the validator hook
export interface PasswordValidatorProps {
  passwd?: string;
}

// Define the precise return layout structure contract
export interface PasswordValidatorResult {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
}

export const usePasswordValidator = ({ 
  passwd = "" 
}: PasswordValidatorProps = {}): PasswordValidatorResult => {
  const hasNumber: boolean = /\d/.test(passwd);
  const hasUppercase: boolean = /[A-Z]/.test(passwd);
  const hasSpecialChar: boolean = /[^A-Za-z0-9]/.test(passwd);

  return { hasNumber, hasUppercase, hasSpecialChar };
};