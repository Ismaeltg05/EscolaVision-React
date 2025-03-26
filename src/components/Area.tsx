/**
 * @file Area.tsx
 * @description Componente que muestra el área de la aplicación.
 * @author Adrian Ruiz Sanchez
 */

import React, { useEffect, useState } from 'react';
import { Plus, Trash, Save } from "lucide-react";

const Area: React.FC = () => {
  // Estado para almacenar las áreas y la paginación
  const [areas, setAreas] = useState<{ id: number; nombre: string; descripción: string; logo: string; }[]>([]);
  const [pagina, setPagina] = useState(0);

  // Estado para manejar los datos del área seleccionada
  const [idArea, setIdArea] = useState('');
  const [nameArea, setNameArea] = useState('');
  const [descriptionArea, setDescriptionArea] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Configuración de la paginación
  const areasPorPagina = 6;
  const apiUrl = '/crud/leer.php?tabla=areas';

  // Funciones para manejar la paginación
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

  // Función para obtener las áreas desde la API
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

  // Función para manejar el clic en un área
  const handleAreaClick = (area: { id: number; nombre: string; descripción: string; logo: string }) => {
    setIdArea(String(area.id));
    setNameArea(area.nombre);
    setDescriptionArea(area.descripción);
    setImageUrl(area.logo);
  };

  // Función para resetear los datos del área
  const handleNuevoClick = () => {
    setIdArea('');
    setNameArea('');
    setDescriptionArea('');
    setImageUrl('');
  };

  // Función para guardar o actualizar un área
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

  // Función para eliminar un área
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

  // Cargar las áreas cuando el componente se monta
  useEffect(() => {
    fetchAreas();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl flex flex-col gap-6 h-full">
        <h2 className="text-3xl font-bold text-center">Gestión de Area</h2>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Parte izquierda: Lista de áreas */}
          <div className="w-full lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-inner overflow-auto">
            <h3 className="font-semibold text-lg mb-2">Áreas guardadas</h3>
            <ul className="space-y-2">
              {areas
                .slice(pagina * areasPorPagina, (pagina + 1) * areasPorPagina)
                .map((area, index) => (
                  <li
                    key={index}
                    onClick={() => handleAreaClick(area)}
                    className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-blue-100"
                  >
                    {`Área ${area.id} - ${area.nombre}`}
                  </li>
                ))}
            </ul>

            {/* Paginación */}
            <nav className="flex justify-center items-center space-x-3 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={pagina === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                ←
              </button>
              <span>Página {pagina + 1} de {Math.ceil(areas.length / areasPorPagina)}</span>
              <button
                onClick={handleNextPage}
                disabled={(pagina + 1) * areasPorPagina >= areas.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                →
              </button>
            </nav>
          </div>

          {/* Parte derecha: Detalles del área */}
          <div className="w-full lg:w-3/5 bg-gray-50 p-6 rounded-xl shadow-inner flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Datos del Área</h3>
            <div className="space-y-4 flex-grow">
              <label className="text-sm">ID</label>
              <input type="text" className="border p-3 w-full rounded-lg" value={idArea} disabled />

              <label className="text-sm">Nombre</label>
              <input type="text" className="border p-3 w-full rounded-lg" value={nameArea} onChange={(e) => setNameArea(e.target.value)} placeholder="Introduce el nombre del área..." />

              <label className="text-sm">Descripción</label>
              <textarea className="border p-3 w-full rounded-lg h-32" placeholder="Introduce la descripción..." value={descriptionArea} onChange={(e) => setDescriptionArea(e.target.value)} />

              <label className="text-sm">Logo</label>
              <div className="w-full h-36 border border-dashed border-gray-300 flex justify-center items-center rounded-lg">
                {imageUrl ? (
                  <img src={`data:image/png;base64,${imageUrl}`} alt="Foto del área" className="max-h-full max-w-full rounded-lg" />
                ) : (
                  <span>No hay imagen</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Botones para gestionar la pregunta */}
      <div className="flex flex-nowrap justify-center gap-4 mt-4 px-6 pb-6 w-full max-w-lg">
        <button
          onClick={handleNuevoClick}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2"
        >
          <Plus size={20} /> Nuevo
        </button>

        <button
          onClick={handleEliminarClick}
          disabled={!idArea}
          className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 disabled:opacity-50"
        >
          <Trash size={20} /> Eliminar
        </button>

        <button
          onClick={handleGuardarClick}
          className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2"
        >
          <Save size={20} /> Guardar
        </button>
      </div>
    </div>
  );
};

export default Area;