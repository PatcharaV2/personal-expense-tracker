import React from 'react'
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import { ExpenseProvider } from "./context/ExpenseContext";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExpenseProvider>
      <App />
    </ExpenseProvider>
  </React.StrictMode>
)
