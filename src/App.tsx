/**
 * @file App.tsx
 * @description Componente principal de la aplicación.
 * @author Ismael Torres González
 * @coauthor Adrian Ruiz Sánchez
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/Menu';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('idusuario');
  };

  const handleBackClick = () => {
    window.history.back();
  }

  return (
    <Router>
      <Routes>
        <Route path="/EscolaVision-React/" element={<Home />} />
        <Route path="/EscolaVision-React/login" element={<Login onLoginSuccess={handleLoginSuccess} onBackClick={handleBackClick} />} />
        <Route path="/EscolaVision-React/menu" element={isLoggedIn ? <Menu onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} onBackClick={() => {}} />} />
      </Routes>
    </Router>
  );
}

export default App;