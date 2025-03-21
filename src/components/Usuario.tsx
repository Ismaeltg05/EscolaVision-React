<<<<<<< HEAD
import React, { useEffect, useState } from 'react';

const Usuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<{ id: string; nombre: string }[]>([]);
  const [idAlum, setIdAlum] = useState('');
  const [nameAlum, setNameAlum] = useState('');
  const [emailAlum, setEmailAlum] = useState('');
  const [dniAlum, setDniAlum] = useState('');
  const [passwordAlum, setPasswordAlum] = useState('');
  const [yearAlum, setYearAlum] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://54.87.117.11/EscolaVision/crud/leer.php?tabla=usuarios');
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

  // Cargar los datos del usuario al hacer clic
  const handleUserClick = (usuario: { id: string; nombre: string; email?: string; dni?: string; contraseña?: string; fecha_nacimiento?: string; foto?: string }) => {
    setIdAlum(usuario.id);
    setNameAlum(usuario.nombre);
    setEmailAlum(usuario.email || '');
    setDniAlum(usuario.dni || '');
    setPasswordAlum(usuario.contraseña || '');
    setYearAlum(usuario.fecha_nacimiento || '');
    setImageUrl(usuario.foto ? `data:image/jpeg;base64,${usuario.foto}` : '');
  };

  // Paginación: calcular usuarios visibles
  const indexOfLastUser = (currentPage + 1) * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if ((currentPage + 1) * usersPerPage < usuarios.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNuevoClick = () => {
    setIdAlum('');
    setNameAlum('');
    setEmailAlum('');
    setDniAlum('');
    setPasswordAlum('');
    setYearAlum('');
    setImageUrl('');
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
        <div className="main-content">
          <div className="left">
            <div className="vbox left-content">
              <label className="bold-label">Usuarios guardados:</label>
              <ul className="list-view">
                {currentUsers.map((usuario) => (
                  <li key={usuario.id} onClick={() => handleUserClick(usuario)} className="clickable-item">
                    {usuario.nombre}
                  </li>
                ))}
              </ul>
              {/* Paginación */}
              <nav className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 0}>
                  ←
                </button>
                <span>Página {currentPage + 1} de {Math.ceil(usuarios.length / usersPerPage)}</span>
                <button onClick={handleNextPage} disabled={(currentPage + 1) * usersPerPage >= usuarios.length}>
                  →
                </button>
              </nav>
            </div>
          </div>

          <div className="right">
            <div className="vbox right-content">
              <div className="hbox">
                <label className="bold-label">Datos del usuario</label>
              </div>
              <div className="hbox hbox-grow">
                <div className="vbox column">
                  <label>Id</label>
                  <input type="text" className="text-input" value={idAlum} disabled />
                  <label className="margin-top">Nombre y Apellidos</label>
                  <input type="text" className="text-input" value={nameAlum} onChange={(e) => setNameAlum(e.target.value)} />
                  <label className="margin-top">Email</label>
                  <input type="text" className="text-input" value={emailAlum} onChange={(e) => setEmailAlum(e.target.value)} />
                  <label className="margin-top">DNI</label>
                  <input type="text" className="text-input" value={dniAlum} onChange={(e) => setDniAlum(e.target.value)} />
                </div>
                <div className="vbox column">
                  <label className="margin-top-large">Contraseña</label>
                  <input type="password" className="text-input" value={passwordAlum} onChange={(e) => setPasswordAlum(e.target.value)} />
                  <label className="margin-top-large">Año Nacimiento</label>
                  <input type="text" className="text-input" value={yearAlum} onChange={(e) => setYearAlum(e.target.value)} />
                  <label className="margin-top-large">Foto</label>
                  <div className="image-wrapper">
                    {imageUrl ? <img src={imageUrl} alt="Foto del usuario" className="user-image" /> : <span>No hay imagen</span>}
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
              <img id="imgClearUser" alt="" />
            </button>
            <button className="button" onClick={handleEliminarClick}>
              <span>Eliminar</span>
              <img id="imgDelUser" alt="" />
            </button>
            <button className="button" onClick={handleGuardarClick}>
              <span>Guardar</span>
              <img id="imgSaveUser" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
=======
>>>>>>> parent of 5acf47d (muchos cambios, conexion con **AWS**, login hecho, test, preguntas y usuarios (mas o menos))
