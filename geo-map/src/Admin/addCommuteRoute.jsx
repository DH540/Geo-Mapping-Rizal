import React, { useState } from "react";
import "./addCommuteRoute.css";

const AddCommuteRoute = ({ onClose, onSave }) => {
    const [routeData, setRouteData] = useState({
        transportType: "Tricycle",
        from: "",
        to: "",
    });

    const transportTypes = [
        { value: "Tricycle", label: "Tricycle" },
        { value: "Jeep", label: "Jeep" },
        { value: "Bus", label: "Bus" },
        { value: "Walk", label: "Walk" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRouteData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveRoute = () => {
        if (routeData.from && routeData.to) {
            onSave(routeData);
        } else {
            alert("Please fill in all fields");
        }
    };

    return (
        <div className="commute_route_overlay">
            <div className="commute_route_modal">
                <div className="modal_header">
                    <h2 className="modal_title">Add Commute Route</h2>
                    <button className="modal_close" onClick={onClose} type="button">
                        x
                    </button>
                </div>

                <div className="modal_content">
                    <div className="route_group">
                        <label>Transport Type:</label>
                        <select
                            name="transportType"
                            value={routeData.transportType}
                            onChange={handleInputChange}
                            className="transport_select"
                        >
                            {transportTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="route_group">
                        <label>From:</label>
                        <input
                            type="text"
                            name="from"
                            placeholder="Enter origin terminal"
                            value={routeData.from}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="route_group">
                        <label>To:</label>
                        <input
                            type="text"
                            name="to"
                            placeholder="Enter destination"
                            value={routeData.to}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="modal_footer">
                    <button className="save_route_btn" onClick={handleSaveRoute} type="button">
                        Save Route
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCommuteRoute;
