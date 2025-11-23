import React, { useEffect, useState } from "react";
import { verifyEmail } from "../../services/auth.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const VerifyEmail = ({ title }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (title) document.title = title;
    setError("");
  }, [otp, title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmail(otp);
      if (response.data === true) {
        navigate("/auth/create-passwd", { replace: true });
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err?.response?.data || err?.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We've sent a 6-digit code to your email. Enter it below to verify your
          account.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Didn’t get the code?{" "}
          <button className="text-orange-600 dark:text-orange-400 hover:underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};
