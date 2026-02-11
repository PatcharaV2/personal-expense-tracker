import React, { createContext, useState, useEffect } from "react";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("expenses");
        if (stored) {
            setExpenses(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }, [expenses]);

    const addExpense = (expense) => {
        setExpenses([...expenses, { id: Date.now(), ...expense }]);
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter((item) => item.id !== id));
    };

    const filterByDate = (start, end) => {
        return expenses.filter((item) => {
            const date = new Date(item.date);
            return date >= new Date(start) && date <= new Date(end);
        });
    };

    const updateExpense = (id, updateData) =>{
        setExpenses(
            expenses.map((item) =>
                item.id === id ? {...item, ...updateData} : item
            )
        );
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                addExpense,
                deleteExpense,
                filterByDate,
                updateExpense,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};
