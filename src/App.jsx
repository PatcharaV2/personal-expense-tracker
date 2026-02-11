import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import Dashboard from "./pages/Dashboard";
import EditExpense from "./pages/EditExpense";


const App = () => {
  return (
    <Router>
      <div className="container">
        <h1>Personal Expense Tracker</h1>

        <nav style={{ marginBottom: "20px"}}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/add">Add Expense</Link> |{" "}
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/:id" element={<EditExpense />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;