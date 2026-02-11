import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { Link } from "react-router-dom";

const Home = () => {
    const { expenses, deleteExpense } = useContext(ExpenseContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortType, setSortType] = useState("last");

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

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


    const exportCSV = () => {
        if (sortedExpenses.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = ["Date", "Category", "Amount", "Note"];

        const rows = sortedExpenses.map(item => [
            formatDateTime(item.date),
            item.category,
            item.amount,
            item.note
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
        deleteExpense(selectedId);
        setShowConfirm(false);
    };

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString("th-Th");
    };

    return (
        <div>
            <h2>Expense List</h2>

            <button onClick={exportCSV} style={{ marginBottom: "10px" }}>
                Export CSV
            </button>

            <div className="filter-box">
                <h4>Filter by Date</h4>

                <label>Start: </label>
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label> End: </label>
                <input
                    type="datetime-local"
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

            {sortedExpenses.length === 0 && <p>No expenses found</p>}

            <ul>
                {sortedExpenses.map((item) => (
                    <div key={item.id} className="expense-card">
                        <div>
                            <b>{item.note}</b> – {item.amount} บาท
                            <br />
                            <small>{formatDateTime(item.date)}</small>
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