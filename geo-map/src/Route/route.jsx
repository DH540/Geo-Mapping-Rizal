import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./route.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to draw route on map
const RouteLayer = ({ origin, destination }) => {
    const map = useMap();
    const routeLayerRef = useRef(null);

    useEffect(() => {
        if (!origin || !destination) return;

        // Remove previous route
        if (routeLayerRef.current) {
            map.removeLayer(routeLayerRef.current);
        }

        // Fetch route from OSRM (free routing engine)
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates.map(
                        ([lng, lat]) => [lat, lng]
                    );
                    const polyline = L.polyline(coords, {
                        color: "#7FAC9C",
                        weight: 5,
                        opacity: 0.8,
                    });
                    polyline.addTo(map);
                    routeLayerRef.current = polyline;
                    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
                }
            });
    }, [origin, destination, map]);

    return null;
};

const Route = () => {
    const [destination, setDestination] = useState("");
    const [originCoords, setOriginCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);
    const [duration, setDuration] = useState(null);
    const [distance, setDistance] = useState(null);
    const [steps, setSteps] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!destination) return;

        setError("");
        setSteps([]);
        setDuration(null);
        setDistance(null);
        setLoading(true);

        try {
            let destLat = null;
            let destLng = null;

            // Step 1 - Try Nominatim first
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`
            );
            const geoData = await geoRes.json();

            if (geoData && geoData.length > 0) {
                destLat = parseFloat(geoData[0].lat);
                destLng = parseFloat(geoData[0].lon);
            } else {
                // Step 2 - Fallback to our database
                const dbRes = await fetch(`${API_BASE_URL}/destinations.php`);
                const dbData = await dbRes.json();

                if (dbData.status === "success" && dbData.data.length > 0) {
                    const match = dbData.data.find((d) =>
                        d.name.toLowerCase().includes(destination.toLowerCase())
                    );

                    if (match) {
                        destLat = match.latitude;
                        destLng = match.longitude;
                    } else {
                        setError("Destination not found. Try a more specific location.");
                        setLoading(false);
                        return;
                    }
                } else {
                    setError("Destination not found. Try a more specific location.");
                    setLoading(false);
                    return;
                }
            }

            setDestCoords({ lat: destLat, lng: destLng });

            // Step 3 - Get user location
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const origin = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setOriginCoords(origin);

                    // Step 4 - Get route from OSRM
                    const routeRes = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`
                    );
                    const routeData = await routeRes.json();

                    if (routeData.routes && routeData.routes.length > 0) {
                        const route = routeData.routes[0];
                        const leg = route.legs[0];

                        const mins = Math.round(route.duration / 60);
                        const km = (route.distance / 1000).toFixed(1);
                        setDuration(mins);
                        setDistance(km);

                        const extractedSteps = leg.steps.map((step) => ({
                            instruction: step.maneuver.instruction || cleanInstruction(step),
                            distance: (step.distance / 1000).toFixed(2) + " km",
                            mode: step.maneuver.type,
                        }));
                        setSteps(extractedSteps);
                    } else {
                        setError("Could not find a route to that destination.");
                    }
                    setLoading(false);
                },
                () => {
                    setError("Could not get your location. Please allow location access.");
                    setLoading(false);
                }
            );
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const cleanInstruction = (step) => {
        const type = step.maneuver.type;
        const modifier = step.maneuver.modifier || "";
        const name = step.name || "the road";
        if (type === "depart") return `Start on ${name}`;
        if (type === "arrive") return `Arrive at destination`;
        if (type === "turn") return `Turn ${modifier} onto ${name}`;
        return `Continue on ${name}`;
    };

    const getStepIcon = (type) => {
        switch (type) {
            case "depart": return "🚦";
            case "arrive": return "📍";
            case "turn": return "↩️";
            case "roundabout": return "🔄";
            default: return "➡️";
        }
    };

    return (
        <div className="route_page">
            <div className="route_background">
                <img src="/img_background.png" alt="route background" />
            </div>

            <div className="route_content">

                {/* LEFT - MAP */}
                <div className="route_leftside">
                    <MapContainer
                        center={[14.6042, 121.3035]}
                        zoom={12}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {originCoords && (
                            <Marker position={[originCoords.lat, originCoords.lng]}>
                                <Popup>Your Location</Popup>
                            </Marker>
                        )}
                        {destCoords && (
                            <Marker position={[destCoords.lat, destCoords.lng]}>
                                <Popup>{destination}</Popup>
                            </Marker>
                        )}
                        {originCoords && destCoords && (
                            <RouteLayer origin={originCoords} destination={destCoords} />
                        )}
                    </MapContainer>
                </div>

                {/* RIGHT - DETAILS */}
                <div className="route_rightside">
                    <h2>Destination</h2>

                    <div className="route_search">
                        <span>📍</span>
                        <input
                            type="text"
                            placeholder="Where to?"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button className="search_go_btn" onClick={handleSearch}>
                            {loading ? "..." : "Go"}
                        </button>
                    </div>

                    {error && <p className="route_error">{error}</p>}

                    {duration && (
                        <div className="route_time">
                            <span className="time_label">{duration} mins</span>
                            <span className="commute_badge">{distance} km 🚗</span>
                        </div>
                    )}

                    {steps.length > 0 && (
                        <div className="route_steps">
                            {steps.map((step, index) => (
                                <div key={index} className="step">
                                    <div className="step_icon">{getStepIcon(step.mode)}</div>
                                    <div className="step_info">
                                        <span className="step_title">{step.instruction}</span>
                                        <span className="step_desc">{step.distance}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {steps.length === 0 && !error && !loading && (
                        <p className="route_placeholder">Enter a destination to see directions.</p>
                    )}

                    {loading && (
                        <p className="route_placeholder">Finding route...</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Route;
