import React, { useId } from "react";

// Define the incoming props contract for the email input field component
export interface EmailProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  confirmingPassword?: boolean;
  errMessage?: string;
  errors?: React.ReactNode;
}

export const Email: React.FC<EmailProps> = ({
  value = "",
  onChange,
  confirmingPassword = false,
  errMessage,
  errors,
}) => {
  const emailHintId = useId();
  const errorMsgId = useId();

  return (
    <>
      {/* Separated label block for clean HTML semantic standard alignment */}
      <label 
        htmlFor={emailHintId}
        className="block pb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Email address
      </label>
      
      <input
        id={emailHintId}
        type="email"
        placeholder="Enter email address"
        value={value}
        onChange={onChange}
        aria-describedby={errorMsgId}
        required
        inputMode="email"
        maxLength={50}
        minLength={5}
        autoComplete="username"
        className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white autofill:bg-white autofill:text-black dark:border-gray-600 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-colors"
      />

      {/* Helper / error text display block */}
      <p
        id={errorMsgId}
        className={`${confirmingPassword ? "text-gray-500" : "text-red-500"} text-xs mt-1 font-medium`}
      >
        {errors}
        {value && errMessage ? ` ${errMessage}` : ""}
      </p>
    </>
  );
};

export default Email;