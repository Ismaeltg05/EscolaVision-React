/**
 * @file Area.tsx
 * @description Componente que muestra las preguntas existentes en la app y el test al que pertenecen.
 * @author Adrian Ruiz Sanchez
 */

import React, { useEffect, useState } from "react";

const Pregunta: React.FC = () => {
  const [preguntas, setPreguntas] = useState<{ id: number; titulo: string; enunciado: string; idtest: number }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idQuest, setIdQuest] = useState('');
  const [tituloQuest, setTituloQuest] = useState('');
  const [enunQuest, setEnunQuest] = useState('');
  const [testQuest, setTestQuest] = useState(0);
  const preguntasPorPagina = 7;

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch("http://servidor.ieshlanz.es:8000/crud/leer.php?tabla=preguntas");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPreguntas(data.preguntas); // Guardamos los objetos completos
      } catch (error) {
        console.error("Error fetching preguntas:", error);
      }
    };

    fetchPreguntas();
  }, []);

  const handlePreguntaClick = (pregunta: { id: number; titulo: string; enunciado: string; idtest: number }) => {
    setIdQuest(String(pregunta.id));
    setTituloQuest(pregunta.titulo);
    setEnunQuest(pregunta.enunciado);
    setTestQuest(pregunta.idtest);
  };

  const handleNextPage = () => {
    if ((pagina + 1) * preguntasPorPagina < preguntas.length) {
      setPagina(pagina + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };
  const handleEliminarClick = () => {
    // Lógica para manejar el clic en el botón Eliminar
  };

  const handleGuardarClick = () => {
    // Lógica para manejar el clic en el botón Guardar
  };

  const handleNuevoClick = () => {
    setEnunQuest('');
    setTestQuest(0);
    setIdQuest('');
    setTituloQuest('');
  };

  return (
    <div className="tab-content">
      <div className="border-pane">
        <div className="main-content">
          <div className="left">
            <div className="vbox left-content">
              <label className="bold-label">Preguntas guardadas:</label>
              <ul className="list-view">
                {preguntas
                  .slice(pagina * preguntasPorPagina, (pagina + 1) * preguntasPorPagina)
                  .map((pregunta, index) => (
                    <li key={index} onClick={() => handlePreguntaClick(pregunta)} className="clickable-item">
                      {`Pregunta ${pregunta.id} - Test ${pregunta.idtest}`}
                    </li>
                  ))}
              </ul>

              {/* Paginación */}
              <nav className="pagination">
                <button onClick={handlePrevPage} disabled={pagina === 0}>
                  ←
                </button>
                <span>Página {pagina + 1} de {Math.ceil(preguntas.length / preguntasPorPagina)}</span>
                <button
                  onClick={handleNextPage}
                  disabled={(pagina + 1) * preguntasPorPagina >= preguntas.length}
                >
                  →
                </button>
              </nav>
            </div>
          </div>

          <div className="right">
            <div className="vbox right-content">
              <div className="hbox">
                <label className="bold-label">Datos de la pregunta</label>
              </div>
              <div className="hbox hbox-grow">
                <div className="vbox">
                  <label>Id</label>
                  <label className="margin-top">Título</label>
                  <label className="margin-top-large">Enunciado</label>
                  <label className="margin-top-large">Test</label>
                </div>
                <div className="vbox">
                  <input
                    type="text"
                    className="text-input"
                    value={idQuest}
                    disabled
                  />
                  <input
                    type="text"
                    className="text-input"
                    value={tituloQuest}
                    onChange={(e) => setTituloQuest(e.target.value)}
                    placeholder="Introduce el título de la pregunta..."
                  />
                  <textarea
                    className="text-area"
                    value={enunQuest}
                    onChange={(e) => setEnunQuest(e.target.value)}
                    placeholder="Introduce el enunciado de la pregunta..."
                  />
                  <select
                    className="combo-box"
                    value={testQuest}
                    onChange={(e) => setTestQuest(Number(e.target.value))}
                  >
                    <option value="" disabled>Introduce el test correspondiente a la pregunta...</option>
                    {/* Opciones del ComboBox */} 
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
            <div className="hbox bottom-right">
              <button className="button" onClick={handleNuevoClick}>
                <span>Nuevo</span>
                <img id="imgClearQuest" alt="" />
              </button>
              <button className="button" onClick={handleEliminarClick}>
                <span>Eliminar</span>
                <img id="imgDelQuest" alt="" />
              </button>
              <button className="button" onClick={handleGuardarClick}>
                <span>Guardar</span>
                <img id="imgSaveQuest" alt="" />
              </button>
            </div>
          </div>
      </div>   
    </div>
  );
};

export default Pregunta;
