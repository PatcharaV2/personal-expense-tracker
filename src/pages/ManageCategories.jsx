import { useState, useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { ExpenseContext } from "../context/ExpenseContext";

const ManageCategories = () => {
    const { categories, addCategory, deleteCategory, updateCategory } =
        useContext(CategoryContext);

    const { expenses } = useContext(ExpenseContext);
    const [sortType, setSortType] = useState("asc");

    const [newCat, setNewCat] = useState("");
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const startEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.name);
    };

    const checkDuplicate = (name, ignoreId = null) => {
        return categories.some(
            (c) =>
                c.name.toLowerCase() === name.toLowerCase() &&
                c.id !== ignoreId
        );
    };

    const getExpenseCount = (categoryName) => {
        return expenses.filter(
            (e) => e.category === categoryName
        ).length;
    };


    const handleSave = (id) => {
        if (!editName.trim()) return;

        if (checkDuplicate(editName, id)) {
            setErrorMsg("Category name already exists!");
            setShowError(true);
            return;
        }

        updateCategory(id, editName);
        setEditId(null);
        setEditName("");
    };

    const sortedCategories = [...categories].sort((a, b) => {
        if (sortType === "asc") {
            return a.name.localeCompare(b.name, "th");
        } else {
            return b.name.localeCompare(a.name, "th");
        }
    });


    const handleAdd = () => {
        if (!newCat.trim()) return;

        if (checkDuplicate(newCat)) {
            setErrorMsg("Category name already exists!");
            setShowError(true);
            return;
        }

        addCategory(newCat);
        setNewCat("");
    };

    const confirmDelete = () => {
        deleteCategory(deleteId);
        setDeleteId(null);
    };

    return (
        <div>
            <h2>Manage Categories</h2>

            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <label>Sort: </label>
                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                >
                    <option value="asc">A → Z / ก → ฮ</option>
                    <option value="desc">Z → A / ฮ → ก</option>
                </select>
            </div>


            <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="New category name"
            />

            <button onClick={handleAdd}>+ Add</button>

            {sortedCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: "10px" }}>
                    {editId === cat.id ? (
                        <>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />

                            <button className="save-btn" onClick={() => handleSave(cat.id)}>
                                Save
                            </button>

                            <button onClick={() => setEditId(null)}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <span>
                                {cat.name}
                                <small style={{ marginLeft: "5px", color: "gray" }}>
                                    ({getExpenseCount(cat.name)})
                                </small>
                            </span>


                            <button className="edit" onClick={() => startEdit(cat)}>
                                Edit
                            </button>

                            <button
                                className="delete-btn-all"
                                onClick={() => {
                                    if (getExpenseCount(cat.name) > 0) {
                                        setErrorMsg("Cannot delete category with existing expenses!");
                                        setShowError(true);
                                    } else {
                                        setDeleteId(cat.id);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ))}
            {deleteId && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this category?</p>

                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={confirmDelete}>
                                Yes, Delete
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showError && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Error</h3>
                        <p>{errorMsg}</p>

                        <button
                            className="cancel-btn"
                            onClick={() => setShowError(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
