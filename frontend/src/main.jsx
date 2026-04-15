import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 1. Importamos el enrutador principal
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolvemos nuestra App dentro del BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)