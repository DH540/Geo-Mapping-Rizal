import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./explore.css";

// ============================================
// DUMMY DATABASE - replace with real API later
// TODO: replace with → fetch('/api/places/search?q=' + query)
const DUMMY_PLACES = [
    { id: 1, name: "Viewscapes Nature Park", category: "Nature", description: "A scenic nature park in Taytay, Rizal with breathtaking views.", lat: 14.5562, lng: 121.1347, image: "/viewscapes.png" },
    { id: 2, name: "Hinulugang Taktak", category: "Waterfall", description: "A famous waterfall and national park in Antipolo, Rizal.", lat: 14.6258, lng: 121.1742, image: "/taktak.png" },
    { id: 3, name: "Masungi Georeserve", category: "Adventure", description: "A conservation area with stunning limestone karsts and trails.", lat: 14.6908, lng: 121.2344, image: "/masungi.png" },
    { id: 4, name: "Mt. Daraitan", category: "Hiking", description: "A popular hiking destination with a river view in Tanay.", lat: 14.6553, lng: 121.4089, image: "/daraitan.png" },
    { id: 5, name: "Daranak Falls", category: "Waterfall", description: "A beautiful waterfall perfect for swimming in Tanay, Rizal.", lat: 14.6372, lng: 121.3561, image: "/daranak.png" },
    { id: 6, name: "Antipolo Cathedral", category: "Heritage", description: "Our Lady of Peace and Good Voyage Church in Antipolo.", lat: 14.6257, lng: 121.1756, image: "/cathedral.png" },
    { id: 7, name: "Treasure Mountain", category: "Camping", description: "A campsite with a stunning panoramic view in Montalban.", lat: 14.7431, lng: 121.1367, image: "/treasure.png" },
    { id: 8, name: "Wawa Dam", category: "Nature", description: "A historic dam surrounded by lush nature in Rodriguez.", lat: 14.7589, lng: 121.1823, image: "/wawa.png" },
];
// ============================================

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Fly to location on map
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
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(DUMMY_PLACES);
    const [selectedPlace, setSelectedPlace] = useState(null);

    // ============================================
    // SEARCH - scans dummy database
    // TODO: replace with real API call:
    // const res = await fetch('/api/places/search?q=' + query)
    // const data = await res.json()
    // setResults(data)
    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length === 0) {
            setResults(DUMMY_PLACES);
            return;
        }

        const filtered = DUMMY_PLACES.filter((place) =>
            place.name.toLowerCase().includes(value.toLowerCase()) ||
            place.category.toLowerCase().includes(value.toLowerCase()) ||
            place.description.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
    };
    // ============================================

    const handleSelectPlace = (place) => {
        setSelectedPlace(place);
    };

    return (
        <div className="explore_page">
            <div className="explore_background">
                <img src="/img_background.png" alt="background" />
            </div>

            <div className="explore_content">

                {/* LEFT - MAP */}
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

                        {/* Show all places as markers */}
                        {results.map((place) => (
                            <Marker
                                key={place.id}
                                position={[place.lat, place.lng]}
                                eventHandlers={{ click: () => handleSelectPlace(place) }}
                            >
                                <Popup>
                                    <strong>{place.name}</strong>
                                    <br />
                                    {place.description}
                                </Popup>
                            </Marker>
                        ))}

                        {/* Fly to selected place */}
                        {selectedPlace && (
                            <FlyToLocation coords={{ lat: selectedPlace.lat, lng: selectedPlace.lng }} />
                        )}
                    </MapContainer>
                </div>

                {/* RIGHT - SEARCH + RESULTS */}
                <div className="explore_rightside">

                    {/* SEARCH BAR */}
                    <div className="explore_search">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search places in Rizal..."
                            value={query}
                            onChange={handleSearch}
                        />
                        {query && (
                            <button className="clear_btn" onClick={() => { setQuery(""); setResults(DUMMY_PLACES); }}>✕</button>
                        )}
                    </div>

                    {/* RESULTS COUNT */}
                    <p className="results_count">
                        {results.length} place{results.length !== 1 ? "s" : ""} found
                    </p>

                    {/* PLACE CARDS */}
                    <div className="explore_results">
                        {results.length > 0 ? (
                            results.map((place) => (
                                <div
                                    key={place.id}
                                    className={`place_card ${selectedPlace?.id === place.id ? "active" : ""}`}
                                    onClick={() => handleSelectPlace(place)}
                                >
                                    <div className="place_card_image"
                                        style={{ backgroundImage: `url(${place.image})` }}
                                    />
                                    <div className="place_card_info">
                                        <span className="place_category">{place.category}</span>
                                        <h3 className="place_name">{place.name}</h3>
                                        <p className="place_desc">{place.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no_results">
                                <span>😕</span>
                                <p>No places found for "<strong>{query}</strong>"</p>
                                <small>This place may not be registered yet.</small>
                            </div>
                        )}
                    </div>

                    {/* SELECTED PLACE DETAIL */}
                    {selectedPlace && (
                        <div className="place_detail">
                            <div className="place_detail_header">
                                <h3>{selectedPlace.name}</h3>
                                <button className="close_btn" onClick={() => setSelectedPlace(null)}>✕</button>
                            </div>
                            <span className="place_category">{selectedPlace.category}</span>
                            <p>{selectedPlace.description}</p>
                            <div className="place_detail_coords">
                                <small>📍 {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}</small>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Explore;