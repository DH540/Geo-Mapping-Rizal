import React, { useState } from "react";
import "./destinationCatalog.css";
import AddDestination from "./addDestination";

// TODO: Uncomment for backend integration
// import { fetchAllDestinations, createDestination, updateDestination, deleteDestination } from "./services/destinationApi";

const DestinationCatalog = () => {
    const [destinations, setDestinations] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingDestination, setEditingDestination] = useState(null);

    const handleAddNewDestination = () => {
        setEditingId(null);
        setEditingDestination(null);
        setShowAddForm(true);
    };

    const handleBackToCatalog = () => {
        setShowAddForm(false);
        setEditingId(null);
        setEditingDestination(null);
    };

    const handlePublishDestination = (newDestination) => {
        if (editingId !== null) {
            // EDIT MODE - Backend call should go here
            // TODO: Uncomment and implement:
            // try {
            //     const response = await updateDestination(destinations[editingId].id, newDestination);
            //     const updatedDestinations = destinations.map((dest, index) =>
            //         index === editingId ? { ...newDestination, id: response.data.id } : dest
            //     );
            //     setDestinations(updatedDestinations);
            // } catch (error) {
            //     console.error('Failed to update destination:', error);
            //     alert('Failed to update destination');
            // }
            
            // For now, update locally
            const updatedDestinations = destinations.map((dest, index) =>
                index === editingId ? newDestination : dest
            );
            setDestinations(updatedDestinations);
        } else {
            // ADD MODE - Backend call should go here
            // TODO: Uncomment and implement:
            // try {
            //     const response = await createDestination(newDestination);
            //     const destinationWithId = { ...newDestination, id: response.data.id };
            //     setDestinations([...destinations, destinationWithId]);
            // } catch (error) {
            //     console.error('Failed to create destination:', error);
            //     alert('Failed to create destination');
            // }
            
            // For now, add locally
            setDestinations([...destinations, newDestination]);
        }
        setShowAddForm(false);
        setEditingId(null);
        setEditingDestination(null);
    };

    const handleEditDestination = (index) => {
        // Backend call to fetch full destination data can go here
        // TODO: API call - GET /api/destinations/:id
        setEditingId(index);
        setEditingDestination(destinations[index]);
        setShowAddForm(true);
    };

    const handleDeleteDestination = (index) => {
        // Confirm before delete
        if (window.confirm("Are you sure you want to delete this destination?")) {
            // Backend call should go here
            // TODO: Uncomment and implement:
            // try {
            //     await deleteDestination(destinations[index].id);
            //     const updatedDestinations = destinations.filter((_, i) => i !== index);
            //     setDestinations(updatedDestinations);
            // } catch (error) {
            //     console.error('Failed to delete destination:', error);
            //     alert('Failed to delete destination');
            // }
            
            // For now, delete locally
            const updatedDestinations = destinations.filter((_, i) => i !== index);
            setDestinations(updatedDestinations);
        }
    };

    if (showAddForm) {
        return (
            <AddDestination 
                onBackToCatalog={handleBackToCatalog}
                onPublish={handlePublishDestination}
                editingDestination={editingDestination}
                isEditMode={editingId !== null}
            />
        );
    }

    return (
        <div className="destination_catalog">
            <div className="catalog_header">
                <h2 className="catalog_title">Destination Catalog</h2>
                <button className="add_destination_btn" onClick={handleAddNewDestination}>
                    + Add New Destination
                </button>
            </div>

            <div className="catalog_content">
                {destinations.length === 0 ? (
                    <div className="empty_catalog">
                        <p>No destinations added yet</p>
                        <p className="empty_hint">Click "+ Add New Destination" to start</p>
                    </div>
                ) : (
                    <div className="destinations_grid">
                        {destinations.map((dest, index) => (
                            <div key={index} className="destination_card">
                                <div className="dest_image">
                                    {dest.image && <img src={dest.image} alt={dest.name} />}
                                </div>
                                <div className="dest_info">
                                    <h3>{dest.name}</h3>
                                    <p className="dest_category">
                                        {dest.categories && dest.categories.length > 0 
                                            ? dest.categories.join(", ") 
                                            : "No category"}
                                    </p>
                                    <p className="dest_location">{dest.location}</p>
                                    <div className="dest_actions">
                                        <button 
                                            className="edit_btn"
                                            onClick={() => handleEditDestination(index)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete_btn"
                                            onClick={() => handleDeleteDestination(index)}
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
