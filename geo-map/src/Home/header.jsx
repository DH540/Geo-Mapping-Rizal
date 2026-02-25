import React, { useState } from "react";
import "./header.css";

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openNav = () => {
        setSidebarOpen(true);
    };

    const closeNav = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="header">
            <div className="header_rightside">
                <div className="logo">
                    <img src="/logo_geo.png" alt="logo" />
                </div>
            </div>

            <div className="header_middle">
                <span className="header_middle_text">Home</span>
            </div>

            <div className="header_leftside">
                <div id="mySidepanel" className={`sidepanel ${sidebarOpen ? 'open' : ''}`}>
                    <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
                    <a href="#">Home</a>
                    <a href="#">Explore</a>
                    <a href="#">Routes</a>
                    <a href="#">I'm an Admin</a>
                    <a href="#">Contact Us</a>
                </div>

                <button className="openbtn" onClick={openNav}>&#9776;</button>
            </div>
        </div>
    );
}

export default Header;  