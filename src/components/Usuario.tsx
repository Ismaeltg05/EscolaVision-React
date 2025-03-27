/**
 * @file Usuario.tsx
 * @description Componente que muestra los usuarios existentes en la app.
 * @author Adrian Ruiz Sanchez
 */

import React, { useEffect, useState } from 'react';
import { Plus, Trash, Save } from "lucide-react";

const Usuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; email?: string; dni?: string; contraseña?: string; fecha_nacimiento?: string; foto?: string }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idUser, setIdUser] = useState('');
  const [nombreUser, setNombreUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [dniUser, setDniUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [yearUser, setYearUser] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const usuariosPorPagina = 6;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://cors-proxy.escolavisionhlanz.workers.dev/leer.php?tabla=usuarios');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsuarios(data.usuarios);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleUsuarioClick = (usuario: { id: number; nombre: string; email?: string; dni?: string; contraseña?: string; fecha_nacimiento?: string; foto?: string }) => {
    setIdUser(String(usuario.id));
    setNombreUser(usuario.nombre);
    setEmailUser(usuario.email || '');
    setDniUser(usuario.dni || '');
    setPasswordUser(usuario.contraseña || '');
    setYearUser(usuario.fecha_nacimiento || '');
    setImageUrl(usuario.foto ? `data:image/jpeg;base64,${usuario.foto}` : '');
  };

  const handleNuevoClick = () => {
    setIdUser('');
    setNombreUser('');
    setEmailUser('');
    setDniUser('');
    setPasswordUser('');
    setYearUser('');
    setImageUrl('');
  };

  const handleGuardarClick = async () => {
    try {
      // Realizar la operación de guardar
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleEliminarClick = async () => {
    if (!idUser) return;
    try {
      // Realizar la operación de eliminar
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl flex flex-col gap-6 h-[95%]">
        <h2 className="text-3xl font-bold text-center">Gestión de Usuarios</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Parte izquierda: Lista de usuarios */}
          <div className="w-full lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-inner overflow-auto">
            <h3 className="font-semibold text-lg mb-2">Usuarios guardados</h3>
            <ul className="space-y-2">
              {usuarios
                .slice(pagina * usuariosPorPagina, (pagina + 1) * usuariosPorPagina)
                .map((usuario, index) => (
                  <li
                    key={index}
                    onClick={() => handleUsuarioClick(usuario)}
                    className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-blue-100"
                  >
                    {`Usuario ${usuario.id} - ${usuario.nombre}`}
                  </li>
                ))}
            </ul>

            {/* Paginación */}
            <nav className="flex justify-center items-center space-x-3 mt-4">
              <button
                onClick={() => setPagina(pagina - 1)}
                disabled={pagina === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                ←
              </button>
              <span>Página {pagina + 1} de {Math.ceil(usuarios.length / usuariosPorPagina)}</span>
              <button
                onClick={() => setPagina(pagina + 1)}
                disabled={(pagina + 1) * usuariosPorPagina >= usuarios.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                →
              </button>
            </nav>
          </div>

          {/* Parte derecha: Detalles del usuario */}
          <div className="w-full lg:w-3/5 bg-gray-50 p-6 rounded-xl shadow-inner flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Datos del Usuario</h3>
            <div className="space-y-4 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="text-sm">ID</label>
                <input type="text" className="border p-3 w-full rounded-lg" value={idUser} disabled />

                <label className="text-sm">Nombre</label>
                <input
                  type="text"
                  className="border p-3 w-full rounded-lg"
                  value={nombreUser}
                  onChange={(e) => setNombreUser(e.target.value)}
                  placeholder="Introduce el nombre..."
                />

                <label className="text-sm">Email</label>
                <input
                  type="text"
                  className="border p-3 w-full rounded-lg"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  placeholder="Introduce el email..."
                />
              </div>

              <div>
                <label className="text-sm">DNI</label>
                <input
                  type="text"
                  className="border p-3 w-full rounded-lg"
                  value={dniUser}
                  onChange={(e) => setDniUser(e.target.value)}
                  placeholder="Introduce el DNI..."
                />

                <label className="text-sm">Contraseña</label>
                <input
                  type="password"
                  className="border p-3 w-full rounded-lg"
                  value={passwordUser}
                  onChange={(e) => setPasswordUser(e.target.value)}
                  placeholder="Introduce la contraseña..."
                />

                <label className="text-sm">Fecha de nacimiento</label>
                <input
                  type="date"
                  className="border p-3 w-full rounded-lg"
                  value={yearUser}
                  onChange={(e) => setYearUser(e.target.value)}
                  placeholder="Introduce el año..."
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm">Foto</label>
                <div className="w-full h-36 border border-dashed border-gray-300 flex justify-center items-center rounded-lg">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Foto del usuario" className="max-h-full max-w-full rounded-lg" />
                  ) : (
                    <span>No hay imagen</span>
                  )}
                </div>
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
          disabled={!idUser}
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

export default Usuario;
