import React, { useEffect, useState } from 'react'
import { verifyRegistration } from '../../services/auth.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // onChange={(e) => setOtp(e.target.value.split('').slice(0, 6))}
    // const [otp, setOtp] = useState(Array(6).fill(''));

    useEffect(() => {
        document.title = "Verify Email - Syncro";
        setError('')
    }, [otp]);    

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        // Handle OTP verification logic here
        try {
            if (!loading) setLoading(true);
            // const otpData = { otp: otp.join('') };

            console.log(otp)

            const response = await verifyRegistration(otp);
            if (response.data === true) {
                toast.success(response?.data || 'Email verified successfully');
                navigate("/create-password", { replace: true });
            }            
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError(error?.response?.data || error?.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We've sent a 6-digit code to your email. Enter it below to verify your account.
        </p>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Verify Email
          </button>
        </form>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Didn’t get the code? <button className="text-orange-600 dark:text-orange-400 hover:underline">Resend OTP</button>
        </p>
      </div>
    </div>
  )
}

