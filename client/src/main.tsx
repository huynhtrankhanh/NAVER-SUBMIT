import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UniFlowProvider } from './contexts/UniFlowContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UniFlowProvider>
        <App />
      </UniFlowProvider>
    </BrowserRouter>
  </React.StrictMode>,
)