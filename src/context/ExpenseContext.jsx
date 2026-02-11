import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState(() => {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    });

    const { currentUser } = useContext(AuthContext);

    const userExpenses = expenses.filter(
        (e) => e.userId === currentUser?.username
    );

    useEffect(() => {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }, [expenses]);

    const addExpense = (expense) => {
        if (!currentUser) return;

        const newExpense = {
            ...expense,
            id: Date.now(),
            userId: currentUser.username,
            date: expense.date || new Date().toISOString()
        };


        setExpenses([...expenses, newExpense]);
    };


    const deleteExpense = (id) => {
        setExpenses(expenses.filter((item) => item.id !== id));
    };

    const filterByDate = (start, end) => {
        return userExpenses.filter((item) => {
            const date = new Date(item.date);
            return date >= new Date(start) && date <= new Date(end);
        });
    };


    const updateExpense = (id, updateData) => {
        setExpenses(
            expenses.map((item) =>
                item.id === id ?
                    { ...item, ...updateData, userId: item.userId }
                    : item
            )
        );
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses: userExpenses,
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
