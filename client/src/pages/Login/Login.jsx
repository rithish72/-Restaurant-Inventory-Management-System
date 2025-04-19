import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import "./Login.css";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../assets/logo.png";

const Login = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        server: "",
    });
    const navigate = useNavigate();
    const emailRef = useRef(null);

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
        emailRef.current?.focus();
    }, []);

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailError = !emailRegex.test(credentials.email)
            ? "Please enter a valid email address."
            : "";
        const passwordError =
            credentials.password.length < 6
                ? "Password must be at least 6 characters."
                : "";

        setErrors({ email: emailError, password: passwordError, server: "" });
        return !emailError && !passwordError;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        if (errors[name] || errors.server) {
            setErrors((prev) => ({ ...prev, [name]: "", server: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.post("/api/v1/users/login", credentials, {
                withCredentials: true,
            });

            toast.success("Login successful!");
            navigate("/home");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Something went wrong. Please try again.";
            setErrors((prev) => ({ ...prev, server: message }));
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav
                className="navbar text-center navbar-login"
                style={{ backgroundColor: "#fd7e14", color: "white", margin:"0px" }}
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

            {/* Login Card */}
            <div className="login-page d-flex align-items-center justify-content-center">
                <div
                    className={`card p-4 shadow-lg animate-in ${darkMode ? "dark-bg-login" : "light-bg-login"}`}
                >
                    <h2 className="text-center mb-4 animate-in">
                        Welcome Back
                    </h2>

                    <form
                        className="animate-in"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Email */}
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="form-label fw-semibold"
                            >
                                Email
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FiMail
                                        className="icon"
                                        style={{
                                            height: "14px",
                                            width: "14px",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    ref={emailRef}
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <div className="invalid-feedback d-block">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-1">
                            <label
                                htmlFor="password"
                                className="form-label fw-semibold"
                            >
                                Password
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FiLock
                                        className="icon"
                                        style={{
                                            height: "14px",
                                            width: "14px",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={`form-control ${errors.password || errors.server ? "is-invalid" : ""}`}
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <FiEyeOff
                                            style={{
                                                height: "14px",
                                                width: "14px",
                                                backgroundColor: "transparent",
                                                margin: "auto",
                                            }}
                                        />
                                    ) : (
                                        <FiEye
                                            style={{
                                                height: "14px",
                                                width: "14px",
                                                backgroundColor: "transparent",
                                                margin: "auto",
                                            }}
                                        />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="invalid-feedback d-block">
                                    {errors.password}
                                </div>
                            )}
                            {errors.server && (
                                <div className="invalid-feedback d-block">
                                    {errors.server}
                                </div>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="mb-3 text-end">
                            <NavLink
                                to="/forgot-password"
                                className="text-decoration-none small link-register"
                            >
                                Forgot Password?
                            </NavLink>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn w-100 fw-bold"
                            style={{
                                backgroundColor: "#fd7e14",
                                color: "white",
                            }}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center mt-3 animate-in">
                        <small>
                            Not registered?{" "}
                            <NavLink to="/register" className="link-register">
                                Create an account
                            </NavLink>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
