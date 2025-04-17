import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InventoryList.css";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const AddItem = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: "",
        category: "",
        quantity: "",
        unit: "",
        threshold: "",
        _id: "",
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
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddOrUpdateItem = async () => {
        const { itemName, category, quantity, unit, threshold } = newItem;

        // Validation check
        if (
            !itemName.trim() ||
            !category.trim() ||
            !quantity.toString().trim() ||
            !unit.trim() ||
            !threshold.toString().trim()
        ) {
            return toast.error("Please fill in all fields");
        }

        try {
            const payload = {
                itemName: itemName.trim(),
                category: category.trim(),
                quantity: Number(quantity),
                unit: unit.trim(),
                threshold: Number(threshold),
            };

            await api.post("/api/v1/inventory/add-inventory-item", payload);
            toast.success("Item added successfully!");

            // Reset form
            setNewItem({
                itemName: "",
                category: "",
                quantity: "",
                unit: "",
                threshold: "",
                _id: "",
            });

            navigate("/inventory_list");
        } catch (error) {
            console.error("Error adding/updating item:", error);
            const message =
                error.response?.data?.message || "Failed to save item";
            toast.error(message);
        }
    };

    return (
        <div>
            <div className="dashboard-container mt-4">
                <div
                    className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
                >
                    <h5 className="mb-3 fw-semibold animate-in">
                        Add New Item
                    </h5>
                    <div className="row g-3  animate-in">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Item Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="itemName"
                                placeholder="e.g. Tomato"
                                value={newItem.itemName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Category
                            </label>
                            <select
                                className="form-select"
                                name="category"
                                value={newItem.category}
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
                                className="form-control"
                                name="quantity"
                                placeholder="e.g. 5"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Unit
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="unit"
                                placeholder="e.g. kg, L, pcs"
                                value={newItem.unit}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Threshold
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="threshold"
                                placeholder="e.g. 10"
                                value={newItem.threshold}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="animate-in">
                        <button
                            className="btn mt-4 w-100 fw-bold btn-submit"
                            onClick={handleAddOrUpdateItem}
                        >
                            Add Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItem;
