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

  const handleLoginSuccess = (usuario: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('idusuario');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} onBackClick={() => {}} />} />
        <Route path="/menu" element={isLoggedIn ? <Menu onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} onBackClick={() => {}} />} />
      </Routes>
    </Router>
  );
}

export default App;