import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";

const EditExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { expenses, updateExpense, deleteExpense } = useContext(ExpenseContext);

    const expense = expenses.find((e) => e.id === Number(id));

    const [form, setForm] = useState({
        amount: "",
        category: "",
        date: "",
        note: ""
    });

    useEffect(() => {
        if (expense) {
            setForm(expense);
        }
    }, [expense]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.amount || !form.date) {
            alert("Please fill required fields");
            return;
        }
        updateExpense(expense.id, form);

        navigate("/");
    };

    const handleBack = () => {
        navigate(-1);
    }

    const handleDelete = () => {
        if (window.confirm("Are you sure to delete this expense?")) {
            deleteExpense(expense.id);
            navigate("/");
        }
    };


    if (!expense) {
        return <p>Expense not found</p>;
    }

    return (
        <div>
            <h2>Edit Expense</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
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
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Note:</label>
                    <input
                        type="text"
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ marginTop: "15px" }} >
                    <button type="submit">Update</button>
                    <button type="button" className="delete-btn" onClick={handleDelete}>Delete</button>
                    <button type="button" className="back-btn" onClick={handleBack}>Back</button>
                </div>

            </form>
        </div>
    );
};

export default EditExpense;
