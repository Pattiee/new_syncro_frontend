import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider, useSelector } from 'react-redux';
import { AuthProvider } from './contexts/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { initApp } from './store';


// ThemeWrapper component
const ThemeWrapper = ({ children }) => {
  const theme = useSelector((state) => state?.theme?.theme);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return children;
}

initApp().then((store) => {
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeWrapper>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ThemeWrapper>
      </Provider>
    </React.StrictMode>
  );
});
