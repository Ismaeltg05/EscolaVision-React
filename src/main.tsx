import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Menu from './components/Menu.tsx'

createRoot(document.getElementById('root')!).render(
  <div className="bg-[#AED6F1] min-h-screen">
  <StrictMode>
      <Menu />
      <App />
  </StrictMode>,
  </div>
)
