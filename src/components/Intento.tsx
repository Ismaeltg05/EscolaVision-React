/**
 * @file Area.tsx
 * @description Componente que muestra los intentos realizados por los usuarios existentes en la app.
 * @author Adrian Ruiz Sanchez
 */

import React, { useEffect, useState } from 'react';

const Intentos: React.FC = () => {
  const [intentos, setIntentos] = useState<{ id: number; fecha: string; hora: string; resultados: string; idusuario: number }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idIntento, setIdIntento] = useState('');
  const [fechaIntento, setFechaIntento] = useState('');
  const [horaIntento, setHoraIntento] = useState('');
  const [resultadosIntento, setResultadosIntento] = useState('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);  // Lo inicializamos como null

  const intentosPorPagina = 7;

  useEffect(() => {
    // Intentamos obtener el idusuario del localStorage al cargar la página
    const storedIdUsuario = localStorage.getItem('idusuario');
    if (storedIdUsuario) {
      setUsuarioId(Number(storedIdUsuario));  // Si existe, lo seteamos
    }

    const fetchIntentos = async () => {
      try {
        const response = await fetch('https://servidor.ieshlanz.es:8000/crud/leer.php?tabla=intentos');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setIntentos(data.intentos);
      } catch (error) {
        console.error('Error fetching intentos:', error);
      }
    };

    fetchIntentos();
  }, []);

  const handleIntentoClick = (intento: { id: number; fecha: string; hora: string; resultados: string }) => {
    setIdIntento(String(intento.id));
    setFechaIntento(intento.fecha);
    setHoraIntento(intento.hora);
    setResultadosIntento(intento.resultados);
  };

  return (
    <div className="tab-content">
      <div className="border-pane">
        <div className="main-content">
          <div className="left">
            <div className="vbox left-content">
              <label className="bold-label">Intentos realizados:</label>
              <ul className="list-view">
                {intentos
                  .filter((intento) => intento.idusuario === usuarioId) // Filtramos por el id del usuario
                  .slice(pagina * intentosPorPagina, (pagina + 1) * intentosPorPagina)
                  .map((intento, index) => (
                    <li key={index} onClick={() => handleIntentoClick(intento)} className="clickable-item">
                      {`Intento ${intento.id} - ${intento.fecha} a las ${intento.hora}`}
                    </li>
                  ))}
              </ul>

              {/* Paginación */}
              <nav className="pagination">
                <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 0}>
                  ←
                </button>
                <span>
                  Página {pagina + 1} de {Math.ceil(intentos.filter((intento) => intento.idusuario === usuarioId).length / intentosPorPagina)}
                </span>
                <button
                  onClick={() => setPagina(pagina + 1)}
                  disabled={(pagina + 1) * intentosPorPagina >= intentos.filter((intento) => intento.idusuario === usuarioId).length}
                >
                  →
                </button>
              </nav>
            </div>
          </div>

          <div className="right">
            <div className="vbox right-content">
              <label className="bold-label">Detalles del intento</label>

              <div className="grid-container">
                <div className="grid-item">
                  <label>Id</label>
                  <input type="text" className="text-input" value={idIntento} disabled />
                </div>
                <div className="grid-item">
                  <label>Fecha</label>
                  <input type="text" className="text-input" value={fechaIntento} disabled />
                </div>
                <div className="grid-item">
                  <label>Hora</label>
                  <input type="text" className="text-input" value={horaIntento} disabled />
                </div>
                <div className="grid-item">
                  <label>Resultados</label>
                  <textarea className="text-input" value={resultadosIntento} disabled />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="hbox bottom-right">
            <button className="button">
              <span>Nuevo</span>
              <img id="imgClearIntento" alt="" />
            </button>
            <button className="button">
              <span>Eliminar</span>
              <img id="imgDelIntento" alt="" />
            </button>
            <button className="button">
              <span>Guardar</span>
              <img id="imgSaveIntento" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intentos;
