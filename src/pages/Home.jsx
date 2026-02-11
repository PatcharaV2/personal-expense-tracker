import React, { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

const Home = () => {
    const { expenses, deleteExpense } = useContext(ExpenseContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortType, setSortType] = useState("date");

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
                    <li key={item.id}>
                        {item.date} - {item.category} - {item.amount} บาท
                        <button className="delete-button" onClick={() => deleteExpense(item.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;