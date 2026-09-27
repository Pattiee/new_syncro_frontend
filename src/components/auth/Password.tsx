import React, { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Define the incoming props contract for the password input field component
export interface PasswordProps {
  label?: string;
  passwordValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  confirmingPassword?: boolean;
  passwordMatching?: boolean;
  errMessage?: string;
  errors?: React.ReactNode;
}

export const Password: React.FC<PasswordProps> = ({
  label = "Password",
  passwordValue = "",
  placeholder = "Enter password",
  disabled = false,
  onChange,
  confirmingPassword = false,
  passwordMatching = false,
  errMessage,
  errors,
}) => {
  const passwordHintId = useId();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      {/* Field label */}
      <label
        htmlFor={passwordHintId}
        className="block pb-2 text-gray-600 dark:text-gray-300 text-sm font-medium"
      >
        {label}
      </label>

      {/* Input + toggle icon */}
      <div className="relative">
        <input
          id={passwordHintId}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={passwordValue}
          onChange={onChange}
          disabled={disabled}
          autoComplete="current-password webauthn"
          aria-describedby={passwordHintId}
          required
          inputMode="text"
          minLength={8}
          maxLength={20}
          className={`${
            disabled
              ? "bg-gray-100 dark:bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-white dark:bg-gray-700"
          }
            w-full px-4 py-2 pr-10 text-black border border-gray-300 rounded-md dark:text-white
            dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm transition-colors`}
        />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
        </button>
      </div>

      {errors}

      {/* Helper / error text */}
      {passwordValue && (passwordValue.length < 8 || confirmingPassword) && (
        <p
          className={`${
            confirmingPassword && passwordMatching
              ? "text-green-500"
              : "text-red-500"
          } text-sm mt-1 font-medium`}
        >
          {confirmingPassword ? errMessage : "Password must be at least 8 characters long"}
        </p>
      )}
    </>
  );
};

export default Password;