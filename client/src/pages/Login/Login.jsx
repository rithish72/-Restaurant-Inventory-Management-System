import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", server: "" });
  const navigate = useNavigate();

  // Detect dark mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  // => Check the email and password format
  // => Check whether password and confirmPassword are equal or not
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailError = "";
    let passwordError = "";

    if (!emailRegex.test(credentials.email)) {
      emailError = "Please enter a valid email address.";
    }
    if (credentials.password.length < 6) {
      passwordError = "Password must be at least 6 characters.";
    }

    setErrors({ email: emailError, password: passwordError, server: "" });
    return !emailError && !passwordError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "", server: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log("Logged in user:", data.user);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        setErrors(prev => ({ ...prev, server: data.message || "Invalid credentials." }));
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
      setErrors(prev => ({ ...prev, server: "Something went wrong. Please try again." }));
    }
  };

  return (
    <div>
      <nav className='navbar navbar-expand-lg text-center' style={{backgroundColor:'#fd7e14', color:'white'}}>
        <h5 className='text-center ms-4 fw-bold pt-1'>Restaurant Inventory Management</h5>
      </nav>
        <div className="login-page d-flex align-items-center justify-content-center">
          <div className={`card p-4 shadow-lg animate-in ${darkMode ? 'dark-bg-login' : 'light-bg-login'}`}>
            <h2 className="text-center mb-4 animate-in">Welcome Back</h2>
            <form className="animate-in" onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  required
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password || errors.server ? 'is-invalid' : ''}`}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  required
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
                {errors.server && <small className="text-danger">{errors.server}</small>}
              </div>

              <button
                type="submit"
                className="btn w-100 fw-bold"
                style={{ backgroundColor: '#fd7e14', color: 'white' }}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-3 animate-in">
              <small>
                Not registered?{' '}
                <NavLink to="/register" className="link-register">Create an account</NavLink>
              </small>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Login;
