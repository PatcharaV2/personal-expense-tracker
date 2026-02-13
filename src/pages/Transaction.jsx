import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { Link } from "react-router-dom";
import { UndoContext } from "../context/UndoContext";

const Transaction = () => {
    const { expenses, deleteExpense, deleteAllExpenses, restoreExpense } = useContext(ExpenseContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortType, setSortType] = useState("last");
    const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { triggerUndo } = useContext(UndoContext);

    const filteredExpenses = expenses.filter((item) => {
        if (!startDate || !endDate) return true;

        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        switch (sortType) {
            case "amount-desc":
                return b.amount - a.amount;
            case "amount-asc":
                return a.amount - b.amount;
            case "date-asc":
                return new Date(a.date) - new Date(b.date);

            case "date-desc":
                return new Date(b.date) - new Date(a.date);

            case "last":
                return b.id - a.id;

            default:
                return new Date(b.date) - new Date(a.date);
        }
    });

    const filteredTotal = sortedExpenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );



    const exportCSV = () => {
        if (sortedExpenses.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = ["Date", "Category", "Amount", "Description"];

        const rows = sortedExpenses.map(item => [
            formatDateTime(item.date),
            item.category,
            item.amount,
            item.description
        ]);


        let csvContent =
            headers.join(",") +
            "\n" +
            rows.map(row => row.map(text => `"${text}"`).join(",")).join("\n");

        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "expenses.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const confirmDelete = () => {
        const itemToDelete = expenses.find(e => e.id === selectedId);
        deleteExpense(selectedId);

        triggerUndo(itemToDelete);

        setShowConfirm(false);
    };


    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };


    return (
        <div>
            <h2>Expense List</h2>

            <button className="export-btn" onClick={exportCSV} style={{ marginBottom: "10px" }}>
                Export CSV
            </button>

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
                    <option value="date-desc">Newest Date</option>
                    <option value="date-asc">Oldest Date</option>
                    <option value="amount-desc">Amount (High → Low)</option>
                    <option value="amount-asc">Amount (Low → High)</option>
                    <option value="last">Last Added</option>
                </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <button
                    className="delete-btn-all"
                    onClick={() => setShowDeleteAllConfirm(true)}
                    disabled={expenses.length === 0}
                >
                    Delete All Expenses
                </button>
            </div>
            {sortedExpenses.length === 0 && <p>No expenses found</p>}
            {sortedExpenses.length > 0 && (
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedExpenses.map((item) => (
                            <tr key={item.id}>
                                <td>{formatDate(item.date)}</td>
                                <td>{item.category}</td>
                                <td>{item.description}</td>
                                <td>{item.amount} ฿</td>

                                <td>
                                    <Link to={`/edit/${item.id}`}>
                                        <button className="edit">Edit</button>
                                    </Link>

                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            setSelectedId(item.id);
                                            setShowConfirm(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="filtered-total">
                <h3>
                    Total (Filtered): {filteredTotal.toLocaleString()} ฿
                </h3>
            </div>

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
            {showDeleteAllConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{width: "340px"}}>
                        <h3>Confirm Delete All</h3>
                        <p>Are you sure you want to delete ALL expenses?</p>
                        <p>You will be able to undo within 10 seconds.</p>

                        <div className="modal-actions">
                            <button
                                className="confirm-btn"
                                onClick={() => {
                                    const allItems = [...expenses];
                                    deleteAllExpenses();
                                    triggerUndo(allItems);
                                    setShowDeleteAllConfirm(false);
                                }}
                            >
                                Yes, Delete All
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteAllConfirm(false)}
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

export default Transaction;