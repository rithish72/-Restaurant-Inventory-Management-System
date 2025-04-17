import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/api/v1/orders/get-all-orders");
            setOrders(data?.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

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

    return (
        <div className="container-db">
            <div className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}>
                <h2 className={`text-center mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"}`}>
                    Orders List
                </h2>

                <div className="text-end mb-3">
                    <button
                        className="btn fw-semibold"
                        style={{ backgroundColor: "#fd7e14", color: "white" }}
                        onClick={() => navigate("/inventory_list/add-order")}
                    >
                        Add Order
                    </button>
                </div>

                {loading ? (
                    <div className="text-center animate-in">
                        <div className={`spinner-border ${darkMode ? "text-light" : ""}`} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="alert alert-info text-center animate-in">No orders found.</div>
                ) : (
                    <div className="table-responsive animate-in">
                        <table className={`table table-bordered table-hover rounded-3 overflow-hidden ${darkMode ? "table-dark text-light" : ""}`}>
                            <thead className={darkMode ? "table-secondary" : "table-primary"}>
                                <tr>
                                    <th>#</th>
                                    <th>Order No</th>
                                    <th>Supplier</th>
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
                                        <td>
                                            {order.supplier?.name || "Unknown"}
                                            <br />
                                            <small className="text-muted">{order.supplier?.email}</small>
                                        </td>
                                        <td>
                                            {order.items?.map((i, idx) => (
                                                <div key={idx}>
                                                    {i.item?.name || "Unknown"} - {i.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge px-3 py-2 rounded-pill fw-medium ${getStatusBadgeClass(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.deliveryDate
                                                ? new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                                                      year: "numeric",
                                                      month: "short",
                                                      day: "numeric",
                                                  })
                                                : "—"}
                                        </td>
                                        <td className="d-flex flex-wrap gap-2">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => navigate(`/inventory_list/update-order/${order._id}`)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
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
                )}
            </div>
        </div>
    );
};

export default Orders;
