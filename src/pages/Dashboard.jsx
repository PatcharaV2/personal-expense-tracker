import { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
import {
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

import { Line } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {

    const { expenses } = useContext(ExpenseContext);

    const now = new Date();

    const [selectedYear, setSelectedYear] = useState(
        now.getFullYear()
    );

    const [selectedPieYear, setSelectedPieYear] = useState(
        now.getFullYear()
    );

    const [selectedPieMonth, setSelectedPieMonth] = useState(
        now.getMonth()
    );

    const filteredPieExpenses = expenses.filter((item) => {
        const d = new Date(item.date);
        return (
            d.getFullYear() === selectedPieYear &&
            d.getMonth() === selectedPieMonth
        );
    });

    const filteredByYear = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === selectedYear;
    });

    const monthlyTotals = Array(12).fill(0);

    filteredByYear.forEach((e) => {
        const month = new Date(e.date).getMonth(); // 0-11
        monthlyTotals[month] += Number(e.amount);
    });


    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const years = [
        ...new Set(
            expenses.map(e => new Date(e.date).getFullYear())
        )
    ].sort((a, b) => b - a);



    // 1. คำนวณยอดรวมทั้งหมด
    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    // 2. คำนวณยอดของเดือนปัจจุบัน
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthExpense = expenses
        .filter((item) => {
            const d = new Date(item.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);

    // 3. รวมยอดเงินตาม category
    const totalsByCategory = filteredPieExpenses.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
        return acc;
    }, {});

    // 4. เตรียมข้อมูลสำหรับ chart
    const chartLabels = Object.keys(totalsByCategory);
    const chartData = Object.values(totalsByCategory);

    // 5. ฟังก์ชันสร้างสี
    const generateColor = (index) => {
        const colors = [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#8BC34A",
            "#E91E63",
            "#00BCD4",
            "#FFC107"
        ];

        return colors[index % colors.length];
    };

    const chartColors = chartLabels.map((_, index) =>
        generateColor(index)
    );

    const pieData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartData,
                backgroundColor: chartLabels.map((_, index) =>
                    generateColor(index)
                ),
            },
        ],
    };


    const lineData = {
        labels: monthNames,
        datasets: [
            {
                label: `Spending ${selectedYear}`,
                data: monthlyTotals,
                borderColor: "#36A2EB",
                backgroundColor: "#36A2EB",
                tension: 0.3,
            },
        ],
    };

    // รวมยอด category ทั้งหมดทุกปี
    const totalsByCategoryAll = expenses.reduce((acc, item) => {
        acc[item.category] =
            (acc[item.category] || 0) + Number(item.amount);
        return acc;
    }, {});


    return (
        <div>
            <h2>Dashboard</h2>

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
                    <h3>Categories (All Time)</h3>
                    {Object.keys(totalsByCategoryAll).length === 0 && (
                        <p>No data</p>
                    )}
                    {Object.keys(totalsByCategoryAll).map((cat) => (
                        <p key={cat}>
                            {cat}: {totalsByCategoryAll[cat].toLocaleString()} ฿
                        </p>
                    ))}

                </div>

            </div>
            <h3>Spending Trend - {selectedYear}</h3>

            <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            <div style={{ width: "700px", marginTop: "20px" }}>
                <Line data={lineData} />
            </div>
            <h3>Total by Category - {monthNames[selectedPieMonth]} {selectedPieYear}</h3>

            <div style={{ marginBottom: "15px" }}>
                <select
                    value={selectedPieYear}
                    onChange={(e) => setSelectedPieYear(Number(e.target.value))}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedPieMonth}
                    onChange={(e) => setSelectedPieMonth(Number(e.target.value))}
                    style={{ marginLeft: "10px" }}
                >
                    {monthNames.map((month, index) => (
                        <option key={month} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
            {filteredPieExpenses.length === 0 ? (
                <p>No data to display</p>
            ) : (
                <>
                    <div style={{ width: "100%", maxWidth: "400px", margin: "20px auto" }}>
                        <Pie data={pieData} />
                    </div>
                </>
            )}

            <ul>
                {chartLabels.map((cat, index) => (
                    <li key={cat}>
                        <span
                            style={{
                                display: "inline-block",
                                width: "12px",
                                height: "12px",
                                backgroundColor: chartColors[index],
                                marginRight: "8px",
                            }}
                        ></span>

                        {cat}: {totalsByCategory[cat].toLocaleString()} บาท
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
