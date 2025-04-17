import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Suppliers.css";

const UpdateSupplier = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [updatedSupplier, setUpdatedSupplier] = useState({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        itemsSupplied: "",
        _id: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFormValid, setIsFormValid] = useState(true); 
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

    // Fetch Supplier if editing
    useEffect(() => {
        if (id) {
            const fetchSupplier = async () => {
                setLoading(true);
                try {
                    const response = await api.get(
                        `/api/v1/Suppliers/get-Supplier/${id}`
                    );
                    if (response.data?.data) {
                        setUpdatedSupplier({ ...response.data.data, _id: id });
                    }
                } catch (error) {
                    console.error("Error fetching Supplier:", error);
                    setError("Failed to fetch Supplier data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchSupplier();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedSupplier((prev) => ({ ...prev, [name]: value }));
        validateForm();
    };

    const validateForm = () => {
        const { itemName, category, quantity, unit, threshold } =
            updatedSupplier;
        setIsFormValid(itemName && category && quantity && unit && threshold);
    };

    // Submit form
    const handleSubmit = async () => {
        if (!isFormValid) {
            alert("Please fill all fields correctly.");
            return;
        }

        const { itemName, category, quantity, unit, threshold, _id } =
            updatedSupplier;

        setLoading(true);
        setError(null);
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
            setError(_id ? "Failed to update item" : "Failed to add item");
        } finally {
            setLoading(false);
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

                {loading && <div className="loading-spinner">Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}

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
                            value={updatedSupplier.itemName}
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
                            value={updatedSupplier.category}
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
                            value={updatedSupplier.quantity}
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
                            value={updatedSupplier.unit}
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
                            value={updatedSupplier.threshold}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button
                    className="btn btn-success mt-4 w-100 fw-bold"
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                >
                    {loading ? "Updating..." : "Update Item"}
                </button>
            </div>
        </div>
    );
};

export default UpdateSupplier;
