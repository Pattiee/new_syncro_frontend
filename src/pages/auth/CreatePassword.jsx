import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { createPassword } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Validator from '../../helpers/Validator';

export const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwdValid, setPasswdValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (password && Validator.isPasswordValid(password)) {
      setPasswdValid(true);
    } else {
      setPasswdValid(false);
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return;
    }
    const body = {};
    body.password = password

    if (!loading) setLoading(true);
    await createPassword(body).then(res => {
      if (res.data) {
        toast.success(res.data);
        setPassword('');
        setConfirm('');
        navigate("/", { replace: true });
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors">
      <div className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
          Create Your Password
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Set a strong password to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              disabled={!passwdValid}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border disabled:bg-gray-300 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="flex items-center mb-2">
            <input
              id="showPassword"
              type="checkbox"
              disabled={loading}
              checked={show}
              onChange={() => setShow(!show)}
              className="mr-2 accent-orange-600"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-600 dark:text-gray-300">
              Show passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 disabled:bg-orange-300 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Create Password
          </button>
        </form>
      </div>
    </div>
  )
}
