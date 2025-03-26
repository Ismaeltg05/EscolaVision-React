/**
 * @file Test.tsx
 * @description Componente de gestión de tests.
 * @author Adrian Ruiz Sanchez, Ismael Torres Gonzalez
 */

import React, { useEffect, useState } from 'react';
import './styles/comun.css';

interface TestProps {
  logout: () => void;
}

const Test: React.FC<TestProps> = ({ }) => {
  const [tests, setTests] = useState<{ id: number; nombretest: string; isVisible: number; }[]>([]);
  const [idTest, setIdTest] = useState('');
  const [testNombre, setTestNombre] = useState('');
  const [testVisible, setTestVisible] = useState<'sí' | 'no' | ''>('sí');
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 5;

  const handleNuevoClick = () => {
    setTestNombre('');
    setTestVisible('sí');
    setIdTest('');
  };

  const handleEliminarClick = async () => {
    try {
      const response = await fetch('https://servidor.ieshlanz.es:8000/crud/borrar.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idTest,
        }),
      });

      if (!response.ok) {
        throw new Error('Error deleting test');
      }
      // Re-fetch tests after deletion
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleGuardarClick = async () => {
    try {
      const response = await fetch('https://servidor.ieshlanz.es:8000/crud/insertar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idTest,
          nombretest: testNombre,
          visible: testVisible,
        }),
      });

      if (!response.ok) {
        throw new Error('Error saving test');
      }
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  const handleVisibleClick = (visible: 'sí' | 'no') => {
    setTestVisible(visible);
  };

  const handleTestClick = (test: { id: number; nombretest: string; isVisible: number;}) => {
    setIdTest(String(test.id));
    setTestNombre(test.nombretest);
    setTestVisible(test.isVisible === 1 ? 'sí' : 'no');
  };

  const handleNextPage = () => {
    if (currentPage * testsPerPage < tests.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch('https://servidor.ieshlanz.es:8000/crud/leer.php?tabla=tests');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data.tests)) {
        setTests(data.tests);
      } else {
        console.error('Datos no son un arreglo:', data);
        setTests([]);  // Establece un arreglo vacío si los datos no son correctos
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      setTests([]);  // Establece un arreglo vacío en caso de error
    }
  };

  // Paginación: obtener los tests de la página actual
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);


  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="tab">
      <div className="tab-content">
        <div className="border-pane">
          <div className="main-content">
            <div className="left">
              <div className="vbox left-content">
                <label className="bold-label">Test guardados:</label>
                <ul className="list-view">
                  {currentTests.length > 0 ? (
                    currentTests.map((test, index) => (
                      <li key={index} onClick={() => handleTestClick(test)} className="clickable-item">
                        {test.nombretest}
                      </li>
                    ))
                  ) : (
                    <li>No hay tests disponibles.</li>
                  )}
                </ul>
                <nav className="pagination">
                  <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    ←
                  </button>
                  <span>Página {currentPage} de {Math.ceil(tests.length / testsPerPage)}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage * testsPerPage >= tests.length}
                  >
                    →
                  </button>
                </nav>
              </div>
            </div>
            <div className="right">
              <div className="vbox right-content">
                <div className="hbox">
                  <label className="bold-label">Datos del test</label>
                </div>
                <div className="hbox hbox-grow">
                  <div className="vbox">
                    <label>Id</label>
                    <label className="margin-top">Nombre</label>
                    <label className="margin-top-large">Test Visible</label>
                  </div>
                  <div className="vbox">
                    <input type="text" className="text-input" disabled value={idTest} />
                    <textarea
                      className="text-area"
                      placeholder="Introduce el nombre del test..."
                      value={testNombre}
                      onChange={(e) => setTestNombre(e.target.value)}
                    />
                    <div className="hbox">
                      <button
                        className={`button-visible ${testVisible === 'sí' ? 'active green' : 'inactive'}`}
                        onClick={() => handleVisibleClick('sí')}
                      >
                        Sí
                      </button>
                      <button
                        className={`button-visible ${testVisible === 'no' ? 'active red' : 'inactive'}`}
                        onClick={() => handleVisibleClick('no')}
                      >
                        No
                      </button>
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
              </button>
              <button className="button" onClick={handleEliminarClick}>
                <span>Eliminar</span>
              </button>
              <button className="button" onClick={handleGuardarClick}>
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;