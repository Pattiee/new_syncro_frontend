import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth.service';
import toast from 'react-hot-toast';
import Email from '../../components/auth/Email';
import Password from '../../components/auth/Password';

export const Register = ({ title }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (title) document.title = title;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (password !== confirmPassword) return toast.error("Passwords must match.");
    
    if (!loading) setLoading(true);

    await register({ username }).then(res => {
      navigate("/auth/verify-email", { replace: true });
    }).catch(err => {
      toast.error(err?.response?.data || err?.message || 'Unknown error occured')
    }).finally(() => setLoading(false));
  };


  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

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

  const handleUpdateUsername = (e) => setUsername(e.target.value);

  const handleOtpChange = (index = 0) => (e) => {
    e.stopPropagation();
    const goodValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = goodValue;
    setOtp(newOtp);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className='w-full max-w-md p-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl'>

        <div className='mb-4 rounded-full'>
          <h2 className='flex items-center justify-center px-4 py-2 text-xl font-semibold text-gray-900 rounded-full dark:text-white'>
            {"Create an account"}
          </h2>
        </div>

    
        
        <form className='space-y-4' onSubmit={handleSubmit}>
          {/* Username */}
          <Email onChange={handleUpdateUsername} value={username}/>

          {/* Password */}
          {/* <Password onChange={handlePasswordChange} passwordValue={password}/> */}

          {/* Submit Button */}
          <button type='submit' disabled={loading} className='w-full py-2 text-white transition bg-orange-500 rounded-md dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50'>
            <span>Next</span>
          </button>
        </form>
        

        <div className='flex items-center justify-between'>
          <span className='mt-4 text-sm text-center text-gray-700 dark:text-gray-300'>
            { "Already have an account?"}
            <button
              onClick={() => navigate("/auth/login")}
              className='font-medium text-orange-500 dark:text-orange-400 hover:underline disabled:bg-orange-300'
            >
              Login
            </button>
          </span>

          <span className='mt-4 text-sm text-center text-gray-700 dark:text-gray-300'>
            <button>Forgot password?</button>
          </span>
        </div>
      </div>
    </div>
  )
}
