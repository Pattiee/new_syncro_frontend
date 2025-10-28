import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfExistEmail, login, register, verifyRegistration } from '../../services/auth.service';
import Password from '../../components/auth/Password';

import toast from 'react-hot-toast';
import Email from '../../components/auth/Email';
import { OneCharacterInput } from '../../components/auth/OneCharacterInput';
import { ChevronRight } from 'lucide-react';
import { usePasswordValidator } from '../../hooks/usePasswordValidator';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { hasNumber, hasUppercase, hasSpecialChar } = usePasswordValidator({ passwd: password });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({ username, password });
        toast.success(res.data);
        navigate('/');
      } else if (!isLogin && showOtpInput) { 
        const otpBody = {
          otp: otp,
        }

        const res = await verifyRegistration(otpBody);
        if (res.data) {
          toast.success(res.data);
          setShowOtpInput(false);
          navigate("/", { replace: true });
        }
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords must match.");
        }
        const res = await register({ username, password });
        if (res.data) {
          setShowOtpInput(true);
          toast.success(res.data || "OTP sent via email.");
        }
        // navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data || err.message || "Something went wrong");
      setErrorMessage(err?.response?.data || err.message || "Something went wrong");
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
  )
  

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleUpdateHasAccount = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setPassword('');
    setConfirmPassword('');
  }

  const handleUpdateUsername = (e) => setUsername(e.target.value);

  const handleOtpChange = (index = 0) => (e) => {
    e.stopPropagation();
    const goodValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = goodValue;
    setOtp(newOtp);
  };


  const handleFormSubmit = async (e) => {
    if (step === 1) {
      // await handleValidateEmail(e);
    } else {
      await handleSubmit(e);
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
      <div className='w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-800 rounded-2xl'>

        <div className='mb-4 rounded-full'>
          <h2 className='flex items-center justify-center px-4 py-2 text-xl font-semibold text-gray-900 rounded-full dark:text-white'>
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>
        </div>

        {step === 2 && (<p className='flex justify-center mx-auto my-2 font-bold text-green-600 dark:text-green-500' >{username}</p>)}
        
        <form className='space-y-4' onSubmit={handleFormSubmit}>
          {/* Email Field (Step 1) */}
          {step === 1 && (
            <Email
              value={username}
              onChange={handleUpdateUsername} />
          )}

          

          {/* (Step 2) */}
          {/* Replace password with otp field after successful registration */}
          {step === 2 && !showOtpInput && (
            <Password
            name='Password'
            onChange={handlePasswordChange}
            passwordValue={password} />
          )}

          { password && !isLogin && !showOtpInput && validationInfo }

          {/* Registration Flow (Step 2) */}
          {!isLogin && step === 2 && !showOtpInput && (
            <>              
              <Password
                disabled={!password}
                name='Confirm Password'
                type='password'
                placeholder='Confirm Password'
                confirmingPassword={true}
                passwordMatching={confirmPassword === password}
                onChange={handleConfirmPasswordChange}
                errMessage={ confirmPassword === password ? 'Matching' : 'Passwords must match.'}
                passwordValue={confirmPassword} />
            </>
          )}

          {step === 2 && !isLogin && showOtpInput && (
            <label className="flex flex-col justify-between w-full mt-4">
              <p className='py-2 text-gray-300'>OTP Code</p>
              <ul className='flex flex-row w-full'>
                {otp.map((value, index) => (
                  <li key={index}
                    className='flex items-center justify-center w-full mx-2'
                  >
                    <OneCharacterInput
                      key={index}
                      value={value}
                      disabled={false}
                      onChange={handleOtpChange(index)}
                    />
                  </li>
                ))}
              </ul>
            </label>
          )}


          {/* Submit Button */}
          <button type='submit' disabled={loading} className='w-full py-2 text-white transition bg-orange-500 rounded-md dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50'>
            {loading ? (
              <div className='flex justify-center w-6 h-6 mx-auto border-4 border-t-4 border-orange-500 border-solid rounded-full animate-spin'></div>
            ) : step === 1 ? (
                <span className='flex justify-center'>Next <ChevronRight/></span>
            ) : isLogin ? (
              "Login"
                ) : (
                    showOtpInput ? "Verify account" : "Register"
            )}
          </button>
        </form>
        

        <div className='flex items-center justify-between'>
          <span className='mt-4 text-sm text-center text-gray-700 dark:text-gray-300'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={handleUpdateHasAccount}
              className='font-medium text-orange-500 dark:text-orange-400 hover:underline disabled:bg-orange-300'
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </span>

          <span className='mt-4 text-sm text-center text-gray-700 dark:text-gray-300'>
            <button>Forgot password?</button>
          </span>
          </div>
      </div>
    </div>
  );
};

export default AuthPage;
