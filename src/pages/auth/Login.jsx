import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth.schema";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { LockIcon, EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";

export const Login = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { loading = false, loginUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data) => await loginUser(data);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Sign In
        </h1>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MailIcon size={20} />
                    </div>
                    <input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      maxLength={50}
                      aria-invalid={errors.username ? "true" : "false"}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors ${
                        errors.username
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 dark:text-white bg-white dark:bg-gray-700`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <LockIcon size={20} />
                    </div>
                    <input
                      {...field}
                      type={visible ? "text" : "password"}
                      placeholder="Enter your password"
                      maxLength={50}
                      aria-invalid={errors.password ? "true" : "false"}
                      className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 dark:text-white bg-white dark:bg-gray-700`}
                    />
                    <button
                      type="button"
                      onClick={() => setVisible((v) => !v)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                      aria-label={visible ? "Hide password" : "Show password"}
                    >
                      {visible ? (
                        <EyeOffIcon size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}

                  <Link
                    className="flex float-end text-gray-800 hover:underline dark:hover:text-orange-500 dark:text-gray-300 text-sm m-2"
                    to={"/auth/reset-passwd"}
                  >
                    Forgot password?
                  </Link>
                </>
              )}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-lg text-white transition ${
              loading
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6 text-sm text-gray-700 dark:text-gray-300">
          <span>Don’t have an account? </span>
          <Link
            to="/auth/check-email"
            className="text-orange-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
