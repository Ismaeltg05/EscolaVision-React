import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center space-x-4 p-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo w-16 h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react w-16 h-16" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold underline text-center">Vite + React</h1>
      <div className="card flex flex-col items-center p-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-center mt-4">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App