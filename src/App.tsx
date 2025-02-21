import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center space-x-4 p-4">
        <img src="/src/assets/escolavision.png" alt="EscolaVision Logo" className="h-64" />
      </div>
      <h1 className="text-3xl font-bold underline text-center">EscolaVision</h1>
      <h3 className="text-2xl text-center">Tu App de Orientación Escolar</h3>
      <div className="card flex flex-col items-center p-4">
        
        {/* <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="read-the-docs text-center mt-4">
        Click on the Vite and React logos to learn more
      </p>*/}
      </div>
    </>
  )
}

export default App