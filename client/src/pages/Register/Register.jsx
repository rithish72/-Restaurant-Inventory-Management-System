import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    server: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

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

    setErrors({ email: emailError, password: passwordError, confirmPassword: confirmPasswordError, server: "" });
    return !emailError && !passwordError && !confirmPasswordError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear individual error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "", server: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          role: formData.role
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate("/login");
      } else {
        setErrors(prev => ({ ...prev, server: data.message || "Registration failed." }));
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setLoading(false);
      setErrors(prev => ({ ...prev, server: "Something went wrong. Please try again." }));
    }
  };

  return (
    <div>
      <nav className='navbar navbar-expand-lg text-center' style={{backgroundColor:'#fd7e14', color:'white'}}>
        <h5 className='text-center ms-4 fw-bold pt-1'>Restaurant Inventory Management</h5>
      </nav>
      <div className="register-page d-flex align-items-center justify-content-center m-2">
        <div className={`card p-4 shadow-lg animate-in ${darkMode ? 'dark-bg-register' : 'light-bg-register'}`}>
          <h3 className="text-center mb-3">Create an Account</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className='d-flex gap-3'>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
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

              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <div className="mb-2">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </div>

            <div className="mb-2">
              <label className="form-label">Select Role</label>
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
                <option value="Admin">Admin</option>
              </select>
            </div>

            {errors.server && <small className="text-danger d-block mb-2">{errors.server}</small>}

            <button
              type="submit"
              className="btn btn-register w-100"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-2">
            <small>
              Already have an account?{" "}
              <NavLink to="/login" className="link-login">Login</NavLink>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
