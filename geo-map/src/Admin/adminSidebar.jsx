import React from "react";
import "./adminSidebar.css";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="admin_sidebar">
            <div className="sidebar_menu">
                <button 
                    className={`sidebar_item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                </button>
                
                <button 
                    className={`sidebar_item ${activeTab === 'destination' ? 'active' : ''}`}
                    onClick={() => setActiveTab('destination')}
                >
                    <i className="fas fa-map-location-dot"></i>
                    <span>Destination</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
