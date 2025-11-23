// src/components/auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schemas/auth.schema";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export const ResetPassword = ({ title }) => {
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  const handleResetPassword = async (data) => {
    try {
      setLoading(true);
      await resetPassword({ token, ...data });
      toast.success("Password successfully reset!");
      navigate("/auth/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, placeholder) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type="password"
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
            ${
              errors[name]
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } 
            bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400`}
        />
      )}
    />
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Reset Password
        </h1>

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              New Password
            </label>
            {renderInput("password", "Enter new password")}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            {renderInput("confirmPassword", "Confirm new password")}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 text-white rounded-lg transition 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
