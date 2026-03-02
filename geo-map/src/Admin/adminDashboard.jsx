import React, { useState } from "react";
import "./adminDashboard.css";
import AdminSidebar from "./adminSidebar";
import DestinationCatalog from "./destinationCatalog";

const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    const handleLogout = () => {
        setShowLogoutMenu(false);
        onLogout();
    };

    return (
        <div className="admin_dashboard_container">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="admin_dashboard_content">
                {/* Header with Welcome and Logout */}
                <div className="dashboard_header">
                    <div className="dashboard_welcome">
                        <span className="welcome_text">Welcome, Admin</span>
                        <div className="logout_menu_wrapper">
                            <button 
                                className="welcome_dropdown"
                                onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                            >
                                <i className="fas fa-chevron-down"></i>
                            </button>
                            {showLogoutMenu && (
                                <div className="logout_dropdown">
                                    <button onClick={handleLogout} className="logout_option">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                {activeTab === 'dashboard' && (
                    <div className="dashboard_main">
                        {/* Stats Cards */}
                        <div className="stats_container">
                            <div className="stat_card">
                                <div className="stat_label">Total Destinations</div>
                                <div className="stat_value">0</div>
                            </div>
                            
                            <div className="stat_card">
                                <div className="stat_label">Routes Mapped</div>
                                <div className="stat_value">0</div>
                            </div>
                            
                            <div className="stat_card">
                                <div className="stat_label">Active Categories</div>
                                <div className="stat_value">0</div>
                            </div>
                        </div>

                        {/* Recently Added Destinations */}
                        <div className="recently_added_section">
                            <h2 className="section_title">Recently Added Destinations</h2>
                            <div className="destinations_list">
                                {/* Empty state - destinations will be added here */}
                                <div className="empty_state">
                                    <p>No destinations added yet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Destination Tab Content */}
                {activeTab === 'destination' && (
                    <div className="dashboard_main">
                        <DestinationCatalog />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
