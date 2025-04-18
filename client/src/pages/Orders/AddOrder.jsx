import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const AddOrder = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [newOrder, setNewOrder] = useState({
        orderNumber: "",
        items: [{ item: "", quantity: "" }],
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
        setNewOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...newOrder.items];
        updatedItems[index][field] = value;
        setNewOrder((prev) => ({ ...prev, items: updatedItems }));
    };

    const addItem = () => {
        setNewOrder((prev) => ({
            ...prev,
            items: [...prev.items, { item: "", quantity: "" }],
        }));
    };

    const removeItem = (index) => {
        const updatedItems = [...newOrder.items];
        updatedItems.splice(index, 1);
        setNewOrder((prev) => ({ ...prev, items: updatedItems }));
    };

    const validateForm = () => {
        const { orderNumber, items, supplier, status, deliveryDate } = newOrder;
        return (
            orderNumber.trim() &&
            supplier.trim() &&
            status.trim() &&
            deliveryDate &&
            items.every((i) => i.item.trim() && i.quantity)
        );
    };

    const handleAddOrder = async () => {
        if (!validateForm()) {
            return toast.error("Please fill in all required fields.");
        }

        const formattedOrder = {
            orderNumber: newOrder.orderNumber.trim(),
            items: newOrder.items.map((i) => ({
                item: i.item.trim(),
                quantity: Number(i.quantity),
            })),
            supplier: newOrder.supplier.trim(),
            status: newOrder.status,
            deliveryDate: newOrder.deliveryDate,
            notes: newOrder.notes.trim(),
        };

        setLoading(true);
        try {
            await api.post("/api/v1/orders/add-order", formattedOrder);
            toast.success("Order added successfully!");
            navigate("/orders");
        } catch (error) {
            console.error("Error adding order:", error);
            toast.error("Failed to add order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-db">
            <div
                className={`container-db ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <div className="dashboard-container mt-4 p-4">
                    <h4
                        className={`fw-bold text-center ${darkMode ? "text-white" : "text-dark"}`}
                    >
                        Add New Order
                    </h4>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Order Number
                            </label>
                            <input
                                type="text"
                                name="orderNumber"
                                className="form-control"
                                placeholder="e.g. ORD-1001"
                                value={newOrder.orderNumber}
                                onChange={handleInputChange}
                                ref={orderNumberRef}
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-semibold">
                                Items
                            </label>
                            {newOrder.items.map((itemObj, index) => (
                                <div className="row g-2 mb-3" key={index}>
                                    <div className="col-md-5">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Item name"
                                            value={itemObj.item}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "item",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Quantity"
                                            value={itemObj.quantity}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <button
                                            type="button"
                                            className="btn btn-danger w-100"
                                            onClick={() => removeItem(index)}
                                            disabled={
                                                newOrder.items.length === 1
                                            }
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline-primary mt-2"
                                onClick={addItem}
                            >
                                + Add Item
                            </button>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Supplier
                            </label>
                            <input
                                type="text"
                                name="supplier"
                                className="form-control"
                                placeholder="e.g. FreshFarms"
                                value={newOrder.supplier}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Status
                            </label>
                            <select
                                name="status"
                                className="form-select"
                                value={newOrder.status}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Delivery Date
                            </label>
                            <input
                                type="date"
                                name="deliveryDate"
                                className="form-control"
                                value={newOrder.deliveryDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                className="form-control"
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
                        {loading ? "Processing..." : "Add Order"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddOrder;
