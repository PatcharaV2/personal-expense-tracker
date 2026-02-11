import { useContext } from "react";
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
    const totalsByCategory = expenses.reduce((acc, item) => {
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

    const data = {
        labels: chartLabels,
        datasets: [
            {
                data: chartData,
                backgroundColor: chartColors,
            },
        ],
    };

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
                    <h3>Categories</h3>
                    {chartLabels.length === 0 && <p>No data</p>}

                    {chartLabels.map((cat) => (
                        <p key={cat}>
                            {cat}: {totalsByCategory[cat].toLocaleString()} ฿
                        </p>
                    ))}
                </div>

            </div>

            <h3>Total by Category</h3>

            

            {expenses.length === 0 ? (
                <p>No data to display</p>
            ) : (
                <>
                    <div style={{ width: "400px", marginTop: "20px" }}>
                        <Pie data={data} />
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
