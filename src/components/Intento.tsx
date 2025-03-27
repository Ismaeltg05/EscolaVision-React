import React, { useEffect, useState } from 'react';
import { Plus, Trash, Save } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa'; // Importamos el icono de gráfico
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registramos los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Intentos: React.FC = () => {
  const [intentos, setIntentos] = useState<{ id: number; fecha: string; hora: string; resultados: string; idusuario: number }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idIntento, setIdIntento] = useState('');
  const [fechaIntento, setFechaIntento] = useState('');
  const [horaIntento, setHoraIntento] = useState('');
  const [resultadosIntento, setResultadosIntento] = useState('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const intentosPorPagina = 6;

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem('idusuario');
    if (storedIdUsuario) {
      setUsuarioId(Number(storedIdUsuario));
    }

    const fetchIntentos = async () => {
      try {
        const response = await fetch('/leer.php?tabla=intentos');
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

  const handleNuevoClick = () => {
    setIdIntento('');
    setFechaIntento('');
    setHoraIntento('');
    setResultadosIntento('');
  };

  const handleGuardarClick = async () => {
    try {
      // Realizar la operación de guardar
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleEliminarClick = async () => {
    if (!idIntento) return;
    try {
      // Realizar la operación de eliminar
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  // Convertir los resultados en un formato adecuado para el gráfico
  const parseResultados = (resultados: string) => {
    const areas = resultados.split(';').map((resultado) => Math.min(10, Math.max(0, parseFloat(resultado.trim())))); // Limitar entre 0 y 10
    return areas;
  };

  // Datos del gráfico
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

  // Configuración del gráfico para el eje Y (mostrar el máximo 10)
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

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl flex flex-col gap-6 h-[95%]">
        <h2 className="text-3xl font-bold text-center">Gestión de Intentos</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Parte izquierda: Lista de intentos */}
          <div className="w-full lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-inner overflow-auto">
            <h3 className="font-semibold text-lg mb-2">Intentos guardados</h3>
            <ul className="space-y-2">
              {intentos
                .filter((intento) => intento.idusuario === usuarioId)
                .slice(pagina * intentosPorPagina, (pagina + 1) * intentosPorPagina)
                .map((intento, index) => (
                  <li
                    key={index}
                    onClick={() => handleIntentoClick(intento)}
                    className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-blue-100"
                  >
                    {`Intento ${intento.id} - ${intento.fecha} a las ${intento.hora}`}
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
              <span>
                Página {pagina + 1} de {Math.ceil(intentos.filter((intento) => intento.idusuario === usuarioId).length / intentosPorPagina)}
              </span>
              <button
                onClick={() => setPagina(pagina + 1)}
                disabled={(pagina + 1) * intentosPorPagina >= intentos.filter((intento) => intento.idusuario === usuarioId).length}
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
              <label className="text-sm">ID</label>
              <input type="text" className="border p-3 w-full rounded-lg" value={idIntento} placeholder='ID del Intento' disabled />
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
          disabled={!idIntento}
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
