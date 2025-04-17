import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./Dashboard.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [inventoryStats, setInventoryStats] = useState({
        totalItems: 0,
        lowStockItems: [],
        recentOrders: [],
        topSuppliers: [],
    });

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/dashboard")
            .then((res) => setInventoryStats(res.data))
            .catch(console.error);

        const observer = new MutationObserver(() => {
            setDarkMode(document.body.classList.contains("dark-mode"));
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });
        setDarkMode(document.body.classList.contains("dark-mode"));

        return () => observer.disconnect();
    }, []);

    const { totalItems, lowStockItems, recentOrders, topSuppliers } =
        inventoryStats;

    const chartTextColor = darkMode ? "#fff" : "#000";
    const chartGridColor = darkMode ? "#aaa" : "#ccc";

    const barData = useMemo(
        () => ({
            labels: lowStockItems.map((item) => item.name),
            datasets: [
                {
                    label: "Quantity",
                    data: lowStockItems.map((item) => item.quantity),
                    backgroundColor: "#f39c12",
                },
            ],
        }),
        [lowStockItems]
    );

    const pieData = useMemo(
        () => ({
            labels: topSuppliers.map((s) => s.name),
            datasets: [
                {
                    label: "Orders",
                    data: topSuppliers.map((s) => s.totalOrders),
                    backgroundColor: [
                        "#0088FE",
                        "#00C49F",
                        "#FFBB28",
                        "#FF8042",
                    ],
                },
            ],
        }),
        [topSuppliers]
    );

    const barOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: { labels: { color: chartTextColor } },
                title: { display: false },
            },
            scales: {
                x: {
                    ticks: { color: chartTextColor },
                    grid: { color: chartGridColor },
                },
                y: {
                    ticks: { color: chartTextColor },
                    grid: { color: chartGridColor },
                },
            },
        }),
        [chartTextColor, chartGridColor]
    );

    const pieOptions = useMemo(
        () => ({
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: chartTextColor },
                },
            },
        }),
        [chartTextColor]
    );

    return (
        <div className="container-db">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h2
                    className={`mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"} animate-in`}
                >
                    📊 Dashboard Overview
                </h2>

                <div className="row animate-in">
                    {[
                        {
                            title: "Total Inventory Items",
                            value: totalItems,
                            bg: "bg-success",
                        },
                        {
                            title: "Low Stock Items",
                            value: lowStockItems.length,
                            bg: "bg-warning",
                        },
                    ].map((card, i) => (
                        <div className="col-md-4 animate-in" key={i}>
                            <div className={`card text-white ${card.bg} mb-3`}>
                                <div className="card-body">
                                    <h5 className="card-title">{card.title}</h5>
                                    <p className="card-text fs-2">
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="col-md-4 animate-in">
                        <div className="card text-white bg-info mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Recent Orders</h5>
                                <ul className="list-group list-group-flush">
                                    {recentOrders.map((order, idx) => (
                                        <li
                                            key={idx}
                                            className="list-group-item"
                                        >
                                            {order.name} - {order.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 animate-in">
                    <h4
                        className={`fw-bold ${darkMode ? "text-white" : "text-dark"}`}
                    >
                        🚚 Top Suppliers
                    </h4>
                    <ul className="list-group">
                        {topSuppliers.map((supplier, idx) => (
                            <li key={idx} className="list-group-item">
                                {supplier.name} - {supplier.totalOrders} orders
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="row mt-5 animate-in">
                    <div className="col animate-in">
                        <h5 className={darkMode ? "text-white" : "text-dark"}>
                            📉 Low Stock Items
                        </h5>
                        <Bar data={barData} options={barOptions} />
                    </div>
                    <div className="col animate-in pie-chart">
                        <h5 className={darkMode ? "text-white" : "text-dark"}>
                            🥧 Top Suppliers
                        </h5>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
