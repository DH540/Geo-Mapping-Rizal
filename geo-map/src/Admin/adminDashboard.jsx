import React, { useEffect, useState } from "react";
import "./adminDashboard.css";
import AdminSidebar from "./adminSidebar";
import DestinationCatalog from "./destinationCatalog";
import { fetchAllDestinations } from "./services/destinationApi";

const AdminDashboard = ({ adminUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDestinations = async () => {
        try {
            setIsLoading(true);
            setError("");
            const data = await fetchAllDestinations();
            setDestinations(data);
        } catch (loadError) {
            setError(loadError.message || "Failed to load destinations.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDestinations();
    }, []);

    const handleLogout = () => {
        setShowLogoutMenu(false);
        onLogout();
    };

    const totalRoutes = destinations.reduce(
        (sum, destination) => sum + destination.routes.length,
        0
    );

    const activeCategories = new Set(
        destinations.flatMap((destination) =>
            destination.activities.map((activity) => activity.id)
        )
    ).size;

    const recentlyAdded = destinations.slice(0, 5);

    return (
        <div className="admin_dashboard_container">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="admin_dashboard_content">
                <div className="dashboard_header">
                    <div className="dashboard_welcome">
                        <span className="welcome_text">
                            Welcome, {adminUser?.email || "Admin"}
                        </span>
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

                {activeTab === "dashboard" && (
                    <div className="dashboard_main">
                        <div className="stats_container">
                            <div className="stat_card">
                                <div className="stat_label">Total Destinations</div>
                                <div className="stat_value">{destinations.length}</div>
                            </div>

                            <div className="stat_card">
                                <div className="stat_label">Routes Mapped</div>
                                <div className="stat_value">{totalRoutes}</div>
                            </div>

                            <div className="stat_card">
                                <div className="stat_label">Active Categories</div>
                                <div className="stat_value">{activeCategories}</div>
                            </div>
                        </div>

                        <div className="recently_added_section">
                            <h2 className="section_title">Recently Added Destinations</h2>
                            <div className="destinations_list">
                                {isLoading ? (
                                    <div className="empty_state">
                                        <p>Loading destinations...</p>
                                    </div>
                                ) : error ? (
                                    <div className="empty_state">
                                        <p>{error}</p>
                                    </div>
                                ) : recentlyAdded.length === 0 ? (
                                    <div className="empty_state">
                                        <p>No destinations added yet</p>
                                    </div>
                                ) : (
                                    recentlyAdded.map((destination) => (
                                        <div key={destination.id} className="recent_destination_item">
                                            <div className="recent_destination_meta">
                                                <h3>{destination.name}</h3>
                                                <p>{destination.location}</p>
                                            </div>
                                            <div className="recent_destination_stats">
                                                <span>
                                                    {destination.activities.map((activity) => activity.name).join(", ") || "No categories"}
                                                </span>
                                                <span>{destination.routes.length} route(s)</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "destination" && (
                    <div className="dashboard_main">
                        <DestinationCatalog
                            destinations={destinations}
                            isLoading={isLoading}
                            error={error}
                            onRefresh={loadDestinations}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
