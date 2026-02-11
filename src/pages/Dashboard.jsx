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

    const total = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const categorySummary = {};

    expenses.forEach((item) => {
        if (!categorySummary[item.category]) {
            categorySummary[item.category] = 0;
        }
        categorySummary[item.category] += Number(item.amount);
    });

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

            <h3>Total Expense: {total} บาท</h3>

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