import React from 'react'
import App from './App.jsx'
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { createRoot } from 'react-dom/client';
import "./styles/style.css";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ExpenseProvider>
        <App />
      </ExpenseProvider>
    </AuthProvider>

  </React.StrictMode>
)
