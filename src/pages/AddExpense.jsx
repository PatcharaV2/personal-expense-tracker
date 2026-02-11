import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";

const AddExpense = () => {
    const { addExpense } = useContext(ExpenseContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        amount: "",
        category: "Food",
        date: "",
        note: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.amount || !form.date) {
            alert("Please fill amount and date");
            return;
        }

        addExpense(form);

        navigate("/");
    };

    return (
        <div>
            <h2>Add Expense</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount (บาท): </label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Category: </label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    >
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Date: </label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Note: </label>
                    <input
                        type="text"
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Save Expense</button>
            </form>
        </div>
    );
};

export default AddExpense;