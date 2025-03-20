import { useState } from "react";
import Pregunta from "./Pregunta";
import Test from "./Test";
import Usuario from "./Usuario";
import Area from "./Area";
import Intento from "./Intento";
import './styles/menu.css';

const Menu = () => {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (item: string) => {
    setActive(item);
  };

  return (
    <>
      <nav className="menu-nav">
        <ul className="menu-list">
          {["test", "pregunta", "usuario", "area", "intento"].map((item) => (
            <li key={item} className="menu-item">
              <a
                href={`#${item}`}
                onClick={() => handleClick(item)}
                className={`menu-link ${active === item ? "active" : ""}`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="content-container">
        {active === "test" && <div className="content"><Test/></div>}
        {active === "pregunta" && <div className="content"><Pregunta/></div>}
        {active === "usuario" && <div className="content"><Usuario/></div>}
        {active === "area" && <div className="content"><Area/></div>}
        {active === "intento" && <div className="content"><Intento/></div>}
      </div>
    </>
  );
};

export default Menu;