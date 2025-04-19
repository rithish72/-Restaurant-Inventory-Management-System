import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const AddSupplier = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        itemsSupplied: "",
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
        setNewSupplier((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSupplier = async () => {
        const { name, contactPerson, phone, email, address, itemsSupplied } =
            newSupplier;

        if (
            !name ||
            !contactPerson ||
            !phone ||
            !email ||
            !address ||
            !itemsSupplied
        ) {
            return toast.error("Please fill in all fields.");
        }

        try {
            const formattedData = {
                supplier: name,
                contactPerson,
                phoneNumber: phone,
                email,
                address,
                itemsSupplied: itemsSupplied
                    .split(",")
                    .map((item) => item.trim()),
            };

            await api.post("/api/v1/suppliers/add-supplier", formattedData);
            toast.success("Supplier added successfully!");

            setNewSupplier({
                name: "",
                contactPerson: "",
                phone: "",
                email: "",
                address: "",
                itemsSupplied: "",
            });

            navigate("/suppliers");
        } catch (error) {
            console.error("Error adding supplier:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to add supplier. Please try again."
            );
        }
    };

    return (
        <div className="dashboard-container mt-0">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h5 className="mb-3 fw-semibold animate-in">
                    Add New Supplier
                </h5>
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
                            value={newSupplier.name}
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
                            value={newSupplier.contactPerson}
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
                            value={newSupplier.phone}
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
                            value={newSupplier.email}
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
                            value={newSupplier.address}
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
                            value={newSupplier.itemsSupplied}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="animate-in">
                    <button
                        className="btn mt-4 w-100 fw-bold btn-submit"
                        onClick={handleAddSupplier}
                    >
                        Add Supplier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSupplier;
