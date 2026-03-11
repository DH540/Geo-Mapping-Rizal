import { apiRequest } from "../../services/api";

const normalizeActivity = (activity) => ({
    id: Number(activity.id ?? activity.activity_id),
    name: activity.name,
});

const normalizeRoute = (route, index) => ({
    id: route.id ?? route.step_id ?? null,
    stepOrder: Number(route.stepOrder ?? route.step_order ?? index + 1),
    transportType: route.transportType ?? route.transport_type,
    from: route.from ?? route.from_location ?? "",
    to: route.to ?? route.to_location ?? "",
});

const normalizeDestination = (destination) => ({
    id: Number(destination.id ?? destination.destination_id),
    name: destination.name ?? "",
    location: destination.location ?? "",
    municipality: destination.municipality ?? "",
    description: destination.description ?? "",
    contactEmail: destination.contactEmail ?? destination.contact_email ?? "",
    latitude: Number(destination.latitude ?? 0),
    longitude: Number(destination.longitude ?? 0),
    image: destination.image ?? destination.image_url ?? null,
    activities: Array.isArray(destination.activities)
        ? destination.activities.map(normalizeActivity)
        : [],
    routes: Array.isArray(destination.routes)
        ? destination.routes.map(normalizeRoute)
        : [],
    createdAt: destination.createdAt ?? destination.created_at ?? null,
    updatedAt: destination.updatedAt ?? destination.updated_at ?? null,
});

const buildDestinationPayload = (destination) => ({
    name: destination.name,
    location: destination.location,
    municipality: destination.municipality,
    description: destination.description,
    contactEmail: destination.contactEmail,
    latitude: Number(destination.latitude),
    longitude: Number(destination.longitude),
    image: destination.image || null,
    activities: (destination.activities || []).map((activity) => ({
        id: Number(activity.id ?? activity.activity_id),
        name: activity.name,
    })),
    routes: (destination.routes || []).map((route, index) => ({
        stepOrder: Number(route.stepOrder ?? index + 1),
        transportType: route.transportType,
        from: route.from,
        to: route.to,
    })),
});

export async function fetchAllDestinations() {
    const response = await apiRequest("/destinations.php");
    return (response.data || []).map(normalizeDestination);
}

export async function fetchDestinationById(id) {
    const response = await apiRequest(`/destinations.php?id=${id}`);
    return normalizeDestination(response.data);
}

export async function fetchActivities() {
    const response = await apiRequest("/activities.php");
    return (response.data || []).map(normalizeActivity);
}

export async function createDestination(destinationData) {
    const response = await apiRequest("/destinations.php", {
        method: "POST",
        body: buildDestinationPayload(destinationData),
    });

    return normalizeDestination(response.data);
}

export async function updateDestination(id, destinationData) {
    const response = await apiRequest("/destinations.php", {
        method: "PUT",
        body: {
            id,
            ...buildDestinationPayload(destinationData),
        },
    });

    return normalizeDestination(response.data);
}

export async function deleteDestination(id) {
    await apiRequest("/destinations.php", {
        method: "DELETE",
        body: { id },
    });
}
