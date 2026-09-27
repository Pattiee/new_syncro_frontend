import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, verifyRegistration } from '../../services/auth.service';
import Password from '../../components/auth/Password';

import toast from 'react-hot-toast';
import Email from '../../components/auth/Email';
import { OneCharacterInput } from '../../components/auth/OneCharacterInput';
import { ChevronRight } from 'lucide-react';
import { usePasswordValidator } from '../../hooks/usePasswordValidator';

interface AuthPageProps {
  title?: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: string;
  };
  message?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ title }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  
  const { hasNumber, hasUppercase, hasSpecialChar } = usePasswordValidator({ passwd: password }) as {
    hasNumber: boolean;
    hasUppercase: boolean;
    hasSpecialChar: boolean;
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({ username, password });
        toast.success(res?.data || "Logged in successfully!");
        navigate('/');
      } else if (!isLogin && showOtpInput) { 
        // Fixed array serialization mismatch by sending a combined text code
        const otpBody = {
          otp: otp.join(''),
        };

        const res = await verifyRegistration(otpBody);
        if (res?.data) {
          toast.success(res.data);
          setShowOtpInput(false);
          navigate("/", { replace: true });
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords must match.");
        }
        const res = await register({ username, password });
        if (res?.data) {
          setShowOtpInput(true);
          toast.success(res.data || "OTP sent via email.");
        }
      }
    } catch (err) {
      const caughtError = err as AxiosErrorResponse;
      const parsedMessage = caughtError?.response?.data || caughtError.message || "Something went wrong";
      toast.error(parsedMessage);
      setErrorMessage(parsedMessage);
    } finally {
      setLoading(false);
    }
  };

  const validationInfo = (
    <div className="flex flex-col mt-2 text-sm">
      <span className={`px-2 font-semibold ${password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
        At least 8 characters
      </span>
      <span className={`px-2 font-semibold ${hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
        Special character
      </span>
      <span className={`px-2 font-semibold ${hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
        Uppercase letter
      </span>
      <span className={`px-2 font-semibold ${hasNumber ? 'text-green-600' : 'text-red-600'}`}>
        Include a number
      </span>
    </div>
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => setConfirmPassword(e.target.value);

  const handleUpdateHasAccount = (): void => {
    setIsLogin(!isLogin);
    setStep(1);
    setPassword('');
    setConfirmPassword('');
    setShowOtpInput(false);
    setOtp(Array(6).fill(''));
  };

  const handleUpdateUsername = (e: React.ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);

  const handleOtpChange = (index: number = 0) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const goodValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = goodValue;
    setOtp(newOtp);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (step === 1) {
      if (!username) {
        toast.error("Please enter your email.");
        return;
      }
      setStep(2);
    } else {
      await handleSubmit(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
      <div className='w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl'>

        <div className='mb-4 rounded-full'>
          <h2 className='flex items-center justify-center px-4 py-2 text-xl font-semibold text-gray-900 rounded-full dark:text-white'>
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>
        </div>

        {step === 2 && (<p className='flex justify-center mx-auto my-2 font-bold text-green-600 dark:text-green-500'>{username}</p>)}
        
        <form className='space-y-4' onSubmit={handleFormSubmit}>
          {/* Email Field (Step 1) */}
          {step === 1 && (
            <Email
              value={username}
              onChange={handleUpdateUsername} />
          )}

          {/* (Step 2) */}
          {step === 2 && !showOtpInput && (
            <Password
              name='Password'
              onChange={handlePasswordChange}
              passwordValue={password} />
          )}

          {password && !isLogin && !showOtpInput && validationInfo}

          {/* Registration Flow (Step 2) */}
          {!isLogin && step === 2 && !showOtpInput && (
            <Password
              disabled={!password}
              name='Confirm Password'
              type='password'
              placeholder='Confirm Password'
              confirmingPassword={true}
              passwordMatching={confirmPassword === password}
              onChange={handleConfirmPasswordChange}
              errMessage={confirmPassword === password ? 'Matching' : 'Passwords must match.'}
              passwordValue={confirmPassword} />
          )}

          {step === 2 && !isLogin && showOtpInput && (
            <div className="flex flex-col justify-between w-full mt-4">
              <p className='py-2 text-gray-400 text-sm font-medium'>OTP Code</p>
              <ul className='flex flex-row w-full'>
                {otp.map((value, index) => (
                  <li key={index} className='flex items-center justify-center w-full mx-1'>
                    <OneCharacterInput
                      value={value}
                      disabled={false}
                      onChange={handleOtpChange(index)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <button type='submit' disabled={loading} className='w-full py-2 text-white transition bg-orange-500 rounded-md dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50 font-medium flex justify-center items-center h-10'>
            {loading ? (
              <div className='w-5 h-5 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin'></div>
            ) : step === 1 ? (
              <span className='flex items-center gap-1 justify-center'>Next <ChevronRight size={16}/></span>
            ) : isLogin ? (
              "Login"
            ) : (
              showOtpInput ? "Verify account" : "Register"
            )}
          </button>
        </form>
        

        <div className='flex items-center justify-between mt-6 border-t border-gray-100 dark:border-gray-700 pt-4'>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type='button'
              onClick={handleUpdateHasAccount}
              className='font-semibold text-orange-500 dark:text-orange-400 hover:underline'
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </span>

          <span className='text-sm text-gray-600 dark:text-gray-400'>
            <button type='button' className='hover:underline text-gray-500 dark:text-gray-400'>Forgot password?</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;