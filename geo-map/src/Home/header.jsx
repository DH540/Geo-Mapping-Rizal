import React, { useState } from "react";
import "./header.css";

const Header = ({ onAdminClick, onHomeClick, onRoutesClick, currentPage }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openNav = () => {
        setSidebarOpen(true);
    };

    const closeNav = () => {
        setSidebarOpen(false);
    };
    const handleHomeClick = (e) => {
        e.preventDefault();
        closeNav();
        if (onHomeClick) {
            onHomeClick();
        }
    };

    const handleAdminClick = (e) => {
        e.preventDefault();
        closeNav();
        if (onAdminClick) {
            onAdminClick();
        }
    };

    const handleRoutesClick = (e) => {
        e.preventDefault();
        closeNav();
        if (onRoutesClick) {
            onRoutesClick();
        }
    };

    return (
        <div className="header">
            <div className="header_rightside">
                <div className="logo">
                    <img src="/logo_geo.png" alt="logo" />
                </div>
            </div>

            <div className="header_middle">
                <span className="header_middle_text">{currentPage === 'admin' ? 'Admin' : currentPage === 'routes' ? 'Routes' : 'Home'}</span>
            </div>

            <div className="header_leftside">
                <div id="mySidepanel" className={`sidepanel ${sidebarOpen ? 'open' : ''}`}>
                    <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                    <a href="Home_Page" onClick={handleHomeClick}>Home</a>
                    <a href="#">Explore</a>
                    <a href="Route_Page" onClick={handleRoutesClick}>Routes</a>
                    <a href="Admin_Page" onClick={handleAdminClick}>I'm an Admin</a>
                    <a href="#">Contact Us</a>
                </div>

                <button className="openbtn" onClick={openNav}>&#9776;</button>
            </div>
        </div>
    );
}

export default Header;  