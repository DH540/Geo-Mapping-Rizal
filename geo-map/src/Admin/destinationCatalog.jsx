import React, { useState } from "react";
import "./destinationCatalog.css";
import AddDestination from "./addDestination";
import {
    createDestination,
    deleteDestination,
    fetchDestinationById,
    updateDestination,
} from "./services/destinationApi";

const DestinationCatalog = ({ destinations, isLoading, error, onRefresh }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);
    const [actionError, setActionError] = useState("");
    const [isBusy, setIsBusy] = useState(false);

    const handleAddNewDestination = () => {
        setEditingDestination(null);
        setActionError("");
        setShowAddForm(true);
    };

    const handleBackToCatalog = () => {
        setShowAddForm(false);
        setEditingDestination(null);
        setActionError("");
    };

    const handlePublishDestination = async (destination) => {
        try {
            setIsBusy(true);
            setActionError("");

            if (editingDestination?.id) {
                await updateDestination(editingDestination.id, destination);
            } else {
                await createDestination(destination);
            }

            await onRefresh();
            handleBackToCatalog();
        } catch (saveError) {
            setActionError(saveError.message || "Failed to save destination.");
            throw saveError;
        } finally {
            setIsBusy(false);
        }
    };

    const handleEditDestination = async (destinationId) => {
        try {
            setIsBusy(true);
            setActionError("");

            const fullDestination = await fetchDestinationById(destinationId);
            setEditingDestination(fullDestination);
            setShowAddForm(true);
        } catch (loadError) {
            setActionError(loadError.message || "Failed to load destination.");
        } finally {
            setIsBusy(false);
        }
    };

    const handleDeleteDestination = async (destinationId) => {
        if (!window.confirm("Are you sure you want to delete this destination?")) {
            return;
        }

        try {
            setIsBusy(true);
            setActionError("");
            await deleteDestination(destinationId);
            await onRefresh();
        } catch (deleteError) {
            setActionError(deleteError.message || "Failed to delete destination.");
        } finally {
            setIsBusy(false);
        }
    };

    if (showAddForm) {
        return (
            <AddDestination
                onBackToCatalog={handleBackToCatalog}
                onPublish={handlePublishDestination}
                editingDestination={editingDestination}
                isEditMode={Boolean(editingDestination?.id)}
                isSubmitting={isBusy}
                error={actionError}
            />
        );
    }

    return (
        <div className="destination_catalog">
            <div className="catalog_header">
                <h2 className="catalog_title">Destination Catalog</h2>
                <button
                    className="add_destination_btn"
                    onClick={handleAddNewDestination}
                    disabled={isBusy}
                >
                    + Add New Destination
                </button>
            </div>

            <div className="catalog_content">
                {(error || actionError) && (
                    <p className="catalog_status_error">{actionError || error}</p>
                )}

                {isLoading ? (
                    <div className="empty_catalog">
                        <p>Loading destinations...</p>
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="empty_catalog">
                        <p>No destinations added yet</p>
                        <p className="empty_hint">Click "+ Add New Destination" to start</p>
                    </div>
                ) : (
                    <div className="destinations_grid">
                        {destinations.map((destination) => (
                            <div key={destination.id} className="destination_card">
                                <div className="dest_image">
                                    {destination.image && (
                                        <img src={destination.image} alt={destination.name} />
                                    )}
                                </div>
                                <div className="dest_info">
                                    <div>
                                        <h3>{destination.name}</h3>
                                        <p className="dest_category">
                                            {destination.activities.length > 0
                                                ? destination.activities
                                                    .map((activity) => activity.name)
                                                    .join(", ")
                                                : "No category"}
                                        </p>
                                        <p className="dest_location">{destination.location}</p>
                                        <p className="dest_location">
                                            Contact: {destination.contactEmail}
                                        </p>
                                    </div>
                                    <div className="dest_actions">
                                        <button
                                            className="edit_btn"
                                            onClick={() => handleEditDestination(destination.id)}
                                            disabled={isBusy}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete_btn"
                                            onClick={() => handleDeleteDestination(destination.id)}
                                            disabled={isBusy}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DestinationCatalog;
