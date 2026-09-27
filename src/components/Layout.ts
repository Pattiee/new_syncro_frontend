import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Reuse your existing structural interface template defined in your auth context layer
export interface LayoutUserProfile {
  id?: string;
  email?: string;
  username?: string;
  roles?: string[];
  [key: string]: unknown;
}

export const Layout: React.FC = () => {
  // Destructure the actual user entity from your custom hook context container mapping
  const { user } = useAuth() as {
    user: LayoutUserProfile | null;
    loading: boolean;
  };

  const [, setShowHeader] = useState<boolean>(false);

  useEffect(() => {
    // Evaluates accurately against the nested state profile instead of the hook payload container
    if (user) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  }, [user]);

  return (
    <main className="App min-h-screen bg-transparent">
      {/* Optional place slot configuration wrapper for your navbar here using showHeader */}
      <Outlet />
    </main>
  );
};

export default Layout;
