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
      className={`sidebar d-flex flex-column position-fixed p-3 text-white`}
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#fd7e14',
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <h4 className="mb-4 fw-bold text-center">Restaurant Inventory</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/">
            <i className="bi bi-house me-2"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white" to="/dashboard">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white" to="/inventory_list">
            <i className="bi bi-box-seam me-2"></i> Inventory List
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white" to="/orders">
            <i className="bi bi-bag-check me-2"></i> Orders
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link text-white" to="/suppliers">
            <i className="bi bi-truck me-2"></i> Suppliers
          </NavLink>
        </li>
      </ul>

      <hr />
      <button
        className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} mt-auto`}
        onClick={toggleDarkMode}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </div>
  );
};

export default Sidebar;
