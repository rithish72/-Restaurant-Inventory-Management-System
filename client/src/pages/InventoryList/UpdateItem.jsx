import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InventoryList.css";
import { toast } from "react-toastify";

const UpdateItem = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [updatedItem, setUpdatedItem] = useState({
        itemName: "",
        category: "",
        quantity: "",
        unit: "",
        threshold: "",
        _id: "",
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

    // Fetch item if editing
    useEffect(() => {
        if (id) {
            const fetchItem = async () => {
                try {
                    const response = await api.get(
                        `/api/v1/inventory/get-inventory-item/${id}`
                    );
                    if (response.data?.data) {
                        setUpdatedItem({ ...response.data.data, _id: id });
                    }
                } catch (error) {
                    console.error("Error fetching item:", error);
                    toast.error("Failed to fetch item data");
                }
            };

            fetchItem();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prev) => ({ ...prev, [name]: value }));
    };

    // Submit form
    const handleSubmit = async () => {
        const { itemName, category, quantity, unit, threshold, _id } =
            updatedItem;

        if (!itemName || !category || !quantity || !unit || !threshold) {
            toast.error("Please fill all the fields.");
            return;
        }

        try {
            if (_id) {
                await api.patch(
                    `/api/v1/inventory/update-inventory-item/${_id}`,
                    {
                        itemName,
                        category,
                        quantity: Number(quantity),
                        unit,
                        threshold: Number(threshold),
                    }
                );
                toast.success("Item updated successfully!");
            } else {
                await api.post("/api/v1/inventory/add-inventory-item", {
                    itemName,
                    category,
                    quantity: Number(quantity),
                    unit,
                    threshold: Number(threshold),
                });
                toast.success("Item added successfully!");
            }
            navigate("/inventory_list");
        } catch (error) {
            console.error(
                _id ? "Error updating item:" : "Error adding item:",
                error
            );
            toast.error(_id ? "Failed to update item" : "Failed to add item");
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
                            value={updatedItem.itemName}
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
                            value={updatedItem.category}
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
                            value={updatedItem.quantity}
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
                            value={updatedItem.unit}
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
                            value={updatedItem.threshold}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button
                    className="btn mt-4 w-100 fw-bold btn-submit"
                    onClick={handleSubmit}
                >
                    {updatedItem._id ? "Update Item" : "Add Item"}
                </button>
            </div>
        </div>
    );
};

export default UpdateItem;
