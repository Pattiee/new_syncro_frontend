import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfExistEmail, login, register } from '../services/auth.service';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../slices/authSlice';

import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [firstname, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [existsEmail, setExistsEmail] = useState(false);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();



  const handleValidateEmail = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { data } = await checkIfExistEmail({ email: username });

      if (isLogin) {
        if (data === true) {
          setExistsEmail(true);
          setStep(2);
        } else {
          toast.error("Email not found.");
          setExistsEmail(false);
        }
      } else {
        if (data === true) {
          toast.error("Email already registered. You may consider resetting your password.");
          setExistsEmail(true);
        } else {
          setExistsEmail(false);
          setStep(2);
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e) => {
    setErrorMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ username, password }).then((res) => {
          toast.success("Login success");
          dispatch(checkAuth());
          navigate('/');
        }).catch((loginErr) => {
          console.log(loginErr?.message);
          toast.error(loginErr?.message ?? "Something went wrong.");
          setErrorMessage(loginErr?.message ?? "Login failed");
        });
      } else {
        await register({ firstname, username, password }).then((res) => {
          toast.success("Account created successfully");
          console.log("Account created successfully: ", res.data);
          navigate('/login');
        }).catch((registrationErr) => {
          toast.error(registrationErr?.message ?? "Something went wrong.");
          setErrorMessage(registrationErr?.message ?? "Registration failed");
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8'>

        <div className='mb-4 rounded-full'>
          <h2 className='flex text-xl rounded-full px-4 items-center justify-center py-2 text-gray-900 dark:text-white'>
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>
        </div>

        {isLogin && step === 2 && (<p className='text-gray-600 dark:text-gray-500 flex mx-auto my-2 justify-center' >{ username }</p>)}

        {errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}

        <form className='space-y-4' onSubmit={step === 1 ? handleValidateEmail : handleSubmit}>
          {/* Email Field (Step 1) */}
          {step === 1 && (
            <input
              type='email'
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white autofill:bg-white autofill:text-black border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400'
              autoComplete='username'
            />
          )}

          {/* Login Flow (Step 2) */}
          {isLogin && step === 2 && (
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white autofill:bg-white autofill:text-black border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400'
              autoComplete='current-password'
            />
          )}

          {/* Registration Flow (Step 2) */}
          {!isLogin && step === 2 && (
            <>
              <input
                type='text'
                placeholder='First Name'
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className='w-full px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white autofill:bg-white autofill:text-black border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
              <input
                type='password'
                placeholder='Create Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white autofill:bg-white autofill:text-black border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
              <input
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='w-full px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white autofill:bg-white autofill:text-black border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </>
          )}

          {/* Submit Button */}
          <button type='submit' disabled={loading} className='w-full bg-orange-500 dark:bg-orange-600 text-white py-2 rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition disabled:opacity-50'>
            {loading ? (
              <div className='flex mx-auto border-4 border-t-4 border-orange-500 border-solid w-6 h-6 rounded-full animate-spin'></div>
            ) : step === 1 ? (
              "Next >>>"
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>


        <p className='text-center text-sm mt-4 text-gray-700 dark:text-gray-300'>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setStep(1);
              setExistsEmail(false);
              setErrorMessage('');
            }}
            className='text-orange-500 dark:text-orange-400 hover:underline font-medium'
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
