import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
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

    const fetchSuppliers = async () => {
        try {
            const { data } = await api.get("/api/v1/suppliers/get-all-suppliers");
            setSuppliers(data?.data || []);
        } catch (error) {
            console.error("Error fetching suppliers:", error.message);
            toast.error("Failed to fetch suppliers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleDeleteSupplier = async (supplierId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/api/v1/suppliers/delete-supplier/${supplierId}`);
            toast.success("Supplier deleted successfully!");
            fetchSuppliers();
        } catch (error) {
            console.error("Failed to delete supplier:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete supplier. Please try again."
            );
        }
    };

    return (
        <div className="container-db">
            <div className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}>
                <h2 className={`text-center mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"} animate-in`}>
                    🧾 Suppliers List
                </h2>

                {/* Add Supplier Button */}
                <div className="text-end mb-3">
                    <button
                        className="btn fw-semibold"
                        style={{ backgroundColor: "#fd7e14", color: "white" }}
                        onClick={() => navigate("/suppliers/add-supplier")}
                    >
                        Add Supplier
                    </button>
                </div>

                {/* Supplier Table */}
                <div className="text-center">
                    {loading ? (
                        <div className="text-center my-5">
                            <div className={`spinner-border ${darkMode ? "text-light" : ""}`} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : suppliers.length === 0 ? (
                        <div className="alert alert-warning text-center">No suppliers found.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className={`table table-bordered table-hover rounded-3 overflow-hidden ${darkMode ? "table-dark text-light" : ""}`}>
                                <thead className={`${darkMode ? "bg-secondary text-white" : "table-primary"}`}>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Contact Person</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Items Supplied</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((supplier, index) => (
                                        <tr key={supplier._id}>
                                            <td>{index + 1}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.contactPerson}</td>
                                            <td>{supplier.phone}</td>
                                            <td>{supplier.email}</td>
                                            <td>{supplier.address}</td>
                                            <td>{Array.isArray(supplier.itemsSupplied) ? supplier.itemsSupplied.join(", ") : supplier.itemsSupplied}</td>
                                            <td className="d-flex flex-wrap gap-2 justify-content-center">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => navigate(`/inventory_list/update-item/${supplier._id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDeleteSupplier(supplier._id)}
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
        </div>
    );
};

export default Suppliers;
