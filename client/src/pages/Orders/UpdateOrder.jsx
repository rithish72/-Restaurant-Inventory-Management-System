import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateOrder = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState({
        orderNumber: "",
        items: "",
        supplier: "",
        status: "",
        deliveryDate: "",
        notes: "",
    });

    const navigate = useNavigate();
    const { id } = useParams();

    // Dark mode observer
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

    // Fetch Order if editing
    useEffect(() => {
        if (id) {
            const fetchOrder = async () => {
                try {
                    const response = await api.get(
                        `/api/v1/order/get-order/${id}`
                    );
                    if (response.data?.data) {
                        setUpdatedOrder({ ...response.data.data, _id: id });
                    }
                } catch (error) {
                    console.error("Error fetching item:", error);
                    alert("Failed to fetch item data");
                }
            };

            fetchOrder();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOrder((prev) => ({ ...prev, [name]: value }));
    };

    // Submit form
    const handleSubmit = async () => {
        const { itemName, category, quantity, unit, threshold, _id } =
            updatedOrder;

        if (!itemName || !category || !quantity || !unit || !threshold) {
            alert("Please fill all the fields.");
            return;
        }

        try {
            if (_id) {
                await api.put(
                    `/api/v1/inventory/update-inventory-item/${_id}`,
                    {
                        itemName,
                        category,
                        quantity: Number(quantity),
                        unit,
                        threshold: Number(threshold),
                    }
                );
                alert("Item updated successfully!");
            } else {
                await api.post("/api/v1/inventory/add-inventory-item", {
                    itemName,
                    category,
                    quantity: Number(quantity),
                    unit,
                    threshold: Number(threshold),
                });
                alert("Item added successfully!");
            }

            navigate("/inventory_list");
        } catch (error) {
            console.error(
                _id ? "Error updating item:" : "Error adding item:",
                error
            );
            alert(_id ? "Failed to update item" : "Failed to add item");
        }
    };

    return (
        <div className="container-db">
            <div
                className={`dashboard-container mt-4 ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h4 className="fw-bold mb-4 text-center">
                    Update Inventory Item
                </h4>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Item Name
                        </label>
                        <input
                            type="text"
                            name="itemName"
                            className="form-control"
                            placeholder="e.g. Tomato"
                            value={updatedOrder.itemName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Category
                        </label>
                        <select
                            name="category"
                            className="form-select"
                            value={updatedOrder.category}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Meat">Meat</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Quantity
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            className="form-control"
                            placeholder="e.g. 10"
                            value={updatedOrder.quantity}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Unit</label>
                        <input
                            type="text"
                            name="unit"
                            className="form-control"
                            placeholder="e.g. kg, L, pcs"
                            value={updatedOrder.unit}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Threshold
                        </label>
                        <input
                            type="number"
                            name="threshold"
                            className="form-control"
                            placeholder="e.g. 5"
                            value={updatedOrder.threshold}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button
                    className="btn btn-success mt-4 w-100 fw-bold"
                    onClick={handleSubmit}
                >
                    Update Item
                </button>
            </div>
        </div>
    );
};

export default UpdateOrder;
