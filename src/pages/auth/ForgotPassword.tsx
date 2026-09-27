import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../../schemas/auth.schema";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

interface AxiosErrorResponse {
  response?: {
    data?: string;
  };
  message?: string;
}

export const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Custom hook authentication signature modeling
  const { requestPasswordReset } = useAuth() as {
    requestPasswordReset: (email: string) => Promise<unknown> | void;
  };

  // Bind the explicit inferred Zod validation schema interface definition to useForm
  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      setLoading(true);
      await requestPasswordReset(data.email);
      toast.success("Password reset link sent to your email");
      navigate("/auth/reset-password", { replace: true });
    } catch (err) {
      const caughtError = err as AxiosErrorResponse;
      toast.error(caughtError?.response?.data || caughtError?.message || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Forgot Password?
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 text-white rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <Link
            to="/auth/login"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};