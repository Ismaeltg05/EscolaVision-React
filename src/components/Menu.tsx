import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pregunta from "./Pregunta";
import Test from "./Test";
import Usuario from "./Usuario";
import Area from "./Area";
import Intento from "./Intento";
import { motion } from "framer-motion";

interface MenuProps {
  onLogout: () => void;
}

const Menu = ({ onLogout }: MenuProps) => {
  const [active, setActive] = useState<string | null>("usuarios");
  const [panelTitle, setPanelTitle] = useState<string>("Panel");
  const [menuItems, setMenuItems] = useState<string[]>(["usuarios", "intentos"]);
  const navigate = useNavigate();
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const isOrientador = localStorage.getItem("isOrientador");

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idusuario");
    if (!storedIdUsuario) {
      navigate("/login");
      return;
    }

    if (tipoUsuario === "Alumno") {
      setPanelTitle("Panel de Alumno");
      setMenuItems(["usuarios", "intentos"]); // Aseguramos que el array sea el correcto
    } else if (tipoUsuario === "Profesor" && isOrientador === "0") {
      setPanelTitle("Panel de Profesorado");
      setMenuItems(["usuarios", "intentos"]);
    } else if (isOrientador === "1") {
      setPanelTitle("Panel de Orientación");
      setMenuItems(["tests", "preguntas", "usuarios", "áreas", "intentos"]);
      setActive("tests");
    }
  }, [navigate, tipoUsuario, isOrientador]);

  const handleLogout = () => {
    onLogout();
    navigate("/EscolaVision-React/");
  };

  const handleClick = (item: string) => {
    setActive(item);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <nav className="bg-[#4A90E2] text-white p-4 fixed top-0 left-0 w-full z-10 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          {panelTitle} | {localStorage.getItem("nombre")} |
        </h1>
        <ul className="flex justify-center space-x-6 mt-4">
          {menuItems.map((item) => (
            <li key={item}>
              <motion.button
                onClick={() => handleClick(item)}
                className={`px-6 py-3 rounded-lg transition-all font-semibold text-lg ${
                  active === item
                    ? "bg-white text-[#4A90E2] shadow-md"
                    : "hover:bg-indigo-800 hover:text-white"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.button>
            </li>
          ))}
          <li>
            <motion.button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold transition-all text-lg"
              whileTap={{ scale: 0.95 }}
            >
              Cerrar sesión
            </motion.button>
          </li>
        </ul>
      </nav>
      <div className="flex-grow flex justify-center items-center p-6 w-full bg-gray-100 mt-25">
        {active === "tests" && <Test logout={handleLogout} />}
        {active === "preguntas" && <Pregunta />}
        {active === "usuarios" && <Usuario />}
        {active === "áreas" && <Area />}
        {active === "intentos" && <Intento />}
      </div>
    </div>
  );
};

export default Menu;
