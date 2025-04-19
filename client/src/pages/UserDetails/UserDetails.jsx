import React, { useEffect, useState } from "react";
import api from "../../api/api.js";
import "./UserDetails.css";
import { toast } from "react-toastify";

const UserDetails = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/v1/admin/users-details");
                if (res.data?.success) {
                    setUsers(res.data.data || []);
                } else {
                    toast.warn("Failed to fetch user data.");
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                toast.error("An error occurred while fetching users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

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

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this account?"
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/api/v1/admin/delete-user/${userId}`, {
                withCredentials: true,
            });
            toast.success("Account deleted successfully");
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account");
        }
    };

    return (
        <div className="container-db">
            <div
                className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}
            >
                <h2
                    className={`text-center mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"}`}
                >
                    👥 User Management
                </h2>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-secondary" role="status" />
                        <p className="mt-3">Loading users...</p>
                    </div>
                ) : (
                    <table
                        className={`table table-bordered table-hover ${darkMode ? "table-dark text-light" : ""}`}
                    >
                        <thead className={`${darkMode ? "table-secondary" : "table-primary"}`}>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
