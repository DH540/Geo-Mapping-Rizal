import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const openNav = () => setSidebarOpen(true);
    const closeNav = () => setSidebarOpen(false);

    // helper to highlight active link
    const isActive = (path) => location.pathname === path ? "active_link" : "";

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/": return "Home";
            case "/explore": return "Explore";
            case "/routes": return "Routes";
            case "/contact": return "Contact Us";
            case "/admin": return "Admin Login";
            case "/admin/dashboard": return "Admin Dashboard";
            default: return "Home";
        }
    };

    return (
        <div className="header">
            <div className="header_rightside">
                <div className="logo">
                    <Link to="/">
                        <img src="/logo_geo.png" alt="logo" />
                    </Link>
                </div>
            </div>

            <div className="header_middle">
                <span className="header_middle_text">{getPageTitle()}</span>
            </div>

            <div className="header_leftside">
                <div className={`sidepanel ${sidebarOpen ? "open" : ""}`}>
                    <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                    <Link to="/" onClick={closeNav} className={isActive("/")}>Home</Link>
                    <Link to="/explore" onClick={closeNav} className={isActive("/explore")}>Explore</Link>
                    <Link to="/routes" onClick={closeNav} className={isActive("/routes")}>Routes</Link>
                    <Link to="/admin" onClick={closeNav} className={isActive("/admin")}>I'm an Admin</Link>
                    <Link to="/contact" onClick={closeNav} className={isActive("/contact")}>Contact Us</Link>
                </div>

                <button className="openbtn" onClick={openNav}>&#9776;</button>
            </div>
        </div>
    );
}

export default Header;