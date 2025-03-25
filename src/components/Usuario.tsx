  /**
   * @file Usuario.tsx
   * @description Componente que muestra los usuarios existentes en la app.
   * @author Adrian Ruiz Sanchez
   */
  
  import React, { useEffect, useState } from 'react';

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

    const usuariosPorPagina = 7;

    useEffect(() => {
      const fetchUsuarios = async () => {
        try {
          const response = await fetch('/crud/leer.php?tabla=usuarios');
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

    return (
      <div className="tab-content">
        <div className="border-pane">
          <div className="main-content">
            <div className="left">
              <div className="vbox left-content">
                <label className="bold-label">Usuarios guardados:</label>
                <ul className="list-view">
                  {usuarios
                    .slice(pagina * usuariosPorPagina, (pagina + 1) * usuariosPorPagina)
                    .map((usuario, index) => (
                      <li key={index} onClick={() => handleUsuarioClick(usuario)} className="clickable-item">
                        {`Usuario ${usuario.id} - ${usuario.nombre}`}
                      </li>
                    ))}
                </ul>

                {/* Paginación */}
                <nav className="pagination">
                  <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 0}>
                    ←
                  </button>
                  <span>Página {pagina + 1} de {Math.ceil(usuarios.length / usuariosPorPagina)}</span>
                  <button onClick={() => setPagina(pagina + 1)} disabled={(pagina + 1) * usuariosPorPagina >= usuarios.length}>
                    →
                  </button>
                </nav>
              </div>
            </div>

            <div className="right">
              <div className="vbox right-content">
                <label className="bold-label">Datos del usuario</label>

                <div className="grid-container">
                  <div className="grid-item">
                    <label>Id</label>
                    <input type="text" className="text-input" value={idUser} disabled />
                  </div>
                  <div className="grid-item">
                    <label>Nombre</label>
                    <input type="text" className="text-input" value={nombreUser} onChange={(e) => setNombreUser(e.target.value)} placeholder="Introduce el nombre..." />
                  </div>
                  <div className="grid-item">
                    <label>Email</label>
                    <input type="text" className="text-input" value={emailUser} onChange={(e) => setEmailUser(e.target.value)} placeholder="Introduce el email..." />
                  </div>
                  <div className="grid-item">
                    <label>DNI</label>
                    <input type="text" className="text-input" value={dniUser} onChange={(e) => setDniUser(e.target.value)} placeholder="Introduce el DNI..." />
                  </div>
                  <div className="grid-item">
                    <label>Contraseña</label>
                    <input type="password" className="text-input" value={passwordUser} onChange={(e) => setPasswordUser(e.target.value)} placeholder="Introduce la contraseña..." />
                  </div>
                  <div className="grid-item">
                    <label>Año de nacimiento</label>
                    <input type="text" className="text-input" value={yearUser} onChange={(e) => setYearUser(e.target.value)} placeholder="Introduce el año..." />
                  </div>
                  <div className="grid-item image-container">
                    <label>Foto</label>
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
              <button className="button">
                <span>Nuevo</span>
                <img id="imgClearUser" alt="" />
              </button>
              <button className="button">
                <span>Eliminar</span>
                <img id="imgDelUser" alt="" />
              </button>
              <button className="button">
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
