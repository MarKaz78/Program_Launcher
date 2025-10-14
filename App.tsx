import React, { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderRoute = () => {
    switch (route) {
      case '#/login':
        return <LoginPage />;
      case '#/admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return <>{renderRoute()}</>;
};

export default App;
