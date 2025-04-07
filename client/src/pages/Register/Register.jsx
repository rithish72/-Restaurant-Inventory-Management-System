import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));
    alert("Registered successfully!");
    navigate("/login");
  };

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="register-card card p-4 shadow-lg animate-in">
        <h3 className="text-center mb-4">Create an Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Repeat your password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-register w-100">Register</button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <NavLink to="/login" className="link-login">Login</NavLink>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
