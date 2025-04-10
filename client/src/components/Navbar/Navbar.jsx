import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import './Navbar.css';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Logout successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-transparent`}>
      <div className="container-fluid">
        <Link className={`navbar-brand ${darkMode ? 'text-light' : 'text-dark'}`} to="/">
          🧠 SmartInventory
        </Link>

        <div className="ms-auto d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="custom-dropdown-toggle">
              <span className="fs-5 me-1">Profile</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className={`dropdown-menu-end ${darkMode ? 'bg-dark text-light' : ''}`}>
              <Dropdown.Item as={Link} to="/profile">👤 View Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>🚪 Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
