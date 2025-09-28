import { useKeycloak } from '@react-keycloak/web'
import { ChevronRight } from 'lucide-react';
import React, { Suspense } from 'react'
import { Loader } from '../components/Loader';

export const ProfileArticle = () => {
  const { keycloak, initialized } = useKeycloak();

  const handleLogout = async () => keycloak.authenticated && initialized ? keycloak.logout() : keycloak.login();

  return (
    <Suspense fallback={<Loader/>}>
      <div className='flex flex-col'>
        <div className='profile-info'>

        </div>

        {/* Logout button */}
        <button className="logout-button flex font-extralight mx-auto mt-auto px-4 py-2 text-red-600 transition border border-none rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-60 focus:outline-none">
          <span className="logout" onClick={handleLogout}>Logout</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </Suspense>
  )
}
