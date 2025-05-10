import React,{ useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const user = useAuth();

  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    user? setShowHeader(true) : setShowHeader(false);
  }, [user]);

  return (
    <main className='App'>
      <Outlet/>
    </main>
  )
}

export default Layout
