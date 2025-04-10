import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div
      className={`sidebar d-flex flex-column position-fixed p-3 text-white `}
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#fd7e14',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >

      {/* Logo */}
      <h4 className="mb-4 fw-bold text-center animate-sidebar">Restaurant Inventory</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink className="nav-link text-white animate-sidebar" to="/home">
            <i className="bi bi-house me-1"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white animate-sidebar" to="/dashboard">
            <i className="bi bi-speedometer2 me-1"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white animate-sidebar" to="/inventory_list">
            <i className="bi bi-box-seam me-1"></i> Inventory List
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white animate-sidebar" to="/orders">
            <i className="bi bi-bag-check me-1"></i> Orders
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white animate-sidebar" to="/suppliers">
            <i className="bi bi-truck me-1"></i> Suppliers
          </NavLink>
        </li>
      </ul>

      <hr />

      {/* Dark Mode Button */}
      <button
        className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} mt-auto animate-sidebar`}
        onClick={toggleDarkMode}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </div>
  );
};

export default Sidebar;
