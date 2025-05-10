import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, logoutBackendApi } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [user, setUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [responseError, setResponseError] = useState(null);

  const loginApiCall = async (userData) => {
    try
    {
        await login(userData)
        .then((resp) => {
          setUser(resp?.data);
          setIsAuthenticated(true);
          navigate(from, { replace: true });
        })
        .catch(err => {
          if (!err?.response) {
            setResponseError(err.message);
          } else if (err?.response?.status === 400) {
            setResponseError('Missing email or password');
          } else if (err?.response?.status === 401) {
            setResponseError('Unauthorized');
          }else{
            setResponseError('Login failed');
          }
        });
    } catch (error)
    {
      setResponseError(error?.message)
      console.error("Error: ", error);
    }
  }

  const logout_user = async () => {
    await logoutBackendApi().then((res) => {
      if (res?.status === 200) {
        return setSuccessMsg(res?.data);
      }
      return setResponseError(res?.data);
    }).catch(err => {
      console.log("ERROR | ", err.message)
    });
    setUser(null);
  }


  const userProfile = () => {

  }


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginApiCall, logout_user, successMsg, responseError }}>
        {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

