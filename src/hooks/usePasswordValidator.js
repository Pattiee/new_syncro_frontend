import React from 'react'

export const usePasswordValidator = ({ passwd = "" }) => {
  const hasNumber = /\d/.test(passwd);
  const hasUppercase = /[A-Z]/.test(passwd);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwd);

  return { hasNumber, hasUppercase, hasSpecialChar };
}
