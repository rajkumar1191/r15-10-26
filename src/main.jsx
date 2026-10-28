import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


/*
React -> Open source JavaScript library for building dynamic and interactive User Interfaces(UIs)

Features of React:
1. Virtual DOM -> Diffing Algorithm
2. Reusable Components
3. One way data binding

JSX - Extension to Javascript



*/