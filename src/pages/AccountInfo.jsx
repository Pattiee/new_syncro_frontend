import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { logoutBackendApi } from '../services/auth.service';

const AccountInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutBackendApi(); // API call to logout
      dispatch(logout()); // Clear Redux state
      localStorage.removeItem('authState'); // ❌ Clear persisted user
      navigate('/auth'); // Redirect to auth page
    } catch (err) {
      console.error(err?.message);
    }
  };


  return (
    <div>
      <p>Account info</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  )
}

export default AccountInfo
