import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./explore.css";
import { fetchAllDestinations } from "../Admin/services/destinationApi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FlyToLocation = ({ coords }) => {
    const map = useMap();

    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], 15, { duration: 1.5 });
        }
    }, [coords, map]);

    return null;
};

const Explore = () => {
    const [destinations, setDestinations] = useState([]);
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDestinations = async () => {
            try {
                setIsLoading(true);
                setError("");
                const data = await fetchAllDestinations();
                setDestinations(data);
                setResults(data);
            } catch (loadError) {
                setError(loadError.message || "Failed to load destinations.");
            } finally {
                setIsLoading(false);
            }
        };

        loadDestinations();
    }, []);

    useEffect(() => {
        const searchTerm = query.trim().toLowerCase();

        if (!searchTerm) {
            setResults(destinations);
            return;
        }

        const filtered = destinations.filter((destination) => {
            const activities = destination.activities
                .map((activity) => activity.name.toLowerCase())
                .join(" ");

            return (
                destination.name.toLowerCase().includes(searchTerm) ||
                destination.location.toLowerCase().includes(searchTerm) ||
                destination.municipality.toLowerCase().includes(searchTerm) ||
                destination.description.toLowerCase().includes(searchTerm) ||
                activities.includes(searchTerm)
            );
        });

        setResults(filtered);
    }, [query, destinations]);

    useEffect(() => {
        if (selectedPlace && !results.some((place) => place.id === selectedPlace.id)) {
            setSelectedPlace(null);
        }
    }, [results, selectedPlace]);

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const handleSelectPlace = (place) => {
        setSelectedPlace(place);
    };

    return (
        <div className="explore_page">
            <div className="explore_background">
                <img src="/img_background.png" alt="background" />
            </div>

            <div className="explore_content">
                <div className="explore_leftside">
                    <MapContainer
                        center={[14.6042, 121.3035]}
                        zoom={11}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {results.map((place) => (
                            <Marker
                                key={place.id}
                                position={[place.latitude, place.longitude]}
                                eventHandlers={{ click: () => handleSelectPlace(place) }}
                            >
                                <Popup>
                                    <strong>{place.name}</strong>
                                    <br />
                                    {place.description}
                                </Popup>
                            </Marker>
                        ))}

                        {selectedPlace && (
                            <FlyToLocation
                                coords={{
                                    lat: selectedPlace.latitude,
                                    lng: selectedPlace.longitude,
                                }}
                            />
                        )}
                    </MapContainer>
                </div>

                <div className="explore_rightside">
                    <div className="explore_search">
                        <span>Search</span>
                        <input
                            type="text"
                            placeholder="Search places in Rizal..."
                            value={query}
                            onChange={handleSearch}
                        />
                        {query && (
                            <button
                                className="clear_btn"
                                onClick={() => setQuery("")}
                                type="button"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <p className="results_count">
                        {results.length} place{results.length !== 1 ? "s" : ""} found
                    </p>

                    {error && <p className="explore_status">{error}</p>}
                    {isLoading && <p className="explore_status">Loading destinations...</p>}

                    <div className="explore_results">
                        {!isLoading && results.length > 0 ? (
                            results.map((place) => (
                                <div
                                    key={place.id}
                                    className={`place_card ${selectedPlace?.id === place.id ? "active" : ""}`}
                                    onClick={() => handleSelectPlace(place)}
                                >
                                    <div
                                        className="place_card_image"
                                        style={place.image ? { backgroundImage: `url(${place.image})` } : undefined}
                                    />
                                    <div className="place_card_info">
                                        <span className="place_category">
                                            {place.activities.map((activity) => activity.name).join(", ") || "Uncategorized"}
                                        </span>
                                        <h3 className="place_name">{place.name}</h3>
                                        <p className="place_desc">{place.description}</p>
                                        <p className="place_location_label">{place.location}</p>
                                    </div>
                                </div>
                            ))
                        ) : !isLoading && !error ? (
                            <div className="no_results">
                                <span>No results</span>
                                <p>No places found for <strong>{query}</strong></p>
                                <small>This place may not be registered yet.</small>
                            </div>
                        ) : null}
                    </div>

                    {selectedPlace && (
                        <div className="place_detail">
                            <div className="place_detail_header">
                                <h3>{selectedPlace.name}</h3>
                                <button
                                    className="close_btn"
                                    onClick={() => setSelectedPlace(null)}
                                    type="button"
                                >
                                    x
                                </button>
                            </div>
                            <span className="place_category">
                                {selectedPlace.activities.map((activity) => activity.name).join(", ") || "Uncategorized"}
                            </span>
                            <p>{selectedPlace.description}</p>
                            <p className="place_detail_contact">
                                Contact: {selectedPlace.contactEmail}
                            </p>
                            <div className="place_detail_coords">
                                <small>
                                    {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
                                </small>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
