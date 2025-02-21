import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Login from './components/Login.tsx';
import Menu from './components/Menu.tsx';

function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleBackClick = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  return (
    <div className="bg-[#AED6F1] min-h-screen flex flex-col">
      {isAuthenticated && <Menu />}
      <div className="flex-grow flex justify-center items-center">
        {isAuthenticated ? (
          <div className="text-center">
            <img src="/src/assets/escolavision.png" alt="EscolaVision Logo" className="h-64 mx-auto" />
            <h1 className="text-3xl font-bold mt-4">Bienvenido</h1>
          </div>
        ) : showLogin ? (
          <Login onBackClick={handleBackClick} onLoginSuccess={handleLoginSuccess} />
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