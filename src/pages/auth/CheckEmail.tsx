import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateEmailSchema, ValidateEmailFormData } from "../../schemas/auth.schema";
import { useAuth } from "../../hooks/useAuth";

interface CheckEmailProps {
  title?: string;
}

export const CheckEmail: React.FC<CheckEmailProps> = ({ title }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // Custom hook authentication signature modeling
  const { checkEmailRegistration } = useAuth() as {
    checkEmailRegistration: (payload: ValidateEmailFormData) => Promise<void> | void;
    loading: boolean;
  };

  // Bound the explicit inferred Zod FormData interface to useForm config
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ValidateEmailFormData>({
    resolver: zodResolver(validateEmailSchema),
    defaultValues: { username: "" },
  });

  const username = watch("username");

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [pathname, title]);

  const onSubmit: SubmitHandler<ValidateEmailFormData> = async (data) => {
    await checkEmailRegistration(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Create an Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              {...register("username")}
              placeholder="Enter email address"
              maxLength={70}
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 
                focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors.username
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white transition bg-orange-500 rounded-md dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50"
          >
            {isSubmitting ? "Checking..." : "Next"}
          </button>
        </form>

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-between mt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
          >
            Already have an account? Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/auth/reset-passwd")}
            className="mt-3 text-sm text-gray-700 dark:text-gray-300 hover:underline sm:mt-0"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};