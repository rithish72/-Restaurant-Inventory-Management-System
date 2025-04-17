import React, { useState, useEffect, useRef } from "react";
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
        quantities: "",
        supplier: "",
        status: "",
        deliveryDate: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const orderNumberRef = useRef(null);

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

    useEffect(() => {
        if (orderNumberRef.current) {
            orderNumberRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddOrder = async () => {
        const orderItems = newOrder.items
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);

        const quantities = newOrder.quantities
            .split(",")
            .map((quantity) => quantity.trim())
            .filter((quantity) => quantity);

        if (orderItems.length !== quantities.length) {
            return toast.error("Items and quantities must match.");
        }

        const formattedItems = orderItems.map((item, index) => ({
            item: item,
            quantity: quantities[index],
        }));

        const trimmedOrder = {
            orderNumber: newOrder.orderNumber.trim(),
            items: formattedItems,
            supplier: newOrder.supplier.trim(),
            status: newOrder.status.trim(),
            deliveryDate: newOrder.deliveryDate,
        };

        if (newOrder.notes.trim()) {
            trimmedOrder.notes = newOrder.notes.trim();
        }

        const { orderNumber, items, supplier, status, deliveryDate } =
            trimmedOrder;

        if (
            !orderNumber ||
            !items.length ||
            !supplier ||
            !status ||
            !deliveryDate
        ) {
            return toast.error("Please fill in all required fields.");
        }

        setLoading(true);
        try {
            await api.post("/api/v1/orders/add-order", trimmedOrder);

            toast.success("Order added successfully!");

            setNewOrder({
                orderNumber: "",
                items: "",
                quantities: "",
                supplier: "",
                status: "",
                deliveryDate: "",
                notes: "",
            });

            navigate("/orders");
        } catch (error) {
            console.error("Error adding order:", error);
            const errorMsg =
                error.response?.data?.message ||
                "Failed to add order. Please try again.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container mt-0">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h5 className="mb-3 fw-semibold animate-in">Add New Order</h5>
                <div className="row g-3 animate-in">
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
                            ref={orderNumberRef}
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
                            Quantities (comma separated)
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="quantities"
                            placeholder="e.g. 10, 5"
                            value={newOrder.quantities}
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
                        <label className="form-label fw-semibold">
                            Notes <span className="text-muted">(Optional)</span>
                        </label>
                        <textarea
                            className="form-control"
                            name="notes"
                            rows="1"
                            placeholder="Additional notes"
                            value={newOrder.notes}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-success mt-4 w-100 fw-bold"
                    onClick={handleAddOrder}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Order"}
                </button>
            </div>
        </div>
    );
};

export default AddOrder;
