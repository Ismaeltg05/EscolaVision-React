/**
 * @file Menu.tsx
 * @description Componente que muestra el menú de la aplicación.
 * @author Adrian Ruiz Sanchez, Ismael Torres González
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pregunta from "./Pregunta";
import Test from "./Test";
import Usuario from "./Usuario";
import Area from "./Area";
import Intento from "./Intento";
import './styles/menu.css';

interface MenuProps {
  onLogout: () => void;
}

const Menu = ({ onLogout }: MenuProps) => {
  const [active, setActive] = useState<string | null>("test");
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem('idusuario');
    if (!storedIdUsuario) {
      navigate('/login');
      return;
    }
    setUsuarioId(Number(storedIdUsuario));
  }, [navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleClick = (item: string) => {
    setActive(item);
  };

  return (
    <>
      <nav className="menu-nav">
        <ul className="menu-list">
          {["test", "pregunta", "usuario", "area", "intento"].map((item) => (
            <li key={item} className="menu-item">
              <button
                onClick={() => handleClick(item)}
                className={`menu-link ${active === item ? "active" : ""}`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
          <li className="menu-item">
            <button className="logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
      <div className="content-container">
        {active === "test" && <Test logout={handleLogout} />}

        {active === "pregunta" && <Pregunta />}
        {active === "usuario" && <Usuario />}
        {active === "area" && <Area />}
        {active === "intento" && <Intento />}
      </div>
    </>
  );
};

export default Menu;
