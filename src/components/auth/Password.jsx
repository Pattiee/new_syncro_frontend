import React, { Fragment, useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Password = ({
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
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Field label */}
      <label
        htmlFor={passwordHintId}
        className="block pb-2 text-gray-600 dark:text-gray-300"
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
              ? "bg-gray-100 dark:bg-gray-500"
              : "bg-white dark:bg-gray-700"
          }
            w-full px-4 py-2 pr-10 text-black border border-gray-300 rounded-md dark:text-white
            dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400`}
        />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
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
          } text-base`}
        >
          {errors}
        </p>
      )}
    </>
  );
};

export default Password;
