import React, { useEffect, useState } from "react";
import { Plus, Trash, Save, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

interface TestProps {
  logout: () => void;
}

const Test: React.FC<TestProps> = () => {
  const [tests, setTests] = useState<{ id: number; nombretest: string; isVisible: number }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [idTest, setIdTest] = useState("");
  const [testNombre, setTestNombre] = useState("");
  const [testVisible, setTestVisible] = useState<'sí' | 'no' | ''>("sí");
  const [eliminando, setEliminando] = useState(false);
  const [testEliminado, setTestEliminado] = useState(null);
  const [guardado, setGuardado] = useState(false);
  const testsPorPagina = 6;

  var apiUrl = "/crud/leer.php?tabla=tests";
  const fetchTests = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Error al obtener tests");
      const data = await response.json();
      setTests(Array.isArray(data.tests) ? data.tests : []);
    } catch (error) {
      console.error("Error al obtener los tests:", error);
      setTests([]);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleNextPage = () => {
    if ((pagina + 1) * testsPorPagina < tests.length) {
      setPagina(pagina + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };

  const handleTestClick = (test: { id: number; nombretest: string; isVisible: number }) => {
    setIdTest(String(test.id));
    setTestNombre(test.nombretest);
    setTestVisible(test.isVisible === 1 ? "sí" : "no");
  };

  const handleNuevoClick = () => {
    setIdTest("");
    setTestNombre("");
    setTestVisible("sí");
  };

  const handleGuardarClick = async () => {
    try {
      const datos = JSON.stringify({ id: idTest, nombretest: testNombre, isVisible: testVisible == "sí" ? 1 : 0 });
      const response = await fetch(idTest ? "/crud/actualizar.php" : "/crud/insertar.php", {
        method: idTest ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabla: "tests",
          datos: JSON.parse(datos),
        }),
      });
      if (!response.ok) throw new Error("Error al guardar el test");

      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);
      handleNuevoClick();
      fetchTests();
    } catch (error) {
      console.error("Error al guardar el test:", error);
    }
  };

  const handleEliminarClick = async () => {
    if (!idTest) return;
    try {
      setEliminando(true);

      const response = await fetch(`/crud/borrar.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabla: "tests", id: idTest }),
      });

      if (!response.ok) throw new Error("Error al eliminar el test");

      setTimeout(() => {
        setEliminando(false);
        fetchTests();
      }, 1500);
      handleNuevoClick();
    } catch (error) {
      console.error("Error al eliminar el test:", error);
      setEliminando(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-7xl flex flex-col gap-6 h-[80%] overflow-hidden">
        <h2 className="text-3xl font-bold text-center">Gestión de Test</h2>

        <div className="flex flex-col lg:flex-row gap-6 overflow-auto">
          {/* Parte izquierda: Lista de tests */}
          <div className="w-full lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow-inner overflow-auto">
            <h3 className="font-semibold text-lg mb-2">Tests guardados</h3>
            <ul className="space-y-2">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <motion.li
                    key={test.id}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      opacity: eliminando && test.id === testEliminado ? 0 : 1,
                      scale: eliminando && test.id === testEliminado ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleTestClick(test)}
                    className="cursor-pointer p-4 bg-white shadow-md rounded-lg hover:bg-blue-100 transition-all duration-200"
                  >
                    {`Test ${test.id} - ${test.nombretest}`}
                  </motion.li>
                ))
              ) : (
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500"
                >
                  No hay tests disponibles
                </motion.li>
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
              <span>Página {pagina + 1} de {Math.ceil(tests.length / testsPorPagina)}</span>
              <button
                onClick={handleNextPage}
                disabled={(pagina + 1) * testsPorPagina >= tests.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                →
              </button>
            </nav>
          </div>

          {/* Parte derecha: Detalles del test */}
          <div className="w-full lg:w-3/5 bg-gray-50 p-6 rounded-xl shadow-inner flex flex-col">
            <h3 className="font-semibold text-lg mb-2">Datos del Test</h3>
            <div className="space-y-4 flex-grow">
              <label className="block text-gray-700">ID</label>
              <input type="text" className="border p-3 w-full rounded-lg" value={idTest} disabled />
              <label className="block text-gray-700">Nombre</label>
              <textarea className="border p-3 w-full rounded-lg h-32"
                placeholder="Introduce el nombre del test..."
                value={testNombre}
                onChange={(e) => setTestNombre(e.target.value)} />
              <label className="block text-gray-700">Test Visible</label>
              <div className="flex flex-wrap justify-between space-x-4">
                <button onClick={() => setTestVisible("sí")}
                  className={`p-3 rounded-lg w-1/2 sm:w-1/3 text-lg ${testVisible === "sí" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                  Sí
                </button>
                <button onClick={() => setTestVisible("no")}
                  className={`p-3 rounded-lg w-1/2 sm:w-1/3 text-lg ${testVisible === "no" ? "bg-red-500 text-white" : "bg-gray-200"}`}>
                  No
                </button>
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
          disabled={!idTest}
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

      {eliminando && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-10 left-10 bg-red-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <Trash2 className="w-10 h-10 animate-bounce" />
          <span className="ml-2">Test eliminado</span>
        </motion.div>
      )}
      {guardado && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-10 left-10 bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 animate-bounce" />
          <span className="ml-2">Test guardado</span>
        </motion.div>
      )}
    </div>
  );
};

export default Test;
