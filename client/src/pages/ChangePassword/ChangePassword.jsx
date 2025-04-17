import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";

const ChangePassword = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        newPasswordVisible: false,
        confirmPasswordVisible: false,
        oldPasswordVisible: false,
    });
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const toggleVisibility = (field) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validateForm = () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.warning("Please fill in all fields");
            return false;
        }

        if (newPassword.length < 6) {
            toast.warning("New password must be at least 6 characters long");
            return false;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("New password and confirm password do not match");
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const { oldPassword, newPassword } = passwords;

            await api.post(
                "/api/v1/users/change-password",
                { oldPassword, newPassword },
                { withCredentials: true }
            );

            toast.success("Password changed successfully!");
            navigate("/profile");
            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
                oldPasswordVisible: false,
                newPasswordVisible: false,
                confirmPasswordVisible: false,
            });
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (label, name, visibleKey, placeholder) => (
        <div className="mb-3 animate-in">
            <label
                htmlFor={name}
                className={`form-label ${darkMode ? "text-white" : ""}`}
            >
                {label}
            </label>
            <div className="input-group">
                <input
                    type={passwords[visibleKey] ? "text" : "password"}
                    id={name}
                    name={name}
                    className="form-control"
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={handleChange}
                    aria-label={label}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => toggleVisibility(visibleKey)}
                    tabIndex={-1}
                >
                    {passwords[visibleKey] ? "Hide" : "Show"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="container-db pb-3">
            <div
                className={`dashboard-container mx-auto animate-in ${darkMode ? "dark-bg-db" : "light-bg-db"}`}
                style={{ maxWidth: "1000px" }}
            >
                <h2
                    className={`text-center fw-bold mb-4 ${darkMode ? "text-white" : "text-dark"}`}
                >
                    Change Password
                </h2>

                {renderPasswordInput(
                    "Old Password",
                    "oldPassword",
                    "oldPasswordVisible",
                    "Enter old password"
                )}
                {renderPasswordInput(
                    "New Password",
                    "newPassword",
                    "newPasswordVisible",
                    "Enter new password"
                )}
                {renderPasswordInput(
                    "Confirm Password",
                    "confirmPassword",
                    "confirmPasswordVisible",
                    "Confirm new password"
                )}

                <div className="text-center">
                    <button
                        className="btn btn-warning w-100"
                        onClick={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
