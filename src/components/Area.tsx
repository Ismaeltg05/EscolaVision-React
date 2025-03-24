/**
 * @file Area.tsx
 * @description Componente que muestra el área de la aplicación.
 * @author Adrian Ruiz Sanchez
 */

import React, { useEffect, useState } from 'react';
import './styles/comun.css';

const Area: React.FC = () => {
  const [areas, setAreas] = useState<{ id: number; nombre: string; descripción: string; logo: string; }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idArea, setIdArea] = useState('');
  const [nameArea, setNameArea] = useState('');
  const [descriptionArea, setDescriptionArea] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const areasPorPagina = 5;
  const apiUrl = 'http://servidor.ieshlanz.es:8000/crud/leer.php?tabla=areas';

  // Paginación
  const handleNextPage = () => {
    if ((pagina + 1) * areasPorPagina < areas.length) {
      setPagina(pagina + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Error al obtener áreas');
      const data = await response.json();
      if (Array.isArray(data.areas)) {
        setAreas(data.areas);
      } else {
        console.error('Datos incorrectos:', data);
        setAreas([]);
      }
    } catch (error) {
      console.error('Error al obtener las áreas:', error);
      setAreas([]);
    }
  };

  const handleAreaClick = (area: { id: number; nombre: string; descripción: string; logo: string }) => {
    setIdArea(String(area.id));
    setNameArea(area.nombre);
    setDescriptionArea(area.descripción);
    setImageUrl(area.logo);
  };

  const handleNuevoClick = () => {
    setIdArea('');
    setNameArea('');
    setDescriptionArea('');
    setImageUrl('');
  };

  const handleGuardarClick = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: idArea ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idArea, nombre: nameArea, descripción: descriptionArea, logo: imageUrl }),
      });

      if (!response.ok) throw new Error('Error al guardar el área');
      fetchAreas();
    } catch (error) {
      console.error('Error al guardar el área:', error);
    }
  };

  const handleEliminarClick = async () => {
    if (!idArea) return;

    try {
      const response = await fetch(`${apiUrl}?id=${idArea}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el área');
      fetchAreas();
      handleNuevoClick();
    } catch (error) {
      console.error('Error al eliminar el área:', error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const indexOfLastArea = (pagina + 1) * areasPorPagina;
  const indexOfFirstArea = indexOfLastArea - areasPorPagina;
  const currentAreas = areas.slice(indexOfFirstArea, indexOfLastArea);

  return (
    <div className="tab-content">
      <div className="border-pane">
        <div className="main-content">
          <div className="left">
            <div className="vbox left-content">
              <label className="bold-label">Áreas guardadas:</label>
              <ul className="list-view">
                {currentAreas.length > 0 ? (
                  currentAreas.map((area) => (
                    <li key={area.id} onClick={() => handleAreaClick(area)} className="clickable-item">
                      {area.nombre}
                    </li>
                  ))
                ) : (
                  <li>No hay áreas disponibles.</li>
                )}
              </ul>
              <nav className="pagination">
                <button onClick={handlePrevPage} disabled={pagina === 0}>←</button>
                <span>Página {pagina + 1} de {Math.ceil(areas.length / areasPorPagina)}</span>
                <button onClick={handleNextPage} disabled={(pagina + 1) * areasPorPagina >= areas.length}>→</button>
              </nav>
            </div>
          </div>

          <div className="right">
            <div className="vbox right-content">
              <label className="bold-label">Datos del área</label>
              <div className="grid-container">
                <div className="grid-item">
                  <label>Id</label>
                  <input type="text" className="text-input" value={idArea} disabled />
                </div>
                <div className="grid-item">
                  <label>Nombre</label>
                  <input type="text" className="text-input" value={nameArea} onChange={(e) => setNameArea(e.target.value)} placeholder="Introduce el nombre del área..." />
                </div>
                <div className="grid-item">
                  <label>Descripción</label>
                  <textarea className="text-area" placeholder="Introduce la descripción..." value={descriptionArea} onChange={(e) => setDescriptionArea(e.target.value)} />
                </div>
                <div className="grid-item">
                  <label>Logo</label>
                  <div className="image-wrapper">
                    {imageUrl ? <img src={`data:image/png;base64,${imageUrl}`} alt="Logo del área" className="user-image" /> : <span>No hay imagen</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="hbox bottom-right">
            <button className="button" onClick={handleNuevoClick}>
              <span>Nuevo</span>
            </button>
            <button className="button" onClick={handleEliminarClick} disabled={!idArea}>
              <span>Eliminar</span>
            </button>
            <button className="button" onClick={handleGuardarClick}>
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Area;
