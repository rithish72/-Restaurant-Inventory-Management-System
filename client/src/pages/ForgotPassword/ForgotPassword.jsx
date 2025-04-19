import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
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

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/api/v1/auth/user-exist", { email });
            if (res.data?.success && res.data?.data?.userId) {
                await api.post("/api/v1/auth/send-otp", { email });
                toast.success("OTP sent to your email.");
                setStep(2);
            } else {
                toast.error(res.data?.message || "User not found.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/v1/auth/verify-otp", { email, otp });
            toast.success("OTP verified.");
            setStep(3);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/api/v1/auth/reset-password", {
                email,
                newPassword,
            });

            if (res.data?.success) {
                toast.success("Password reset successfully.");
                setEmail("");
                setOtp("");
                setNewPassword("");
                navigate("/login");
            } else {
                toast.error(res.data?.message || "Reset failed.");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error resetting password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav
                className="navbar navbar-expand-lg text-center navbar-login"
                style={{ backgroundColor: "#fd7e14", color: "white" }}
            >
                <div className="sidebar-logo">
                    <img
                        src={logo}
                        alt="App Logo"
                        style={{
                            width: "100px",
                            height: "40px",
                            margin: "4px 30px",
                        }}
                    />
                </div>
            </nav>

            {/* Toast */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
            />

            {/* Forgot Password Card */}
            <div className="login-page d-flex align-items-center justify-content-center">
                <div
                    className={`card p-4 shadow-lg animate-in ${darkMode ? "dark-bg-login" : "light-bg-login"}`}
                    style={{ minWidth: "350px", maxWidth: "400px" }}
                >
                    <h3 className="text-center mb-4 animate-in">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "Reset Password"}
                    </h3>

                    {step === 1 && (
                        <form
                            onSubmit={handleEmailSubmit}
                            className="animate-in"
                        >
                            <div className="mb-3">
                                <label
                                    htmlFor="email"
                                    className="form-label fw-semibold"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 fw-bold"
                                style={{
                                    backgroundColor: "#fd7e14",
                                    color: "white",
                                }}
                                disabled={loading}
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit} className="animate-in">
                            <div className="mb-3">
                                <label
                                    htmlFor="otp"
                                    className="form-label fw-semibold"
                                >
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    className="form-control"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 fw-bold"
                                style={{
                                    backgroundColor: "#fd7e14",
                                    color: "white",
                                }}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form
                            onSubmit={handlePasswordReset}
                            className="animate-in"
                        >
                            <div className="mb-3">
                                <label
                                    htmlFor="newPassword"
                                    className="form-label fw-semibold"
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 fw-bold"
                                style={{
                                    backgroundColor: "#fd7e14",
                                    color: "white",
                                }}
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
