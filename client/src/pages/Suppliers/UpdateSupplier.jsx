import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

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

    useEffect(() => {
        if (id) {
            const fetchSupplier = async () => {
                setLoading(true);
                try {
                    const response = await api.get(
                        `/api/v1/suppliers/get-supplier/${id}`
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
    };

    const validateForm = () => {
        const { name, contactPerson, phone, email, address, itemsSupplied } =
            updatedSupplier;
        return (
            name && contactPerson && phone && email && address && itemsSupplied
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setIsFormValid(false);
            alert("Please fill all fields correctly.");
            return;
        }

        const {
            name,
            contactPerson,
            phone,
            email,
            address,
            itemsSupplied,
            _id,
        } = updatedSupplier;

        setLoading(true);
        setError(null);

        try {
            if (_id) {
                await api.patch(`/api/v1/suppliers/update-supplier/${_id}`, {
                    supplier: name,
                    phoneNumber: phone,
                    email,
                    address,
                    itemsSupplied,
                });
                toast.success("Supplier updated successfully!");
            } else {
                await api.post("/api/v1/suppliers/add-supplier", {
                    supplier: name,
                    phoneNumber: phone,
                    email,
                    address,
                    itemsSupplied,
                });
                toast.success("Supplier added successfully!");
            }
            navigate("/suppliers");
        } catch (error) {
            console.error(
                _id ? "Error updating supplier:" : "Error adding supplier:",
                error
            );
            setError(
                _id ? "Failed to update supplier" : "Failed to add supplier"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container mt-0">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h5 className="mb-3 fw-semibold animate-in">
                    {updatedSupplier._id ? "Update Supplier" : "Add Supplier"}
                </h5>

                {error && <div className="alert">{error}</div>}

                <div className="row g-3 animate-in">
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Supplier
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Supplier"
                            value={updatedSupplier.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">
                            Contact Person
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="contactPerson"
                            placeholder="Contact Person"
                            value={updatedSupplier.contactPerson}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            placeholder="Phone Number"
                            value={updatedSupplier.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={updatedSupplier.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">
                            Address
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="Address"
                            value={updatedSupplier.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-semibold">
                            Items Supplied (comma separated)
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="itemsSupplied"
                            placeholder="e.g. Tomatoes, Milk, Bread"
                            value={updatedSupplier.itemsSupplied}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="animate-in">
                    <button
                        className="btn mt-4 w-100 fw-bold btn-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : updatedSupplier._id
                              ? "Update Supplier"
                              : "Add Supplier"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateSupplier;
