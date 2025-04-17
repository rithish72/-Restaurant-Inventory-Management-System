import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(
        document.body.classList.contains("dark-mode")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDarkMode(document.body.classList.contains("dark-mode"));
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return darkMode;
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const darkMode = useDarkMode();
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/api/v1/orders/get-all-orders");
            setOrders(data?.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to fetch orders. Please try again later.");
            toast.error("Failed to fetch orders. Try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?"))
            return;

        try {
            await api.delete(`/api/v1/orders/delete-order/${orderId}`);
            toast.success("Order deleted successfully!");
            fetchOrders();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(error?.response?.data?.message || "Delete failed.");
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-warning text-dark";
            case "Cancelled":
                return "bg-danger";
            case "Processing":
                return "bg-info";
            default:
                return "bg-success";
        }
    };

    const renderOrderItems = (items = []) =>
        items.map((i, idx) => (
            <div key={idx}>
                {i.item?.name || "Unknown"} - {i.quantity}
            </div>
        ));

    const renderOrdersTable = () => (
        <div className="table-responsive animate-in">
            <table
                className={`table table-bordered table-hover ${darkMode ? "table-dark text-light" : ""}`}
            >
                <thead
                    className={darkMode ? "table-secondary" : "table-primary"}
                >
                    <tr>
                        <th>#</th>
                        <th>Order No</th>
                        <th>Supplier</th>
                        <th>Email</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Delivery Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.orderNumber}</td>
                            <td>{order.supplier?.name || "Unknown"}</td>
                            <td>{order.supplier?.email || "Unknown"}</td>
                            <td>{renderOrderItems(order.items)}</td>
                            <td>
                                <span
                                    className={`badge px-3 py-2 rounded-pill fw-medium ${getStatusBadgeClass(order.status)}`}
                                >
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                {order.deliveryDate
                                    ? new Date(
                                          order.deliveryDate
                                      ).toLocaleDateString("en-IN", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                      })
                                    : "—"}
                            </td>
                            <td className="d-flex flex-wrap gap-2">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                        navigate(
                                            `/orders/update-order/${order._id}`
                                        )
                                    }
                                >
                                    Update
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    title="Delete this order"
                                    onClick={() => handleDeleteOrder(order._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container-db">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h2
                    className={`text-center mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"}`}
                >
                    Orders List
                </h2>

                <div className="text-end mb-3">
                    <button
                        className="btn fw-semibold"
                        style={{ backgroundColor: "#fd7e14", color: "white" }}
                        onClick={() => navigate("/orders/add-order")}
                    >
                        Add Order
                    </button>
                </div>

                {loading ? (
                    <div className="text-center animate-in">
                        <div
                            className={`spinner-border ${darkMode ? "text-light" : ""}`}
                            role="status"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger text-center animate-in">
                        {error}
                        <button className="btn btn-link" onClick={fetchOrders}>
                            Retry
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="alert alert-info text-center animate-in">
                        No orders found.
                    </div>
                ) : (
                    renderOrdersTable()
                )}
            </div>
        </div>
    );
};

export default Orders;
