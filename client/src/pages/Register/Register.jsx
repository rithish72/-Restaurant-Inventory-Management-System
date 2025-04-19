import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react";
import "./Register.css";
import logo from '../../assets/logo.png'

const Register = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        server: "",
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

    const validateForm = () => {
        const { email, password, confirmPassword } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let emailError = "";
        let passwordError = "";
        let confirmPasswordError = "";

        if (!emailRegex.test(email)) {
            emailError = "Please enter a valid email address.";
        }

        if (password.length < 6) {
            passwordError = "Password must be at least 6 characters.";
        }

        if (password !== confirmPassword) {
            confirmPasswordError = "Passwords do not match.";
        }

        setErrors({
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
            server: "",
        });

        return !emailError && !passwordError && !confirmPasswordError;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name] || errors.server) {
            setErrors((prev) => ({ ...prev, [name]: "", server: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        navigate("/verify-email", { state: { formData } });
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

            <div className="register-page d-flex align-items-center justify-content-center m-2">
                <div
                    className={`card p-4 shadow-lg animate-in ${darkMode ? "dark-bg-register" : "light-bg-register"}`}
                >
                    <h3 className="text-center mb-3">Create an Account</h3>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="d-flex gap-3">
                            <div className="mb-3 w-100">
                                <label className="form-label">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <User className="icon" style={{
                                            height: "14px",
                                            width: "14px",
                                        }} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3 w-100">
                                <label className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Mail className="icon" style={{
                                            height: "14px",
                                            width: "14px",
                                        }} />
                                    </span>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <small className="text-danger">
                                        {errors.email}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Lock className="icon" style={{
                                            height: "14px",
                                            width: "14px",
                                        }} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <small className="text-danger">
                                    {errors.password}
                                </small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Confirm Password
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Lock className="icon" style={{
                                            height: "14px",
                                            width: "14px",
                                        }} />
                                </span>
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                    name="confirmPassword"
                                    placeholder="Repeat your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        setShowConfirmPassword((prev) => !prev)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <small className="text-danger">
                                    {errors.confirmPassword}
                                </small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Select Role</label>
                            <div className="input-group">
                                <select
                                    className="form-control"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select One</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                        </div>

                        {errors.server && (
                            <small className="text-danger d-block mb-2">
                                {errors.server}
                            </small>
                        )}

                        <button
                            type="submit"
                            className="btn btn-register w-100"
                        >
                            Register
                        </button>
                    </form>

                    <div className="text-center mt-2">
                        <small>
                            Already have an account?{" "}
                            <NavLink to="/login" className="link-login">
                                Login
                            </NavLink>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
