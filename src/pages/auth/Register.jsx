import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { registrationSchema } from "../../schemas/auth.schema";
import { register as registerUser } from "../../services/auth.service";

export const Register = ({ title }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  if (title) document.title = title;

  const onSubmit = async (data) => {
    try {
      await registerUser({ username: data.username });
      navigate("/auth/verify-email", { replace: true });
    } catch (err) {
      toast.error(
        err?.response?.data || err?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Create an Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              {...register("username")}
              placeholder="Enter email address"
              maxLength={70}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          {/* <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                autoComplete="new-password"
                maxLength={50}
                className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div> */}

          {/* Confirm Password */}
          {/* <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm password"
                autoComplete="new-password"
                disabled={!password}
                maxLength={50}
                className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:opacity-60"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
            {password && confirmPassword && password === confirmPassword && (
              <p className="mt-1 text-sm text-green-500">Passwords match</p>
            )}
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white transition bg-orange-500 rounded-md dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50"
          >
            {isSubmitting ? "Checking..." : "Next"}
          </button>
        </form>

        <div className="flex flex-col items-center justify-between mt-6 sm:flex-row">
          <button
            onClick={() => navigate("/auth/login")}
            className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
          >
            Already have an account? Login
          </button>

          <button
            className="mt-3 text-sm text-gray-700 dark:text-gray-300 hover:underline sm:mt-0"
            onClick={() => navigate("/auth/reset-passwd")}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
};
