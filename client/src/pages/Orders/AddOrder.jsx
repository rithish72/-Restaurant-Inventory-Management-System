import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const AddOrder = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [newOrder, setNewOrder] = useState({
        orderNumber: "",
        items: "",
        supplier: "",
        status: "",
        deliveryDate: "",
        notes: "",
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    const handleAddOrder = async () => {
        const { orderNumber, items, supplier, status, deliveryDate, notes } =
            newOrder;

        if (
            !orderNumber.trim() ||
            !items.trim() ||
            !supplier.trim() ||
            !status.trim() ||
            !deliveryDate ||
            !notes.trim()
        ) {
            return toast.error("Please fill in all fields");
        }

        try {
            await api.post("/api/v1/orders/add-orders", newOrder);

            toast.success("Order added successfully!");

            setNewOrder({
                orderNumber: "",
                items: "",
                supplier: "",
                status: "",
                deliveryDate: "",
                notes: "",
            });

            navigate("/order");

        } catch (error) {
            console.error("Error adding order:", error);

            const errorMsg =
                error.response?.data?.message ||
                "Failed to add order. Please try again.";
            toast.error(errorMsg);
        }
    };

    return (
        <div>
            <div
                className={`card mb-5 p-4 ${darkMode ? "dark-card-bg" : "card-bg"} animate-in`}
            >
                <h5 className="mb-3 fw-semibold">➕ Add New Order</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Order Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="orderNumber"
                            placeholder="e.g. ORD-1001"
                            value={newOrder.orderNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Items (comma separated)
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="items"
                            placeholder="e.g. Tomato, Milk"
                            value={newOrder.items}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Supplier
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="supplier"
                            placeholder="e.g. FreshFarms"
                            value={newOrder.supplier}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={newOrder.status}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Delivery Date
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            name="deliveryDate"
                            value={newOrder.deliveryDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Notes</label>
                        <textarea
                            className="form-control"
                            name="notes"
                            rows="1"
                            placeholder="Additional notes"
                            value={newOrder.notes || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-success mt-4 w-100 fw-bold"
                    onClick={handleAddOrder}
                >
                    ➕ Add Order
                </button>
            </div>
        </div>
    );
};

export default AddOrder