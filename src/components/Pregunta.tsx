import React, { useEffect, useState } from "react";
import { Plus, Save, CheckCircle, CheckCircleIcon } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { Trash2 } from "lucide-react";

const Pregunta: React.FC = () => {
  const [preguntas, setPreguntas] = useState<{ id: number; titulo: string; enunciado: string; idtest: number }[]>([]);
  const [tests, setTests] = useState<{ id: number; nombretest: string }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idQuest, setIdQuest] = useState('');
  const [tituloQuest, setTituloQuest] = useState('');
  const [enunQuest, setEnunQuest] = useState('');
  const [testQuest, setTestQuest] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(true);
  const [testSeleccionado, setTestSeleccionado] = useState<number | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [areas, setAreas] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);


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
    handleNuevoClick();
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
    setTestSeleccionado(testId);
    setMostrarModal(false);
    setTestQuest(testId);
  };

  const handleSelectArea = (idArea: number) => {
    setSelectedArea(idArea);
  };


  const handleEliminarClick = async () => {
    if (!idQuest) return;
    try {

      const response2 = await fetch(`https://proxy-vercel-ten.vercel.app/leer.php?tabla=pxa&idpregunta=${idQuest}`);
      if (!response2.ok) {setMensaje("Error al obtener las áreas asociadas a la pregunta"); setTimeout(() => setMensaje(null), 3000);}
      else {
        const data = await response2.json();
        const areasAsociada = data.pxa;
        const response3 = await fetch(`https://proxy-vercel-ten.vercel.app/borrar.php`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tabla: "pxa", id: areasAsociada[0].id }),
        });
        if (!response3.ok) {setMensaje("Error al eliminar el área asociada a la pregunta"); setTimeout(() => setMensaje(null), 3000);}
        else {
          const response = await fetch(`https://proxy-vercel-ten.vercel.app/borrar.php`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tabla: "preguntas", id: idQuest }),
          });

          if (!response.ok) {
             setMensaje("Error al eliminar la pregunta");
             setTimeout(() => setMensaje(null), 3000);
          } else {
            setEliminando(true);
            setTimeout(() => setEliminando(false), 1500);
            handleNuevoClick();
            fetchPreguntas(testQuest);
          }
        }
      }

    } catch (error: string | any) {
      console.error("Error al eliminar el test:", error);
      //setError(error.message);
      setEliminando(false);
      //setTimeout(() => setError(null), 3000);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch("https://proxy-vercel-ten.vercel.app/leer.php?tabla=areas");
      if (!response.ok) throw new Error("Error al obtener las áreas");
      const data = await response.json();
      setAreas(Array.isArray(data.areas) ? data.areas : []);
    } catch (error) {
      console.error("Error al obtener las áreas:", error);
      setAreas([]);
    }
  };

  const handleGuardarClick = async () => {
    if (!tituloQuest.trim() || !enunQuest.trim()) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const datos = JSON.stringify({
        id: idQuest,
        titulo: tituloQuest,
        enunciado: enunQuest,
        idtest: testQuest,
      });

      const response = await fetch(
        idQuest ? "https://proxy-vercel-ten.vercel.app/actualizar.php" : "https://proxy-vercel-ten.vercel.app/insertar.php",
        {
          method: idQuest ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: idQuest
            ? JSON.stringify({ tabla: "preguntas", datos: JSON.parse(datos), id: idQuest })
            : JSON.stringify({ tabla: "preguntas", datos: JSON.parse(datos) }),
        }
      );

      if (!response.ok) throw new Error("Error al guardar la pregunta");

      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);

      // Si es una nueva pregunta, obtener el último ID desde la API
      if (!idQuest) {
        const lastQuestionResponse = await fetch("https://proxy-vercel-ten.vercel.app/leer.php?tabla=preguntas&ultima=true");
        if (!lastQuestionResponse.ok) throw new Error("Error al obtener la última pregunta");

        const data = await lastQuestionResponse.json();
        const questions = data.preguntas;

        if (questions.length > 0) {
          setIdQuest("" + questions[0].id);
        } else {
          throw new Error("No se encontró ninguna pregunta");
        }
      }

      setSelectedArea(null);
      if (!idQuest) {
        setShowModal(true);
        fetchAreas();
      } else {
        fetchPreguntas(testQuest);
        handleNuevoClick();
      }

    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
    }
  };


  const handleAsignarAreas = async () => {
    if (!selectedArea) {
      alert("Selecciona un área antes de asignar.");
      return;
    }

    try {
      await fetch("https://proxy-vercel-ten.vercel.app/insertar.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabla: "pxa",
          datos: { idpregunta: idQuest, idarea: selectedArea },
        }),
      });


      setMensaje("Pregunta creada y Área asignada correctamente.");
      setTimeout(() => setMensaje(null), 3000);
      setShowModal(false);
      handleNuevoClick();
      setSelectedArea(null);
      fetchPreguntas(testQuest);
    } catch (error) {
      console.error("Error al asignar áreas:", error);
    }
  };



  const handleNuevoClick = () => {
    setEnunQuest('');
    setTestQuest(testSeleccionado !== null ? testSeleccionado : 0);
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
            <h3 className="font-semibold text-lg mb-2">Preguntas guardadas - Test {testQuest}</h3>
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
                      {`Pregunta ${pregunta.id}`}
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
              {/*<label className="text-sm">ID</label>
              <input type="text" className="border p-3 w-full rounded-lg" value={idQuest} disabled /> */}
              <label className="text-sm">Título</label>
              <input
                type="text"
                className="border p-3 w-full rounded-lg"
                value={tituloQuest}
                onChange={(e) => setTituloQuest(e.target.value)}
                placeholder="Introduce el título de la pregunta..."
                required
              />
              <label className="text-sm">Enunciado</label>
              <textarea
                className="border p-3 w-full rounded-lg h-32"
                value={enunQuest}
                onChange={(e) => setEnunQuest(e.target.value)}
                placeholder="Introduce el enunciado de la pregunta..."
                required
              />
              <label className="text-sm">Test</label>
              <select
                className="border p-3 w-full rounded-lg"
                value={testQuest}
                disabled={testSeleccionado !== null}
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

        {mensaje && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{mensaje}</div>}
      </div>


      {/* Botones de acción */}
      <div className="flex flex-nowrap justify-center gap-4 mt-4 px-6 pb-6 w-full max-w-lg">
        <button
          onClick={handleNuevoClick}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 : hover:bg-blue-600"
        >
          <Plus size={20} /> Nuevo
        </button>

        <button
          onClick={handleEliminarClick}
          disabled={!idQuest || eliminando}
          className={`px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 
                    ${!idQuest || eliminando ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {eliminando ? <CheckCircle size={20} /> : <><Trash2 size={20} /> Eliminar</>}
        </button>

        <button
          onClick={handleGuardarClick}
          disabled={tituloQuest.trim() === "" || enunQuest.trim() === "" || guardado}
          className={`px-8 py-3 rounded-lg text-lg w-full sm:w-auto flex items-center gap-2 
                    ${tituloQuest.trim() === "" || enunQuest.trim() === "" || guardado ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          {guardado ? <CheckCircle size={20} /> : <><Save size={20} /> {idQuest ? "Actualizar" : "Guardar"}</>}
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

      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-2 border-black-200">
            <h2 className="text-lg font-semibold mb-4">Selecciona a que área desea asignar la pregunta</h2>

            <div className="space-y-2">
              {areas.length > 0 ? (
                areas.map((area) => (
                  <li
                    key={area.id}
                    onClick={() => handleSelectArea(area.id)}
                    className={`cursor-pointer p-4 shadow-md rounded-lg transition-all duration-200 flex items-center justify-center text-center
                                  ${selectedArea === area.id ? "bg-green-500 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"}`}
                  >

                    {selectedArea === area.id && (
                      <CheckCircleIcon className="w-5 h-5 text-white ml-2" />
                    )}
                    <span className="w-full text-center">{area.nombre}</span>

                  </li>
                ))
              ) : (
                <p>No hay áreas disponibles</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={handleAsignarAreas} className="px-4 py-2 bg-blue-500 text-white rounded">
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pregunta;
