import React, { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { expenses } = useContext(ExpenseContext);

    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthExpense = expenses
        .filter((item) => {
            const d = new Date(item.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const categorySummary = expenses.reduce((acc, item) => {
        acc[item.category] =
            (acc[item.category] || 0) + Number(item.amount);
        return acc;
    }, {});

    const data = {
        labels: Object.keys(categorySummary),
        datasets: [
            {
                label: "Expenses by Category",
                data: Object.values(categorySummary),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40"
                ]
            }
        ]
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <h3>Total Expense: {totalExpense} บาท</h3>

            <div className="summary-container">

                <div className="summary-card">
                    <h3>Total Expense</h3>
                    <p>{totalExpense.toLocaleString()} ฿</p>
                </div>

                <div className="summary-card">
                    <h3>This Month</h3>
                    <p>{thisMonthExpense.toLocaleString()} ฿</p>
                </div>

                <div className="summary-card">
                    <h3>Categories</h3>
                    {Object.entries(categorySummary).map(([cat, total]) => (
                        <p key={cat}>
                            {cat}: {total.toLocaleString()} ฿
                        </p>
                    ))}
                </div>

            </div>

            {expenses.length === 0 ? (
                <p>No data to display</p>
            ) : (
                <>
                    <div style={{ width: "400px" }}>
                        <Pie data={data} />
                    </div>
                    <h3>Summary by Category</h3>

                    <ul>
                        {Object.entries(categorySummary).map(([cat, amount]) => (
                            <li key={cat}>
                                {cat} : {amount} บาท
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Dashboard;