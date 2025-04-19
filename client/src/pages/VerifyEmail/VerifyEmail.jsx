import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import logo from "../../assets/logo.png";

const VerifyEmail = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ otp: "", server: "" });

    const navigate = useNavigate();
    const location = useLocation();

    const formData = location.state?.formData;
    const email = formData?.email;

    useEffect(() => {
        if (!formData) {
            toast.error("Invalid access. Please register again.");
            navigate("/register");
        }
    }, [formData, navigate]);

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
        setOtp(e.target.value);
        if (errors.otp || errors.server) {
            setErrors({ otp: "", server: "" });
        }
    };

    const handleSendOTP = async () => {
        try {
            await api.post("/api/v1/auth/send-otp", { email });
            toast.success("OTP sent to your email!");
        } catch (error) {
            toast.error("Failed to send OTP");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!otp) {
            setErrors({ otp: "OTP is required", server: "" });
            setLoading(false);
            return;
        }

        try {
            // Step 1: Verify OTP
            await api.post("/api/v1/auth/verify-otp", { email, otp });

            // Step 2: Register user
            await api.post(
                "/api/v1/users/register",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    role: formData.role,
                },
                { withCredentials: true }
            );

            toast.success("Registered successfully!");
            navigate("/home");
        } catch (err) {
            const msg = err?.response?.data?.message || "Verification failed";
            setErrors({ otp: "", server: msg });
            toast.error(msg);
        }

        setLoading(false);
    };

    return (
        <div>
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

            <div className="login-page d-flex align-items-center justify-content-center">
                <div
                    className={`card p-4 shadow-lg animate-in ${
                        darkMode ? "dark-bg-login" : "light-bg-login"
                    }`}
                >
                    <h2 className="text-center mb-4 animate-in">
                        Verify Email
                    </h2>

                    <form
                        className="animate-in"
                        onSubmit={handleVerifyOTP}
                        noValidate
                    >
                        <p className="text-muted">
                            An OTP has been sent to <strong>{email}</strong>
                        </p>

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
                                name="otp"
                                className={`form-control ${errors.otp || errors.server ? "is-invalid" : ""}`}
                                value={otp}
                                onChange={handleChange}
                                placeholder="Enter OTP"
                                required
                            />
                            {errors.otp && (
                                <small className="text-danger">
                                    {errors.otp}
                                </small>
                            )}
                            {errors.server && (
                                <small className="text-danger">
                                    {errors.server}
                                </small>
                            )}
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
                            {loading ? "Verifying..." : "Verify & Register"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-link mt-2"
                            onClick={handleSendOTP}
                        >
                            Resend OTP
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
