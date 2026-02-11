import React from 'react'
import App from './App.jsx'
import { ExpenseProvider } from "./context/ExpenseContext";
import { createRoot } from 'react-dom/client';
import "./styles/style.css";


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExpenseProvider>
      <App />
    </ExpenseProvider>
  </React.StrictMode>
)
