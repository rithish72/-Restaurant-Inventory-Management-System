import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./UserDetails.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        api
            .get("/api/v1/users/all")
            .then((res) => setUsers(res.data))
            .catch(console.error);

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

    return (
        <div className={`admin-users-container ${darkMode ? "dark-bg" : "light-bg"} animate-in`}>
            <h2 className={`mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"}`}>
                👥 User Management
            </h2>

            <table className={`table table-bordered table-striped ${darkMode ? "table-dark" : ""}`}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user._id || index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
