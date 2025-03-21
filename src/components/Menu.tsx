import { useState } from "react";

const Menu = () => {
  const [active, setActive] = useState<string | null>(null);

  // Definir la función handleClick
  const handleClick = (item: string) => {
    setActive(item);
  };

  return (
    <>
      <nav className="bg-[#AED6F1] p-4 w-full">
        <ul className="flex w-full">
          {["test", "pregunta", "usuario", "Area", "intento"].map((item) => (
            <li key={item} className="text-center mr-1">
              <a
                href={`#${item}`}
                onClick={() => handleClick(item)}
                className={`py-2 px-4 border border-black ${
                  active === item
                    ? "bg-[#357ABD] text-white rounded-t border-b-0"
                    : "bg-[#4A90E2] text-white hover:bg-[#357ABD] rounded"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        {active === "test" && <div className="bg-[#AED6F1] p-4 rounded-b">Contenido de Test</div>}
        {active === "pregunta" && <div className="bg-[#AED6F1] p-4 rounded-b">Contenido de Pregunta</div>}
        {active === "usuario" && <div className="bg-[#AED6F1] p-4 rounded-b">Contenido de Usuario</div>}
        {active === "area" && <div className="bg-[#AED6F1] p-4 rounded-b">Contenido de Area</div>}
        {active === "intento" && <div className="bg-[#AED6F1] p-4 rounded-b">Contenido de Intento</div>}
      </div>
    </>
  );
};

export default Menu;