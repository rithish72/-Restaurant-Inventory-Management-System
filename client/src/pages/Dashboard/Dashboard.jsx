import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
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

const StatCard = ({ title, value, bg }) => (
    <div className="col-md-4 mb-3">
        <div className={`card text-white ${bg} h-100`}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 className="card-title">{title}</h5>
                <p className="card-text fs-2 m-0">{value}</p>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [inventoryStats, setInventoryStats] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        api.get("/api/v1/dashboard")
            .then((res) => setInventoryStats(res.data.data))
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

    const chartTextColor = darkMode ? "#fff" : "#000";
    const chartGridColor = darkMode ? "#aaa" : "#ccc";

    const barData = useMemo(() => {
        const lowStockItems = inventoryStats?.lowStockItems ?? [];

        if (!Array.isArray(lowStockItems) || lowStockItems.length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }

        const colors = ["#f39c12", "#e74c3c", "#1abc9c", "#8e44ad", "#3498db"];
        const labels = lowStockItems.map(
            (item, index) => item.itemName || item._id || `Item ${index + 1}`
        );
        const quantities = lowStockItems.map((item) => item.quantity || 0);
        const backgroundColors = labels.map(
            (_, index) => colors[index % colors.length]
        );

        return {
            labels,
            datasets: [
                {
                    label: "Low Stock Quantity",
                    data: quantities,
                    backgroundColor: backgroundColors,
                    borderRadius: 6,
                    barThickness: 40,
                },
            ],
        };
    }, [inventoryStats]);

    const pieData = useMemo(() => {
        if (!inventoryStats || !Array.isArray(inventoryStats.topSuppliers)) {
            return { labels: [], datasets: [] };
        }
        return {
            labels: inventoryStats.topSuppliers.map((s) => s.name),
            datasets: [
                {
                    label: "Orders",
                    data: inventoryStats.topSuppliers.map((s) => s.totalOrders),
                    backgroundColor: [
                        "#0088FE",
                        "#00C49F",
                        "#FFBB28",
                        "#FF8042",
                        "#A28EFF",
                    ],
                },
            ],
        };
    }, [inventoryStats]);

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

    if (!inventoryStats) {
        return (
            <div className="container-db text-center py-5">
                <p className={darkMode ? "text-white" : "text-dark"}>
                    Loading Dashboard...
                </p>
            </div>
        );
    }

    const {
        totalItems,
        lowStockItems = [],
        recentOrders = [],
        topSuppliers = [],
    } = inventoryStats;

    return (
        <div className="container-db">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h2
                    className={`mb-3 fw-bold ${darkMode ? "text-white" : "text-dark"} animate-in`}
                >
                    Dashboard Overview
                </h2>

                <div className="row animate-in">
                    <StatCard
                        title="Total Inventory Items"
                        value={totalItems}
                        bg="bg-success"
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={
                            Array.isArray(lowStockItems)
                                ? lowStockItems.length
                                : 0
                        }
                        bg="bg-warning"
                    />
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-info h-100">
                            <div className="card-body">
                                <h5 className="card-title">Recent Orders</h5>
                                {recentOrders.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {recentOrders.map((order, idx) => (
                                            <li
                                                key={idx}
                                                className="list-group-item"
                                                style={{ color: "white" }}
                                            >
                                                {order.name} - {order.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-2">No recent orders</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 animate-in">
                    <h4
                        className={`fw-bold ${darkMode ? "text-white" : "text-dark"}`}
                    >
                        Top Suppliers
                    </h4>
                    {topSuppliers.length > 0 ? (
                        <ul className="list-group">
                            {topSuppliers.map((supplier, idx) => (
                                <li key={idx} className="list-group-item">
                                    {supplier.name} - {supplier.totalOrders}{" "}
                                    orders
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-2">No supplier data</p>
                    )}
                </div>

                <div className="row mt-5 animate-in">
                    <div className="col-lg-6 col-sm-12 mb-4">
                        <h5 className={darkMode ? "text-white" : "text-dark"}>
                            Low Stock Items
                        </h5>
                        {barData.labels.length > 0 ? (
                            <Bar data={barData} options={barOptions} />
                        ) : (
                            <p
                                className={
                                    darkMode ? "text-white" : "text-dark"
                                }
                            >
                                No low stock item data available.
                            </p>
                        )}
                    </div>
                    <div className="col-lg-6 col-sm-12 mb-4">
                        <h5 className={darkMode ? "text-white" : "text-dark"}>
                            Top Suppliers
                        </h5>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
