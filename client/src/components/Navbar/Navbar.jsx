import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "./Navbar.css";
import { toast } from "react-toastify";
import api from "../../api/api"; 

const Navbar = () => {
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

    // Handle Logout
    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/v1/users/logout");

            toast.success(res.data?.message || "Logout successful!");
            navigate("/login");
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                "Something went wrong. Please try again.";
            toast.error(msg);
        }
    };

    return (
        <nav className={`navbar navbar-expand-lg bg-transparent`}>
            <div className="container-fluid">
                <div className="ms-auto d-flex align-items-center">
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            as="div"
                            className="custom-dropdown-toggle"
                        >
                            <span className="fs-5 me-1">Profile</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            className={`dropdown-menu-end ${darkMode ? "bg-dark text-light" : ""}`}
                        >
                            <Dropdown.Item as={Link} to="/profile">
                                View Profile
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
