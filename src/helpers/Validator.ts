/**
 * Evaluates whether a raw password string passes security complexity thresholds.
 * Required: Minimum 8 characters, 1 uppercase letter, 1 number, and 1 special character.
 */
function isPasswordValid(rawPassword: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(rawPassword);
}

/**
 * Evaluates whether a string text matches standard email structural constraints.
 */
function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const Validator = {
  isPasswordValid,
  isEmailValid,
} as const; // 'as const' marks the dictionary object freeze layout as read-only for complete safety

export default Validator;