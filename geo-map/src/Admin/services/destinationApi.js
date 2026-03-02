/**
 * API Services for Admin Panel - Destination Management
 * 
 * Backend Integration Guide
 * ==========================
 * This file shows where API calls should be integrated.
 * Replace the TODO comments with actual API calls using axios or fetch.
 */

// import axios from 'axios';
// const API_BASE_URL = 'http://your-backend-api.com/api';

/**
 * DESTINATIONS API ENDPOINTS
 */

// GET ALL DESTINATIONS
// URL: GET /api/destinations
// Response: { success: true, data: [...destinations] }
export const fetchAllDestinations = async () => {
    // TODO: Implement API call
    // return await axios.get(`${API_BASE_URL}/destinations`);
};

// GET SINGLE DESTINATION
// URL: GET /api/destinations/:id
// Response: { success: true, data: {...destination} }
export const fetchDestinationById = async (id) => {
    // TODO: Implement API call
    // return await axios.get(`${API_BASE_URL}/destinations/${id}`);
};

// CREATE NEW DESTINATION
// URL: POST /api/destinations
// Body: {
//   name: string,
//   location: string,
//   municipality: string,
//   description: string,
//   categories: string[],
//   latitude: string,
//   longitude: string,
//   image: file/base64string,
//   routes: [{ transportType, from, to }, ...]
// }
// Response: { success: true, data: {...createdDestination}, id: destinationId }
export const createDestination = async (destinationData) => {
    // TODO: Implement API call
    // const formData = new FormData();
    // formData.append('name', destinationData.name);
    // formData.append('location', destinationData.location);
    // ... append other fields
    // return await axios.post(`${API_BASE_URL}/destinations`, formData);
};

// UPDATE DESTINATION
// URL: PUT /api/destinations/:id
// Body: Same as CREATE
// Response: { success: true, data: {...updatedDestination} }
export const updateDestination = async (id, destinationData) => {
    // TODO: Implement API call
    // return await axios.put(`${API_BASE_URL}/destinations/${id}`, destinationData);
};

// DELETE DESTINATION
// URL: DELETE /api/destinations/:id
// Response: { success: true, message: "Destination deleted successfully" }
export const deleteDestination = async (id) => {
    // TODO: Implement API call
    // return await axios.delete(`${API_BASE_URL}/destinations/${id}`);
};

/**
 * COMMUTE ROUTES API ENDPOINTS
 */

// CREATE COMMUTE ROUTE
// URL: POST /api/destinations/:destinationId/routes
// Body: { transportType, from, to }
// Response: { success: true, data: {...route}, routeId: routeId }
export const createCommuteRoute = async (destinationId, routeData) => {
    // TODO: Implement API call
    // return await axios.post(`${API_BASE_URL}/destinations/${destinationId}/routes`, routeData);
};

// DELETE COMMUTE ROUTE
// URL: DELETE /api/destinations/:destinationId/routes/:routeId
// Response: { success: true, message: "Route deleted successfully" }
export const deleteCommuteRoute = async (destinationId, routeId) => {
    // TODO: Implement API call
    // return await axios.delete(`${API_BASE_URL}/destinations/${destinationId}/routes/${routeId}`);
};

/**
 * USAGE IN COMPONENTS
 * ====================
 * 
 * In destinationCatalog.jsx (lines with TODO comments):
 * 
 * 1. Fetch destinations on component load:
 *    useEffect(() => {
 *        fetchAllDestinations().then(res => setDestinations(res.data));
 *    }, []);
 * 
 * 2. Create destination (line 40):
 *    const response = await createDestination(newDestination);
 *    const destinationWithId = { ...newDestination, id: response.data.id };
 *    setDestinations([...destinations, destinationWithId]);
 * 
 * 3. Update destination (line 25):
 *    await updateDestination(destinations[editingId].id, newDestination);
 * 
 * 4. Delete destination (line 52):
 *    await deleteDestination(destinations[index].id);
 *    setDestinations(updatedDestinations);
 * 
 * In addDestination.jsx (for commute routes):
 * 
 * 1. Save route:
 *    const response = await createCommuteRoute(destinationId, routeData);
 *    setFormData(prev => ({
 *        ...prev,
 *        routes: [...prev.routes, { ...routeData, id: response.data.id }]
 *    }));
 */
