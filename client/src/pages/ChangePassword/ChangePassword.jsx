import React, { useState, useEffect } from "react";
import axios from "axios";

const ChangePassword = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

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

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                "/api/user/change-password",
                { oldPassword, newPassword },
                { withCredentials: true }
            );
            alert("Password changed!");
            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-db pb-3">
            <div
                className={`dashboard-container mx-auto animate-in ${darkMode ? "dark-bg-db" : "light-bg-db"}`}
                style={{ maxWidth: "1000px" }}
            >
                <h2
                    className={`text-center fw-bold mb-4 ${darkMode ? "text-white" : "text-dark"} animate-in`}
                >
                    🔐 Change Password
                </h2>

                <div className="mb-3 animate-in">
                    <label
                        htmlFor="oldPassword"
                        className={`form-label ${darkMode ? "text-white" : ""}`}
                    >
                        Old Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        className="form-control"
                        placeholder="Enter old password"
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                    />
                </div>

                <div className="mb-3 animate-in">
                    <label
                        htmlFor="newPassword"
                        className={`form-label ${darkMode ? "text-white" : ""}`}
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="form-control"
                        placeholder="Enter new password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                    />
                </div>

                <div className="mb-4 animate-in">
                    <label
                        htmlFor="confirmPassword"
                        className={`form-label ${darkMode ? "text-white" : ""}`}
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm new password"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                    />
                </div>

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
