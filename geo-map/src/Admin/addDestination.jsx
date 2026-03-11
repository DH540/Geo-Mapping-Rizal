import React, { useEffect, useState } from "react";
import "./addDestination.css";
import AddCommuteRoute from "./addCommuteRoute";
import { fetchActivities } from "./services/destinationApi";

function buildInitialFormData(destination) {
    return {
        name: destination?.name || "",
        location: destination?.location || "",
        municipality: destination?.municipality || "",
        description: destination?.description || "",
        contactEmail: destination?.contactEmail || "",
        activityIds: destination?.activities?.map((activity) => activity.id) || [],
        latitude: destination?.latitude || "",
        longitude: destination?.longitude || "",
        image: destination?.image || null,
        routes: destination?.routes?.map((route, index) => ({
            id: route.id || null,
            stepOrder: route.stepOrder || index + 1,
            transportType: route.transportType,
            from: route.from,
            to: route.to,
        })) || [],
    };
}

const AddDestination = ({
    onBackToCatalog,
    onPublish,
    editingDestination,
    isEditMode,
    isSubmitting,
    error,
}) => {
    const [formData, setFormData] = useState(() => buildInitialFormData(editingDestination));
    const [showCommuteRouteModal, setShowCommuteRouteModal] = useState(false);
    const [availableActivities, setAvailableActivities] = useState([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        setFormData(buildInitialFormData(editingDestination));
    }, [editingDestination]);

    useEffect(() => {
        const loadActivities = async () => {
            try {
                setIsLoadingActivities(true);
                const activities = await fetchActivities();
                setAvailableActivities(activities);
            } catch (loadError) {
                setFormError(loadError.message || "Failed to load activities.");
            } finally {
                setIsLoadingActivities(false);
            }
        };

        loadActivities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormError("");
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleActivityChange = (activityId) => {
        setFormData((prev) => ({
            ...prev,
            activityIds: prev.activityIds.includes(activityId)
                ? prev.activityIds.filter((id) => id !== activityId)
                : [...prev.activityIds, activityId],
        }));
    };

    const loadImageFromFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData((prev) => ({
                ...prev,
                image: event.target?.result || null,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];

        if (file) {
            loadImageFromFile(file);
        }
    };

    const handleImageClick = () => {
        document.getElementById("image-upload")?.click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            loadImageFromFile(file);
        }
    };

    const handlePublish = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.location ||
            !formData.municipality ||
            !formData.description ||
            !formData.contactEmail
        ) {
            setFormError("Please fill in all required destination details.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            setFormError("Please enter a valid contact email.");
            return;
        }

        if (formData.latitude === "" || formData.longitude === "") {
            setFormError("Latitude and longitude are required.");
            return;
        }

        const selectedActivities = availableActivities.filter((activity) =>
            formData.activityIds.includes(activity.id)
        );

        try {
            setFormError("");

            await onPublish({
                name: formData.name.trim(),
                location: formData.location.trim(),
                municipality: formData.municipality.trim(),
                description: formData.description.trim(),
                contactEmail: formData.contactEmail.trim(),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                image: formData.image,
                activities: selectedActivities,
                routes: formData.routes.map((route, index) => ({
                    id: route.id,
                    stepOrder: index + 1,
                    transportType: route.transportType,
                    from: route.from.trim(),
                    to: route.to.trim(),
                })),
            });
        } catch (publishError) {
            setFormError(publishError.message || "Failed to save destination.");
        }
    };

    const handleSaveCommuteRoute = (routeData) => {
        setFormData((prev) => ({
            ...prev,
            routes: [
                ...prev.routes,
                {
                    ...routeData,
                    stepOrder: prev.routes.length + 1,
                },
            ],
        }));
        setShowCommuteRouteModal(false);
    };

    const handleRemoveRoute = (routeIndex) => {
        setFormData((prev) => ({
            ...prev,
            routes: prev.routes
                .filter((_, index) => index !== routeIndex)
                .map((route, index) => ({
                    ...route,
                    stepOrder: index + 1,
                })),
        }));
    };

    return (
        <div className="add_destination_container">
            <div className="add_dest_header">
                <button className="back_btn" onClick={onBackToCatalog} type="button">
                    Back to catalog
                </button>
                <button
                    className="publish_btn"
                    onClick={handlePublish}
                    type="button"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Saving..."
                        : isEditMode
                            ? "Update Destination"
                            : "Publish Destination"}
                </button>
            </div>

            <div className="add_dest_content">
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
                            <label>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                placeholder="Enter public contact email"
                                value={formData.contactEmail}
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
                                className={`image_upload_area ${formData.image ? "has-image" : ""}`}
                                onDrop={handleImageDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={handleImageClick}
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="image_preview" />
                                ) : (
                                    <>
                                        <div className="upload_icon">Image</div>
                                        <p>Drag and drop an image here</p>
                                        <p className="upload_hint">Stored as the destination primary image</p>
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

                        {(formError || error) && (
                            <p className="form_error_message">{formError || error}</p>
                        )}
                    </form>
                </div>

                <div className="sidebar_section">
                    <div className="sidebar_box">
                        <h3>Categories</h3>
                        {isLoadingActivities ? (
                            <p className="sidebar_note">Loading activities...</p>
                        ) : availableActivities.length === 0 ? (
                            <p className="sidebar_note">No activities available yet.</p>
                        ) : (
                            <div className="categories_list">
                                {availableActivities.map((activity) => (
                                    <label key={activity.id} className="category_item">
                                        <input
                                            type="checkbox"
                                            checked={formData.activityIds.includes(activity.id)}
                                            onChange={() => handleActivityChange(activity.id)}
                                        />
                                        <span>{activity.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

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
                            onClick={() => setShowCommuteRouteModal(true)}
                        >
                            Add Commute Route
                        </button>

                        {formData.routes.length > 0 && (
                            <div className="route_list">
                                {formData.routes.map((route, index) => (
                                    <div key={`${route.transportType}-${route.from}-${route.to}-${index}`} className="route_list_item">
                                        <div>
                                            <strong>{route.transportType}</strong>
                                            <p>{route.from} to {route.to}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="route_remove_btn"
                                            onClick={() => handleRemoveRoute(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showCommuteRouteModal && (
                <AddCommuteRoute
                    onClose={() => setShowCommuteRouteModal(false)}
                    onSave={handleSaveCommuteRoute}
                />
            )}
        </div>
    );
};

export default AddDestination;
