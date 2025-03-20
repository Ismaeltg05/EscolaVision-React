import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Login from './components/Login.tsx';
import Menu from './components/Menu.tsx';

function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleBackClick = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 2000); // Mostrar el mensaje de bienvenida durante 2 segundos
  };

  useEffect(() => {
    if (isAuthenticated) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-[#AED6F1] min-h-screen flex flex-col">
      {isAuthenticated && <Menu />}
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        {showWelcome ? (
          <>
            <img src="/escolavision.png" alt="EscolaVision Logo" className="h-64 mx-auto" />
            <h1 className="text-3xl font-bold mt-4">Bienvenido</h1>
          </>
        ) : showLogin ? (
          <Login onBackClick={handleBackClick} onLoginSuccess={handleLoginSuccess} />
        ) : isAuthenticated ? (
          <div></div>
        ) : (
          <App onLoginClick={handleLoginClick} />
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);