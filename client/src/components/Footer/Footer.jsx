import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer-bg">
            <footer className="footer text-center py-3 mt-auto animate-footer">
                <div className="container animate-footer">
                    <p className="mb-1 fw-bold animate-footer">
                        🍽️ Restaurant Inventory Management
                    </p>
                    <p className="mb-0 animate-footer">
                        &copy; {new Date().getFullYear()} All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
