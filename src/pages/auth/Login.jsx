import { useEffect, useState } from "react";
import { checkEmailExists, login, validatePassword } from "../../services/auth.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SSO_Login } from "./SSO_Login";
import { useLocation } from "react-router-dom";

export const Login = ({ title }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();
  const { user, loading, setAuthenticated } = useAuth();
  const location = useLocation();




  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    } else {
      if (title) document.title = title;
    }

  }, [loading, navigate, user, location, title]);

  const handleValidateEmail = async (e) => {
    e.preventDefault();
    if(!sending) setSending(true);
    const data = {}
    if (email) {
      data.username = email;
    } else {
      return toast.error("Email or username cannot be empty");
    }
    
    await checkEmailExists(data).then(res => {
      if (res.data === true){
        setStep(2)
      } else {
        setEmail("")
        navigate("/auth/register", { replace: true });
      };
    }).catch(err => {
      if(err?.code === "ERR_NETWORK"){
        toast.error(err?.message || "Unknown error occured");
        return;
      } else {
        console.error(err);
        // toast.error(err)
      }
    }).finally(() => {
      // setEmail("");
      setSending(false)
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSending(true);
    const data = {}
    data.username = email;
    data.password = password;

    await login(data).then(res => {
      // toast.success(res?.data);
      setAuthenticated(true);
      navigate("/", { replace: true });
    }).catch(err => {
      console.error(err);
    }).finally(() => setSending(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-inter">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
        
        {/* Page Title */}
          <legend className="mb-6 text-3xl font-semibold text-center text-gray-900 dark:text-white tracking-tight">Login</legend>

        <p className="mb-8 text-sm text-center text-gray-500 dark:text-gray-400">
          {/* {step === 1 ? "Enter your email to continue" : "Enter your password to sign in"} */}
        </p>
        {errMessage && (
          <p className="mb-4 text-sm text-center text-red-600">
            {errMessage}
          </p>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form 
            onSubmit={handleValidateEmail} 
            method="post"
            className="space-y-6"
          >
            <div className="flex flex-col">
              <label 
                htmlFor="email" 
                className="block mb-2 px-4 text-sm tracking-wide text-gray-600 dark:text-gray-100"
              >
                Email:
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  aria-describedby="email"
                  type="email"
                  placeholder="e.g, janedoe@example.com"
                  disabled={sending}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 
                        bg-transparent border-b border-gray-300 
                        focus:border-orange-600 focus:outline-none focus:ring-0
                        dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <p
                id="email"
              >
                {/* Errors in validation here */}
              </p>
            </div>
            <button
              type="submit"
              disabled={sending || !email}
              className="w-full py-2 text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:opacity-50"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <form onSubmit={handleLogin} className="space-y-6 animate-slideIn">
            <div className="flex flex-col">
              <label htmlFor="password">
                Password:
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-describedby="password-hint"
                  disabled={sending}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 
                        border-b-2 border-orange-500 
                        focus:border-orange-600 focus:outline-none focus:ring-0
                        dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <p
                id="password-hint"
              >
                {/* Password validation error if any */}
              </p>

              {/* Forgot password */}
              <div className="mt-2 text-sm text-right"    >
                <button className="font-medium px-1 text-orange-500 text-sm hover:underline dark:text-orange-400">
                  <span>Forgot password?</span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={sending || !password}
              className="w-full py-3 text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 focus:outline-none disabled:opacity-50"
            >
              Sign in
            </button>
          </form>
        )}

        {/* SSO Section */}
        <SSO_Login/>
      </div>
    </div>
  );
};
