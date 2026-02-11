import React, { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

const Home = () => {
    const { expenses, deleteExpense } = useContext(ExpenseContext);

    return (
        <div>
            <h2>Expense List</h2>

            {expenses.length === 0 && <p>No expenses added yet</p>}

            <ul>
                {expenses.map((item) => (
                    <li key={item.id}>
                        {item.date} - {item.category} - {item.amount} บาท
                        <button onClick={() => deleteExpense(item.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;