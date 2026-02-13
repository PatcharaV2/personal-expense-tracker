import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";
import { CategoryContext } from "../context/CategoryContext";

const AddExpense = () => {
    const { addExpense } = useContext(ExpenseContext);
    const { categories, addCategory } = useContext(CategoryContext);

    const navigate = useNavigate();

    const [form, setForm] = useState({
        amount: "",
        category: "",
        date: "",
        description: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.amount || !form.date || !form.category) {
            alert("Please fill amount, date and category");
            return;
        }

        addExpense(form);
        navigate("/");
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            alert("Please enter category name");
            return;
        }

        addCategory(newCategory);

        setForm({
            ...form,
            category: newCategory
        });

        setNewCategory("");
        setShowModal(false);
    };

    return (
        <div>
            <h2>Add Expense</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Description: </label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

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
                    <label>Date: </label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
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
                        <option value="">-- Select Category --</option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        style={{ marginLeft: "10px" }}
                    >
                        + Category
                    </button>
                </div>

                <button className="save-btn" type="submit">Save Expense</button>
            </form>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Create New Category</h3>

                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter category name"
                        />

                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleAddCategory}>
                                Save
                            </button>

                            <button className="edit" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddExpense;
