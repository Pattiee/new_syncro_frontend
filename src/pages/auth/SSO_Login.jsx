import React from 'react'
import { useNavigate } from 'react-router-dom'

export const SSO_Login = () => {
    const navigate = useNavigate();
  return (
    <div className="flex mt-8 w-full flex-col">
          <span className="flex font-light justify-center capitalize">
            Or
          </span>

          <div className="bg-transparent">
            <ul className="flex gap-3 pt-2 justify-center">
              <button className="sso-btn bg-orange-500 rounded-full px-3 py-1 text-sm">
                <span className="font-medium text-lg">G</span>
              </button>
              <button className="sso-btn bg-orange-500 rounded-full px-3 py-1 text-sm">
                <span className="font-medium text-lg">F</span>
              </button>
              <button className="sso-btn bg-orange-500 rounded-full px-3 py-1 text-sm">
                <span className="font-medium text-lg">T</span>
              </button>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="mt-4 text-center">
            <div className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Don't have an account?</span>
              <button 
                onClick={() => navigate("/register")}
                className="font-medium px-1 text-orange-600 hover:underline dark:text-orange-400">
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
    )
}
