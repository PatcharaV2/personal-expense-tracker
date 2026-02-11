import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import EditExpense from "./pages/EditExpense";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UndoProvider } from "./context/UndoContext";
import UndoSnackbar from "./components/UndoSnackbar";
import { CategoryProvider } from "./context/CategoryContext";
import ManageCategories from "./pages/ManageCategories";



const AppContent = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <UndoSnackbar />
      <h1>Personal Expense Tracker</h1>

      {currentUser && (
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Home</Link>|{" "}
          <Link to="/add">Add Expense</Link> |{" "}
          <Link to="/categories">Categories</Link> | {" "}
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <span>👤 {currentUser.username}</span> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <ManageCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditExpense />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <CategoryProvider>
        <UndoProvider>
          <AppContent />
        </UndoProvider>
      </CategoryProvider>

    </Router>
  );
};

export default App;