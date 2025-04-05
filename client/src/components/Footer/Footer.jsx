import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-1 fw-bold">🍽️ Restaurant Inventory Management</p>
        <p className="mb-0">&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
