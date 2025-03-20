import React, { useState } from 'react';

const Area: React.FC = () => {
  const [idArea, setIdArea] = useState('');
  const [nameArea, setNameArea] = useState('');
  const [descriptionArea, setDescriptionArea] = useState('');
  const [imageUrl] = useState('');

  const handleNuevoClick = () => {
    // Lógica para manejar el clic en el botón Nuevo
  };

  const handleEliminarClick = () => {
    // Lógica para manejar el clic en el botón Eliminar
  };

  const handleGuardarClick = () => {
    // Lógica para manejar el clic en el botón Guardar
  };

  return (
    <div className="tab-content">
      <div className="border-pane">
        <div className="bottom">
          <div className="hbox bottom-right">
            <button className="button" onClick={handleNuevoClick}>
              <span>Nuevo</span>
              <img id="imgClearArea" alt="" />
            </button>
            <button className="button" onClick={handleEliminarClick}>
              <span>Eliminar</span>
              <img id="imgDelArea" alt="" />
            </button>
            <button className="button" onClick={handleGuardarClick}>
              <span>Guardar</span>
              <img id="imgSaveArea" alt="" />
            </button>
          </div>
        </div>
        <div className="center">
          <div className="vbox center-content">
            <div className="hbox">
              <label className="bold-label">Datos del área</label>
            </div>
            <div className="hbox hbox-grow">
              <div className="vbox">
                <label>Id</label>
                <label className="margin-top">Nombre</label>
              </div>
              <div className="vbox">
                <input
                  type="text"
                  className="text-input"
                  value={idArea}
                  onChange={(e) => setIdArea(e.target.value)}
                  disabled
                />
                <input
                  type="text"
                  className="text-input"
                  value={nameArea}
                  onChange={(e) => setNameArea(e.target.value)}
                  placeholder="Introduce el nombre..."
                />
              </div>
              <div className="vbox center-image">
                <div className="hbox">
                  <label className="bold-label">Logo</label>
                </div>
                <div className="hbox image-wrapper">
                  <img id="imgViewPicArea" src={imageUrl} alt="Logo del área" />
                </div>
              </div>
            </div>
            <div className="hbox description-section">
              <label className="bold-label">Descripción</label>
              <textarea
                className="text-area"
                value={descriptionArea}
                onChange={(e) => setDescriptionArea(e.target.value)}
                placeholder="Introduce la descripción..."
                wrap="true"
              />
            </div>
          </div>
        </div>
        <div className="left">
          <div className="vbox left-content">
            <label className="bold-label">Áreas guardadas:</label>
            <ul className="list-view">
              {/* Aquí irían los elementos de la lista */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Area;