import React, { useEffect, useState } from "react";
import { Plus, Trash, Save } from "lucide-react";
import { RefreshCcw } from "lucide-react";

const Pregunta: React.FC = () => {
  const [preguntas, setPreguntas] = useState<{ id: number; titulo: string; enunciado: string; idtest: number }[]>([]);
  const [tests, setTests] = useState<{ id: number; nombretest: string }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idQuest, setIdQuest] = useState('');
  const [tituloQuest, setTituloQuest] = useState('');
  const [enunQuest, setEnunQuest] = useState('');
  const [testQuest, setTestQuest] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(true);

  const preguntasPorPagina = 6;

  useEffect(() => {


    const fetchTests = async () => {
      try {
        const response = await fetch("https://proxy-vercel-ten.vercel.app/leer.php?tabla=tests");
        if (!response.ok) throw new Error("Error al obtener tests");
        const data = await response.json();
        setTests(data.tests);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  const fetchPreguntas = async (testId: number) => {
    try {
      const response = await fetch("https://proxy-vercel-ten.vercel.app/leer.php?tabla=preguntas");
      if (!response.ok) throw new Error("Error al obtener preguntas");
      const data = await response.json();
      setPreguntas(data.preguntas.filter((pregunta: { idtest: number }) => pregunta.idtest === testId));
    } catch (error) {
      console.error("Error fetching preguntas:", error);
    }
  };



  const handlePreguntaClick = (pregunta: { id: number; titulo: string; enunciado: string; idtest: number }) => {
    setIdQuest(String(pregunta.id));
    setTituloQuest(pregunta.titulo);
    setEnunQuest(pregunta.enunciado);
    setTestQuest(pregunta.idtest);
  };

  const handleNextPage = () => {
    if ((pagina + 1) * preguntasPorPagina < preguntas.length) {
      setPagina(pagina + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };

  const handleSeleccionarTest = (testId: number) => {
    fetchPreguntas(testId);
    setMostrarModal(false);
  };

  const handleEliminarClick = () => {
    // Lógica para eliminar pregunta
  };

  const handleGuardarClick = () => {
    // Lógica para guardar pregunta
  };

  const handleNuevoClick = () => {
    setEnunQuest('');
    setTestQuest(0);
    setIdQuest('');
    setTituloQuest('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-500 text-white p-3 mb-4 rounded-full text-xl flex items-center justify-center"
        >
          <RefreshCcw size={24} /> <p>Selecciona otro test</p>
        </button>
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl flex flex-col gap-6 h-full">
        <h2 className="text-3xl font-bold text-center">Gestión de Preguntas</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Lista de preguntas */}
          <div className="w-full lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-inner overflow-auto">
            <h3 className="font-semibold text-lg mb-2">Preguntas guardadas</h3>
            <ul className="space-y-2">
              {preguntas.length > 0 ? (
                preguntas
                  .slice(pagina * preguntasPorPagina, (pagina + 1) * preguntasPorPagina)
                  .map((pregunta, index) => (
                    <li
                      key={index}
                      onClick={() => handlePreguntaClick(pregunta)}
                      className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-blue-100"
                    >
                      {`Pregunta ${pregunta.id} - Test ${pregunta.idtest}`}
                    </li>
                  ))
              ) : (
                <li className=" p-4 bg-white shadow-md rounded-lg">No hay preguntas disponibles</li>
              )}
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
              <span>Página {pagina + 1} de {Math.ceil(preguntas.length / preguntasPorPagina)}</span>
              <button
                onClick={handleNextPage}
                disabled={(pagina + 1) * preguntasPorPagina >= preguntas.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                →
              </button>
            </nav>
          </div>

          {/* Detalles de la pregunta */}
          <div className="w-full lg:w-3/5 bg-gray-50 p-6 rounded-xl shadow-inner flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Datos de la Pregunta</h3>
            <div className="space-y-4 flex-grow">
              <label className="text-sm">ID</label>
              <input type="text" className="border p-3 w-full rounded-lg" value={idQuest} disabled />
              <label className="text-sm">Título</label>
              <input
                type="text"
                className="border p-3 w-full rounded-lg"
                value={tituloQuest}
                onChange={(e) => setTituloQuest(e.target.value)}
                placeholder="Introduce el título de la pregunta..."
              />
              <label className="text-sm">Enunciado</label>
              <textarea
                className="border p-3 w-full rounded-lg h-32"
                value={enunQuest}
                onChange={(e) => setEnunQuest(e.target.value)}
                placeholder="Introduce el enunciado de la pregunta..."
              />
              <label className="text-sm">Test</label>
              <select
                className="border p-3 w-full rounded-lg"
                value={testQuest}
                onChange={(e) => setTestQuest(Number(e.target.value))}
              >
                <option value="" disabled>Selecciona el test...</option>
                {tests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.id} - {test.nombretest}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


      </div>
      {/* Botones de acción */}
      <div className="flex flex-nowrap justify-center gap-4 mt-4 px-6 pb-6 w-full max-w-lg">
        <button
          onClick={handleNuevoClick}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2"
        >
          <Plus size={20} /> Nuevo
        </button>

        <button
          onClick={handleEliminarClick}
          disabled={!idQuest}
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

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center border-2 border-black-200">
            <h2 className="text-xl font-semibold mb-4">Selecciona un Test</h2>
            <ul className="space-y-2">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <li
                    key={test.id}
                    onClick={() => handleSeleccionarTest(test.id)}
                    className="cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    {test.nombretest}
                  </li>
                ))
              ) : (
                <li>No hay tests</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pregunta;
