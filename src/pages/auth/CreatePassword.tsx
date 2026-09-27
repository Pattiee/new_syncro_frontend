import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createPassword } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Validator from "../../helpers/Validator";
import { EyeOffIcon, EyeIcon } from "lucide-react";

interface CreatePasswordProps {
  title?: string;
}

export const CreatePassword: React.FC<CreatePasswordProps> = ({ title }) => {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwdValid, setPasswdValid] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fixed React side-effect anti-pattern by wrapping title updates in useEffect
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    if (password && Validator.isPasswordValid(password)) {
      setPasswdValid(true);
    } else {
      setPasswdValid(false);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Explicitly typed body object to prevent implicit 'any' flags
    const body: Record<string, string> = {
      password: password,
    };

    setLoading(true);
    await createPassword(body)
      .then((res) => {
        console.log(res);
        if (res?.data) {
          toast.success(res.data);
          setPassword("");
          setConfirm("");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data || "Failed to create password");
      })
      .finally(() => setLoading(false));
  };

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
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>

            <div className="relative flex">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full pr-10 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none px-4 py-2 border border-gray-300 rounded-lg"
                required
              />

              {/* Show or hide password */}
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="flex absolute inset-y-0 right-0 items-center px-3 text-gray-500"
              >
                {show ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              disabled={!password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
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
            <label
              htmlFor="showPassword"
              className="text-sm text-gray-600 dark:text-gray-300"
            >
              Show passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || password !== confirm}
            className="w-full bg-orange-600 disabled:bg-orange-300 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Create Password
          </button>
        </form>
      </div>
    </div>
  );
};