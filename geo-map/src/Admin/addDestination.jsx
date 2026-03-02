import React, { useState } from "react";
import "./addDestination.css";
import AddCommuteRoute from "./addCommuteRoute";

// TODO: Uncomment for backend integration
// import { createCommuteRoute, deleteCommuteRoute } from "./services/destinationApi";

const AddDestination = ({ onBackToCatalog, onPublish, editingDestination, isEditMode }) => {
    const [formData, setFormData] = useState({
        name: editingDestination?.name || "",
        location: editingDestination?.location || "",
        municipality: editingDestination?.municipality || "",
        description: editingDestination?.description || "",
        categories: editingDestination?.categories || [],
        latitude: editingDestination?.latitude || "",
        longitude: editingDestination?.longitude || "",
        image: editingDestination?.image || null,
        routes: editingDestination?.routes || []
    });

    const [showCommuteRouteModal, setShowCommuteRouteModal] = useState(false);    const categories = [
        { id: "waterfall", label: "Waterfall" },
        { id: "river", label: "River" },
        { id: "hiking", label: "Hiking Trail" },
        { id: "cave", label: "Cave" },
        { id: "landscape", label: "Protected Landscape" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(id => id !== categoryId)
                : [...prev.categories, categoryId]
        }));
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    image: event.target.result
                }));
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleImageClick = () => {
        const input = document.getElementById("image-upload");
        input?.click();
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    image: event.target.result
                }));
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handlePublish = (e) => {
        e.preventDefault();
        if (formData.name && formData.location) {
            onPublish(formData);
        } else {
            alert("Please fill in Destination Name and Location");
        }
    };

    const handleAddCommuteRoute = () => {
        setShowCommuteRouteModal(true);
    };

    const handleCloseCommuteRouteModal = () => {
        setShowCommuteRouteModal(false);
    };

    const handleSaveCommuteRoute = (routeData) => {
        // TODO: If destination already exists (editMode), add route to backend:
        // try {
        //     const response = await createCommuteRoute(editingDestination.id, routeData);
        //     setFormData(prev => ({
        //         ...prev,
        //         routes: [...prev.routes, { ...routeData, id: response.data.id }]
        //     }));
        // } catch (error) {
        //     console.error('Failed to add route:', error);
        // }
        
        // For now, add to local state
        setFormData(prev => ({
            ...prev,
            routes: [...prev.routes, routeData]
        }));
        setShowCommuteRouteModal(false);
    };

    return (
        <div className="add_destination_container">
            <div className="add_dest_header">
                <button className="back_btn" onClick={onBackToCatalog}>
                    ← Back to catalog
                </button>
                <button className="publish_btn" onClick={handlePublish}>
                    {isEditMode ? "Update Destination" : "Publish Destination"}
                </button>
            </div>

            <div className="add_dest_content">
                {/* Left Section - Form */}
                <div className="form_section">
                    <form onSubmit={handlePublish}>
                        <div className="form_group">
                            <label>Destination Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter destination name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Enter location"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Municipality</label>
                            <input
                                type="text"
                                name="municipality"
                                placeholder="Enter municipality"
                                value={formData.municipality}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form_group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="6"
                            />
                        </div>

                        <div className="form_group">
                            <label>Image Upload</label>
                            <div 
                                className="image_upload_area"
                                onDrop={handleImageDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={handleImageClick}
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="image_preview" />
                                ) : (
                                    <>
                                        <div className="upload_icon">🖼️</div>
                                        <p>Drag&Drop</p>
                                        <p className="upload_hint">Image here</p>
                                        <p className="upload_or">or</p>
                                        <p className="upload_click">Click to upload</p>
                                    </>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Section - Sidebar */}
                <div className="sidebar_section">
                    {/* Categories */}
                    <div className="sidebar_box">
                        <h3>Categories</h3>
                        <div className="categories_list">
                            {categories.map(cat => (
                                <label key={cat.id} className="category_item">
                                    <input
                                        type="checkbox"
                                        checked={formData.categories.includes(cat.id)}
                                        onChange={() => handleCategoryChange(cat.id)}
                                    />
                                    <span>{cat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Geolocation */}
                    <div className="sidebar_box">
                        <h3>Geolocation</h3>
                        <div className="geo_group">
                            <label>Latitude</label>
                            <input
                                type="text"
                                name="latitude"
                                placeholder="0.0000"
                                value={formData.latitude}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="geo_group">
                            <label>Longitude</label>
                            <input
                                type="text"
                                name="longitude"
                                placeholder="0.0000"
                                value={formData.longitude}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button 
                            type="button"
                            className="commute_route_btn"
                            onClick={handleAddCommuteRoute}
                        >
                            Add Commute Route
                        </button>
                    </div>
                </div>
            </div>

            {showCommuteRouteModal && (
                <AddCommuteRoute 
                    onClose={handleCloseCommuteRouteModal}
                    onSave={handleSaveCommuteRoute}
                />
            )}
        </div>
    );
};

export default AddDestination;
