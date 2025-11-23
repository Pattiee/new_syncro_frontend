// src/components/auth/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schemas/forgotPassword.schema";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleForgotPassword = async (data) => {
    try {
      setLoading(true);
      await requestPasswordReset(data.email);
      toast.success("Password reset link sent to your email");
      navigate("/auth/reset-password", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot Password?
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
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
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <Link
            to="/auth/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
