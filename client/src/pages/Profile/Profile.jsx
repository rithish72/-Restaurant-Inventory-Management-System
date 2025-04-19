import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import {
    FaUser,
    FaEnvelope,
    FaUserShield,
    FaEdit,
    FaSave,
    FaTimes,
    FaTrash,
    FaKey,
} from "react-icons/fa";

const Profile = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "" });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await api.get("/api/v1/users/me", {
                    withCredentials: true,
                });

                const userData = res?.data?.data?.user;

                if (userData) {
                    setUser(userData);
                    setFormData({
                        name: userData.name || "",
                        email: userData.email || "",
                        role: userData.role || "",
                    });
                    setError(null);
                } else {
                    throw new Error("User data missing");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleEditToggle = () => setEditMode(!editMode);
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Name and email cannot be empty");
            return;
        }

        try {
            setIsUpdating(true);
            const res = await api.put(
                "/api/v1/users/update-account",
                formData,
                {
                    withCredentials: true,
                }
            );

            const updatedUser = res?.data?.data?.user || res?.data?.data;
            setUser(updatedUser);
            setEditMode(false);
            toast.success("Profile updated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/api/v1/users/delete-account/${user._id}`, {
                withCredentials: true,
            });
            toast.success("Account deleted successfully");
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account");
        }
    };

    if (loading) {
        return (
            <div className="text-center pt-5">
                <h4>Loading...</h4>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center pt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center pt-5">
                <div className="alert alert-warning">
                    No user data available.
                </div>
            </div>
        );
    }

    return (
        <div className="container-db pb-3">
            <div
                className={`dashboard-container mx-auto animate-in ${darkMode ? "dark-bg-db" : "light-bg-db"}`}
                style={{ maxWidth: "800px" }}
            >
                <h2
                    className={`text-center fw-bold mb-4 ${darkMode ? "text-white" : "text-dark"}`}
                >
                    Profile Details
                </h2>

                <div className="animate-in">
                    {/* Name */}
                    <div className="mb-3">
                        <label
                            className={`form-label ${darkMode ? "text-white" : "text-dark"}`}
                        >
                            <FaUser
                                className="me-2"
                                style={{ height: "14px", width: "14px" }}
                            />
                            Name
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        ) : (
                            <div
                                className={`form-control-plaintext ${darkMode ? "text-white" : "text-dark"}`}
                            >
                                {user.name}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label
                            className={`form-label ${darkMode ? "text-white" : "text-dark"}`}
                        >
                            <FaEnvelope
                                className="me-2"
                                style={{ height: "14px", width: "14px" }}
                            />
                            Email
                        </label>
                        {editMode ? (
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <div
                                className={`form-control-plaintext ${darkMode ? "text-white" : "text-dark"}`}
                            >
                                {user.email}
                            </div>
                        )}
                    </div>

                    {/* Role */}
                    <div className="mb-3">
                        <label
                            className={`form-label ${darkMode ? "text-white" : "text-dark"}`}
                        >
                            <FaUserShield className="me-2" style={{ height: "14px", width: "14px" }}/>
                            Role
                        </label>
                        <div
                            className={`form-control-plaintext ${darkMode ? "text-white" : "text-dark"}`}
                        >
                            {user.role || "N/A"}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between align-items-center mb-4 animate-in">
                        {editMode ? (
                            <>
                                <button
                                    className="btn btn-success me-2 w-50"
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                >
                                    <FaSave className="me-2" style={{ height: "14px", width: "14px" }}/>{isUpdating ? "Saving..." : "Save"}
                                </button>
                                <button
                                    className="btn btn-secondary w-50"
                                    onClick={handleEditToggle}
                                >
                                    <FaTimes className="me-2" style={{ height: "14px", width: "14px" }}/>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleEditToggle}
                            >
                                <FaEdit className="me-2" style={{ height: "14px", width: "14px" }}/>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <hr className={darkMode ? "border-light" : ""} />

                    {/* Actions */}
                    <div className="text-end animate-in">
                        <NavLink to="/change-password">
                            <button className="btn btn-warning me-2">
                                <FaKey className="me-2" style={{ height: "14px", width: "14px" }}/>
                                Change Password
                            </button>
                        </NavLink>
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            <FaTrash className="me-2" style={{ height: "14px", width: "14px" }}/>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
