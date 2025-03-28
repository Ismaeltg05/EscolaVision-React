/**
 * @file Usuario.tsx
 * @description Componente que muestra los usuarios existentes en la app.
 * @author Adrian Ruiz Sanchez
 */

import React, { useEffect, useState } from 'react';
import { Plus, Save, CheckCircle, Trash2 } from "lucide-react";

const Usuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; email?: string; dni?: string; contraseña?: string; fecha_nacimiento?: string; foto?: string, tipo_usuario: string }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idUser, setIdUser] = useState('');
  const [nombreUser, setNombreUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [dniUser, setDniUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [yearUser, setYearUser] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tipoUser, setTipoUser] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const usuariosPorPagina = 6;
  const tipo = localStorage.getItem('tipo');

  const fetchUsuarios = async () => {
    try {
      const id_centro = localStorage.getItem('id_centro');
      const response = await fetch(`https://proxy-vercel-ten.vercel.app/leer.php?tabla=usuarios&id_centro=${id_centro}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (tipo === 'Alumno') {
        const idusuario = localStorage.getItem('idusuario');
        const usuario = data.usuarios.filter((usuario: { id: number; nombre: string; email?: string; dni?: string; contraseña?: string; fecha_nacimiento?: string; foto?: string }) => usuario.id === parseInt(idusuario ? idusuario : '0'));
        setUsuarios(usuario);
        handleUsuarioClick(usuario[0]);
      } else {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    handleNuevoClick();
  }, []);

  const handleUsuarioClick = (usuario: { id: number; nombre: string; email?: string; dni?: string; contraseña?: string; fecha_nacimiento?: string; foto?: string; tipo_usuario: string }) => {
    setIdUser(String(usuario.id));
    setNombreUser(usuario.nombre);
    setEmailUser(usuario.email || '');
    setDniUser(usuario.dni || '');
    setPasswordUser(''); // Mantener el campo de contraseña vacío
    setYearUser(usuario.fecha_nacimiento?.split(' ')[0] || '');
    setImageUrl(usuario.foto ? `data:image/jpeg;base64,${usuario.foto}` : '');
    setTipoUser(usuario.tipo_usuario);
  };

  const handleNuevoClick = () => {
    setIdUser('');
    setNombreUser('');
    setEmailUser('');
    setDniUser('');
    setPasswordUser('');
    setYearUser('');
    setImageUrl('');
    setTipoUser('');
  };

  const handleGuardarClick = async () => {
    try {
      const datos = {
        id: idUser ? parseInt(idUser) : undefined,
        nombre: nombreUser,
        dni: dniUser,
        contraseña: passwordUser ? passwordUser : undefined,
        foto: imageUrl ? imageUrl.split(',')[1] : '',
        fecha_nacimiento: yearUser,
        tipo_usuario: tipoUser === 'Alumno' ? 1 : 2,
        email: emailUser
      };

      if (tipo === 'Alumno') {
        // Solo permitir actualizar
        const response = await fetch("https://proxy-vercel-ten.vercel.app/actualizar.php", {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tabla: "usuarios",
            datos: datos,
            id: idUser,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el usuario");
        } else {
          setGuardado(true);
          setTimeout(() => setGuardado(false), 1500);
          fetchUsuarios();
          handleNuevoClick();
        }
      } else {
        // Permitir crear o actualizar
        const response = await fetch(idUser ? "https://proxy-vercel-ten.vercel.app/actualizar.php" : "https://proxy-vercel-ten.vercel.app/insertar.php", {
          method: idUser ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: idUser ? JSON.stringify({
            tabla: "usuarios",
            datos: datos,
            id: idUser,
          }) : JSON.stringify({
            tabla: "usuarios",
            datos: {
              ...datos,
              contraseña: passwordUser, // Obligatorio para nuevos usuarios
            },
          }),
        });

        if (!response.ok) {
          throw new Error(idUser ? "Error al actualizar el usuario" : "Error al crear el usuario");
        } else {
          setGuardado(true);
          setTimeout(() => setGuardado(false), 1500);
          fetchUsuarios();
          handleNuevoClick();
        }
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };
  
  const handleEliminarClick = async () => {
    if (!idUser) return;
    try {
      const response = await fetch(`https://proxy-vercel-ten.vercel.app/borrar.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabla: "usuarios", id: idUser }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("No se puede eliminar un test que tiene preguntas asociadas");
        } else {
          throw new Error("Error al eliminar el test");
        }
      } else {
        setEliminando(true);
        setTimeout(() => setEliminando(false), 1500);
        handleNuevoClick();
        fetchUsuarios();
      }

    } catch (error: string | any) {
      console.error("Error al eliminar el test:", error);
      setEliminando(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
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
                
                <label className="text-sm">Tipo Usuario</label>
                <select
                  className="border p-3 w-full rounded-lg"
                  value={tipoUser}
                  disabled={tipo === 'Alumno'}
                  onChange={(e) => setTipoUser(e.target.value)}
                >
                  <option value="" disabled>Seleccione el tipo de usuario</option>
                  <option value="Alumno">Alumno</option>
                  <option value="Profesor">Profesor</option>
                </select>
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
                  required={!idUser} // Obligatorio si no hay idUser (creación de nuevo usuario)
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
                <div className="w-full h-36 border border-dashed border-gray-300 flex justify-center items-center rounded-lg relative">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Foto del usuario" className="max-h-full max-w-full rounded-lg" />
                  ) : (
                    <span>No hay imagen</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
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
          disabled={tipo == 'Alumno'}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={20} /> Nuevo
        </button>

        <button
          onClick={handleEliminarClick}
          disabled={!idUser || eliminando}
          className={`px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 
                    ${!idUser || eliminando ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {eliminando ? <CheckCircle size={20} /> : <><Trash2 size={20} /> Eliminar</>}
        </button>

        <button
          onClick={handleGuardarClick}
          disabled={nombreUser.trim() === "" || emailUser.trim() === "" || dniUser.trim() === "" || yearUser.trim() === "" || (!idUser && passwordUser.trim() === "") || guardado}
          className={`px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 
                    ${nombreUser.trim() === "" || emailUser.trim() === "" || dniUser.trim() === "" || yearUser.trim() === "" || (!idUser && passwordUser.trim() === "") || guardado ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          {guardado ? <CheckCircle size={20} /> : <><Save size={20} /> {idUser ? "Actualizar" : "Guardar"}</>}
        </button>
      </div>
    </div>
  );
};

export default Usuario;