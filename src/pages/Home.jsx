import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { Link } from "react-router-dom";

const Home = () => {
    const { expenses, deleteExpense } = useContext(ExpenseContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortType, setSortType] = useState("date");

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const filteredExpenses = expenses.filter((item) => {
        if (!startDate || !endDate) return true;

        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (sortType === "amount") {
            return b.amount - a.amount;
        } else {
            return new Date(b.date) - new Date(a.date);
        }
    });

    const confirmDelete = () => {
        deleteExpense(selectedId);
        setShowConfirm(false);
    };

    return (
        <div>
            <h2>Expense List</h2>

            <div className="filter-box">
                <h4>Filter by Date</h4>

                <label>Start: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label> End: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <button
                    onClick={() => {
                        setStartDate("");
                        setEndDate("");
                    }}
                >
                    Clear Filter
                </button>
            </div>

            <div className="filter-box">
                <h4>Sort By</h4>

                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                </select>
            </div>

            {sortedExpenses.length === 0 && <p>No expenses found</p>}

            <ul>
                {sortedExpenses.map((item) => (
                    <div key={item.id} className="expense-card">
                        <div>
                            <b>{item.note}</b> – {item.amount} บาท
                            <br />
                            <small>{item.date}</small>
                        </div>

                        <div>
                            <Link to={`/edit/${item.id}`}>
                                <button className="edit">Edit</button>
                            </Link>

                            <button className="delete-btn"
                                onClick={() => {
                                    setSelectedId(item.id);
                                    setShowConfirm(true);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </ul>

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this expense?</p>

                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={confirmDelete}>
                                Yes, Delete
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;