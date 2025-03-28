import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2, CheckCircle } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Usuario {
  id: number;
  nombre: string;
}

interface Intento {
  id: number;
  fecha: string;
  hora: string;
  resultados: string;
  idusuario: number;
  idtest: number;
}

const Intentos: React.FC = () => {
  const [intentos, setIntentos] = useState<Intento[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idIntento, setIdIntento] = useState('');
  const [fechaIntento, setFechaIntento] = useState('');
  const [horaIntento, setHoraIntento] = useState('');
  const [idusuarioIntento, setIdusuarioIntento] = useState('');
  const [resultadosIntento, setResultadosIntento] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [idTestIntento, setIdTestIntento] = useState('');
  const [tests, setTests] = useState<any[]>([]);
  const [filtroAlumno, setFiltroAlumno] = useState('');

  const [eliminando, setEliminando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  var intentosPorPagina = 5;
  const id_centro = localStorage.getItem('id_centro');
  const tipo = localStorage.getItem('tipo');
  const idusuario = localStorage.getItem('idusuario');

  const fetchIntentos = async () => {
    try {
      const response = await fetch(`https://proxy-vercel-ten.vercel.app/leer.php?tabla=intentos&id_centro=${id_centro}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (tipo === 'Alumno') {
        setIntentos(data.intentos.filter((intento: Intento) => intento.idusuario.toString() === idusuario));
      } else {
        setIntentos(data.intentos);
      }
    } catch (error) {
      console.error('Error fetching intentos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`https://proxy-vercel-ten.vercel.app/leer.php?tabla=usuarios&id_centro=${id_centro}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch(`https://proxy-vercel-ten.vercel.app/leer.php?tabla=tests&id_centro=${id_centro}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTests(data.tests);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  useEffect(() => {
    fetchIntentos();
    fetchUsuarios();
    fetchTests();
    handleNuevoClick();
    
  }, []);

  const handleIntentoClick = async (intento: Intento) => {
    setIdIntento(String(intento.id));
    setFechaIntento(intento.fecha);
    setHoraIntento(intento.hora);
    setResultadosIntento(intento.resultados);
    setIdusuarioIntento(String(intento.idusuario)); // Asignar idusuario en lugar del nombre
    setIdTestIntento(String(intento.idtest)); // Asignar idtest en lugar del nombre del test
  };

  const handleNuevoClick = () => {
    setIdIntento('');
    setFechaIntento('');
    setHoraIntento('');
    setResultadosIntento('');
    setIdTestIntento('');
    if(tipo !== 'Alumno') {
      setIdusuarioIntento('');
    }else{
      setIdusuarioIntento(`${idusuario}`);	
    }
    
  };

  const handleGuardarClick = async () => {
    try {
      const datos = {
        fecha: fechaIntento,
        hora: horaIntento,
        resultados: resultadosIntento,
        idusuario: parseInt(idusuarioIntento),
        idtest: parseInt(idTestIntento)
      };

      const response = await fetch(idIntento ? "https://proxy-vercel-ten.vercel.app/actualizar.php" : "https://proxy-vercel-ten.vercel.app/insertar.php", {
        method: idIntento ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: idIntento ? JSON.stringify({
          tabla: "intentos",
          datos: datos,
          id: idIntento,
        }) : JSON.stringify({
          tabla: "intentos",
          datos: datos
        }),
      });

      if (!response.ok) {
        throw new Error(idIntento ? "Error al actualizar el intento" : "Error al crear el intento");
      } else {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 1500);
        fetchIntentos();
        handleNuevoClick();
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleEliminarClick = async () => {
    if (!idIntento) return;
    try {
      const response = await fetch(`https://proxy-vercel-ten.vercel.app/borrar.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabla: "intentos", id: idIntento }),
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
        fetchIntentos();
      }

    } catch (error: any) {
      console.error("Error al eliminar el test:", error);
      setEliminando(false);
    }
  };

  const parseResultados = (resultados: string) => {
    const areas = resultados.split(';').map((resultado) => Math.min(10, Math.max(0, parseFloat(resultado.trim())))); // Limitar entre 0 y 10
    return areas;
  };

  const data = {
    labels: ['Área 1', 'Área 2', 'Área 3', 'Área 4', 'Área 5'],
    datasets: [
      {
        label: 'Resultados del Test',
        data: parseResultados(resultadosIntento), // Usamos los datos convertidos
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0, // Mínimo en 0
        max: 10, // Máximo en 10
        ticks: {
          stepSize: 1, // Establecemos los pasos entre las marcas en el eje Y
        },
      },
    },
  };

  // Filtrar intentos por alumno si se ha seleccionado uno y el tipo no es "Alumno"
  const intentosFiltrados = tipo === 'Alumno'
    ? intentos
    : filtroAlumno
    ? intentos.filter((intento) => intento.idusuario.toString() === filtroAlumno)
    : intentos;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl flex flex-col gap-6 h-[95%]">
        <h2 className="text-3xl font-bold text-center">Gestión de Intentos</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Parte izquierda: Lista de intentos */}
          <div className="w-full lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-inner overflow-auto">
            <h3 className="font-semibold text-lg mb-2">Intentos guardados</h3>

            {tipo !== 'Alumno' && (
              <>
                <label className="block mb-2 text-sm font-medium text-gray-700">Filtrar por Alumno</label>
                <select
                  className="border p-2 w-full rounded-lg mb-4"
                  value={filtroAlumno}
                  onChange={(e) => setFiltroAlumno(e.target.value)}
                >
                  <option value="">Todos los alumnos</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id.toString()}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              </>
            )}

            <ul className="space-y-2">
              {
                intentosFiltrados.length > 0 ? (
                  intentosFiltrados
                    .slice(pagina * intentosPorPagina, (pagina + 1) * intentosPorPagina)
                    .map((intento) => (
                      <motion.li
                        key={intento.id}
                        initial={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleIntentoClick(intento)}
                        className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-blue-100 transition-all duration-200"
                      >
                        {`Intento ${intento.id} - ${intento.fecha} a las ${intento.hora}`}
                      </motion.li>
                    ))
                ) : (
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500"
                  >
                    No hay intentos disponibles
                  </motion.li>
                )
              }
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
              <span>
                Página {pagina + 1} de {Math.ceil(intentosFiltrados.length / intentosPorPagina)}
              </span>
              <button
                onClick={() => setPagina(pagina + 1)}
                disabled={(pagina + 1) * intentosPorPagina >= intentosFiltrados.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                →
              </button>
            </nav>
          </div>

          {/* Parte derecha: Detalles del intento */}
          <div className="w-full lg:w-3/5 bg-gray-50 p-6 rounded-xl shadow-inner flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Datos del Intento</h3>
            <div className="space-y-4 flex-grow">
              <label className="text-sm">Fecha</label>
              <input type="date" className="border p-3 w-full rounded-lg" value={fechaIntento} onChange={(e) => setFechaIntento(e.target.value)} />
              <label className="text-sm">Hora</label>
              <input type="text" className="border p-3 w-full rounded-lg" placeholder='Introduce la hora en la que se ha realizado el intento (HH:MM:SS)' value={horaIntento} onChange={(e) => setHoraIntento(e.target.value)} />
              <label className="text-sm">Resultados</label>
              {/* Input con icono de gráfico */}
              <div className="relative">
                <input
                  type="text"
                  className="border p-3 w-full rounded-lg pl-10"
                  placeholder="Introduce los resultados del test separados por ';'. Ej: 0;2.5;5;7.5;10"
                  value={resultadosIntento}
                  onChange={(e) => setResultadosIntento(e.target.value)}
                />
                {resultadosIntento && (
                  <FaChartBar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowModal(true)} // Al hacer click, se muestra el modal
                  />
                )}
              </div>
              <label className="text-sm">Test</label>
              <select
                className="border p-3 w-full rounded-lg"
                value={idTestIntento}
                onChange={(e) => setIdTestIntento(e.target.value)}
                required
              >
                <option value="" disabled>Seleccione un test</option>
                {tests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.nombretest}
                  </option>
                ))}
              </select>
              <label className="text-sm">Usuario</label>
              <select
                className="border p-3 w-full rounded-lg"
                value={idusuarioIntento}
                onChange={(e) => setIdusuarioIntento(e.target.value)}
                required
                disabled={tipo === 'Alumno'}
              >
                <option value="" disabled>Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

      </div>
      {/* Botones para gestionar la acción */}
      <div className="flex flex-nowrap justify-center gap-4 mt-4 px-6 pb-6 w-full max-w-lg">
        <button
          onClick={handleNuevoClick}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2"
        >
          <Plus size={20} /> Nuevo
        </button>

        <button
          onClick={handleEliminarClick}
          disabled={!idIntento || eliminando}
          className={`px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 
            ${!idIntento || eliminando ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {eliminando ? <CheckCircle size={20} /> : <><Trash2 size={20} /> Eliminar</>}
        </button>

        <button
          onClick={handleGuardarClick}
          disabled={fechaIntento.trim() === "" || horaIntento.trim() === "" || resultadosIntento.trim() === "" || idusuarioIntento.trim() === "" || guardado}
          className={`px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 
            ${fechaIntento.trim() === "" || horaIntento.trim() === "" || resultadosIntento.trim() === "" || idusuarioIntento.trim() === "" || guardado ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          {guardado ? <CheckCircle size={20} /> : <><Save size={20} /> {idIntento ? "Actualizar" : "Guardar"}</>}
        </button>
      </div>

      {/* Modal con gráfico */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-11/12 sm:w-1/2 border-2 border-black"> {/* Borde negro de 2px */}
            <h2 className="text-xl font-semibold text-center mb-4">Gráfico de Resultados</h2>
            <Bar data={data} options={options} />
            <button
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg w-full"
              onClick={() => setShowModal(false)} // Cierra el modal
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Intentos;