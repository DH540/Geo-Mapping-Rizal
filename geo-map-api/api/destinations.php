<?php
// Handles aggregate destination CRUD operations for the React frontend

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../models/Destination.php";
require_once "../models/DestinationActivity.php";
require_once "../models/DestinationImages.php";
require_once "../models/RouteSteps.php";

const ALLOWED_TRANSPORT_TYPES = ["Bus", "Jeep", "Tricycle", "Walk"];

function jsonResponse($status_code, $payload) {
    http_response_code($status_code);
    echo json_encode($payload);
    exit();
}

function getRequestData() {
    $data = json_decode(file_get_contents("php://input"), true);
    return is_array($data) ? $data : [];
}

function sanitizeText($value) {
    return trim((string) ($value ?? ""));
}

function normalizeActivityIds($activities) {
    if (!is_array($activities)) {
        return [];
    }

    $ids = [];

    foreach ($activities as $activity) {
        if (is_array($activity) && isset($activity["id"])) {
            $ids[] = (int) $activity["id"];
        } elseif (is_object($activity) && isset($activity->id)) {
            $ids[] = (int) $activity->id;
        } elseif (is_numeric($activity)) {
            $ids[] = (int) $activity;
        }
    }

    $ids = array_filter($ids, fn($id) => $id > 0);
    return array_values(array_unique($ids));
}

function validateRoutes($routes) {
    if (!is_array($routes)) {
        return "Routes must be an array.";
    }

    foreach ($routes as $index => $route) {
        if (!is_array($route)) {
            return "Each route must be an object.";
        }

        $transport_type = sanitizeText($route["transportType"] ?? "");
        $from_location  = sanitizeText($route["from"] ?? "");
        $to_location    = sanitizeText($route["to"] ?? "");

        if ($transport_type === "" || $from_location === "" || $to_location === "") {
            return "Every commute route must include transport type, from, and to.";
        }

        if (!in_array($transport_type, ALLOWED_TRANSPORT_TYPES, true)) {
            return "Unsupported transport type on route #" . ($index + 1) . ".";
        }
    }

    return null;
}

function validateDestinationPayload($data, $require_id = false) {
    if ($require_id) {
        $id = $data["id"] ?? $data["destination_id"] ?? null;
        if (!is_numeric($id) || (int) $id <= 0) {
            return "Destination ID is required.";
        }
    }

    $required_fields = [
        "name" => "Destination name is required.",
        "location" => "Location is required.",
        "municipality" => "Municipality is required.",
        "description" => "Description is required.",
        "contactEmail" => "Contact email is required."
    ];

    foreach ($required_fields as $field => $message) {
        if (sanitizeText($data[$field] ?? "") === "") {
            return $message;
        }
    }

    if (!filter_var($data["contactEmail"], FILTER_VALIDATE_EMAIL)) {
        return "A valid contact email is required.";
    }

    if (!isset($data["latitude"]) || !is_numeric($data["latitude"])) {
        return "Latitude must be a valid number.";
    }

    if (!isset($data["longitude"]) || !is_numeric($data["longitude"])) {
        return "Longitude must be a valid number.";
    }

    if (isset($data["image"]) && !is_null($data["image"]) && !is_string($data["image"])) {
        return "Image must be a string or null.";
    }

    if (isset($data["activities"]) && !is_array($data["activities"])) {
        return "Activities must be an array.";
    }

    $routes_error = validateRoutes($data["routes"] ?? []);
    if ($routes_error !== null) {
        return $routes_error;
    }

    return null;
}

function fetchActivitiesForDestination($destination_activity, $destination_id) {
    $destination_activity->destination_id = $destination_id;
    $stmt = $destination_activity->getByDestination();
    $activities = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $activities[] = [
            "id" => (int) $row["activity_id"],
            "name" => $row["name"]
        ];
    }

    return $activities;
}

function fetchPrimaryImageForDestination($destination_images, $destination_id) {
    $destination_images->destination_id = $destination_id;
    $stmt = $destination_images->getByDestination();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? $row["image_url"] : null;
}

function fetchRoutesForDestination($route_steps, $destination_id) {
    $route_steps->destination_id = $destination_id;
    $stmt = $route_steps->getByDestination();
    $routes = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $routes[] = [
            "id" => (int) $row["step_id"],
            "stepOrder" => (int) $row["step_order"],
            "transportType" => $row["transport_type"],
            "from" => $row["from_location"],
            "to" => $row["to_location"]
        ];
    }

    return $routes;
}

function formatDestinationRow($row, $destination_activity, $destination_images, $route_steps) {
    $destination_id = (int) $row["destination_id"];

    return [
        "id" => $destination_id,
        "name" => $row["name"],
        "location" => $row["location"],
        "municipality" => $row["municipality"],
        "description" => $row["description"],
        "contactEmail" => $row["contact_email"],
        "latitude" => (float) $row["latitude"],
        "longitude" => (float) $row["longitude"],
        "image" => fetchPrimaryImageForDestination($destination_images, $destination_id),
        "activities" => fetchActivitiesForDestination($destination_activity, $destination_id),
        "routes" => fetchRoutesForDestination($route_steps, $destination_id),
        "createdAt" => $row["created_at"],
        "updatedAt" => $row["updated_at"]
    ];
}

function syncDestinationRelations($data, $destination_id, $destination_activity, $destination_images, $route_steps) {
    $activity_ids = normalizeActivityIds($data["activities"] ?? []);

    $destination_activity->destination_id = $destination_id;
    if (!$destination_activity->deleteByDestination()) {
        throw new RuntimeException("Failed to reset destination activities.");
    }

    foreach ($activity_ids as $activity_id) {
        $destination_activity->destination_id = $destination_id;
        $destination_activity->activity_id = $activity_id;

        if (!$destination_activity->assign()) {
            throw new RuntimeException("Failed to assign destination activity.");
        }
    }

    $destination_images->destination_id = $destination_id;
    if (!$destination_images->deleteByDestination()) {
        throw new RuntimeException("Failed to reset destination image.");
    }

    $image = $data["image"] ?? null;
    if (is_string($image) && sanitizeText($image) !== "") {
        $destination_images->destination_id = $destination_id;
        $destination_images->image_url = $image;

        if (!$destination_images->upload()) {
            throw new RuntimeException("Failed to save destination image.");
        }
    }

    $route_steps->destination_id = $destination_id;
    if (!$route_steps->deleteByDestination()) {
        throw new RuntimeException("Failed to reset commute routes.");
    }

    foreach (($data["routes"] ?? []) as $index => $route) {
        $route_steps->destination_id = $destination_id;
        $route_steps->step_order = isset($route["stepOrder"]) && is_numeric($route["stepOrder"])
            ? (int) $route["stepOrder"]
            : $index + 1;
        $route_steps->transport_type = sanitizeText($route["transportType"] ?? "");
        $route_steps->from_location = sanitizeText($route["from"] ?? "");
        $route_steps->to_location = sanitizeText($route["to"] ?? "");

        if (!$route_steps->create()) {
            throw new RuntimeException("Failed to save commute route.");
        }
    }
}

$database = new Database();
$db = $database->getConnection();

$destination = new Destination($db);
$destination_activity = new DestinationActivity($db);
$destination_images = new DestinationImages($db);
$route_steps = new RouteSteps($db);

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (isset($_GET["id"])) {
        $destination->destination_id = (int) $_GET["id"];

        if (!$destination->getOne()) {
            jsonResponse(404, [
                "status" => "error",
                "message" => "Destination not found."
            ]);
        }

        jsonResponse(200, [
            "status" => "success",
            "data" => formatDestinationRow([
                "destination_id" => $destination->destination_id,
                "name" => $destination->name,
                "location" => $destination->location,
                "municipality" => $destination->municipality,
                "description" => $destination->description,
                "contact_email" => $destination->contact_email,
                "latitude" => $destination->latitude,
                "longitude" => $destination->longitude,
                "created_at" => $destination->created_at,
                "updated_at" => $destination->updated_at
            ], $destination_activity, $destination_images, $route_steps)
        ]);
    }

    $stmt = $destination->getAll();
    $destinations = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $destinations[] = formatDestinationRow($row, $destination_activity, $destination_images, $route_steps);
    }

    jsonResponse(200, [
        "status" => "success",
        "data" => $destinations
    ]);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = getRequestData();
    $validation_error = validateDestinationPayload($data, false);

    if ($validation_error !== null) {
        jsonResponse(400, [
            "status" => "error",
            "message" => $validation_error
        ]);
    }

    try {
        $db->beginTransaction();

        $destination->name = sanitizeText($data["name"] ?? "");
        $destination->location = sanitizeText($data["location"] ?? "");
        $destination->municipality = sanitizeText($data["municipality"] ?? "");
        $destination->description = sanitizeText($data["description"] ?? "");
        $destination->contact_email = sanitizeText($data["contactEmail"] ?? "");
        $destination->latitude = $data["latitude"];
        $destination->longitude = $data["longitude"];

        if (!$destination->create()) {
            throw new RuntimeException("Failed to create destination.");
        }

        syncDestinationRelations($data, $destination->destination_id, $destination_activity, $destination_images, $route_steps);
        $db->commit();

        $destination->getOne();

        jsonResponse(201, [
            "status" => "success",
            "message" => "Destination created successfully.",
            "data" => formatDestinationRow([
                "destination_id" => $destination->destination_id,
                "name" => $destination->name,
                "location" => $destination->location,
                "municipality" => $destination->municipality,
                "description" => $destination->description,
                "contact_email" => $destination->contact_email,
                "latitude" => $destination->latitude,
                "longitude" => $destination->longitude,
                "created_at" => $destination->created_at,
                "updated_at" => $destination->updated_at
            ], $destination_activity, $destination_images, $route_steps)
        ]);
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }

        jsonResponse(500, [
            "status" => "error",
            "message" => $error->getMessage()
        ]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = getRequestData();
    $validation_error = validateDestinationPayload($data, true);

    if ($validation_error !== null) {
        jsonResponse(400, [
            "status" => "error",
            "message" => $validation_error
        ]);
    }

    $destination_id = (int) ($data["id"] ?? $data["destination_id"]);
    $destination->destination_id = $destination_id;

    if (!$destination->getOne()) {
        jsonResponse(404, [
            "status" => "error",
            "message" => "Destination not found."
        ]);
    }

    try {
        $db->beginTransaction();

        $destination->destination_id = $destination_id;
        $destination->name = sanitizeText($data["name"] ?? "");
        $destination->location = sanitizeText($data["location"] ?? "");
        $destination->municipality = sanitizeText($data["municipality"] ?? "");
        $destination->description = sanitizeText($data["description"] ?? "");
        $destination->contact_email = sanitizeText($data["contactEmail"] ?? "");
        $destination->latitude = $data["latitude"];
        $destination->longitude = $data["longitude"];

        if (!$destination->update()) {
            throw new RuntimeException("Failed to update destination.");
        }

        syncDestinationRelations($data, $destination_id, $destination_activity, $destination_images, $route_steps);
        $db->commit();

        $destination->destination_id = $destination_id;
        $destination->getOne();

        jsonResponse(200, [
            "status" => "success",
            "message" => "Destination updated successfully.",
            "data" => formatDestinationRow([
                "destination_id" => $destination->destination_id,
                "name" => $destination->name,
                "location" => $destination->location,
                "municipality" => $destination->municipality,
                "description" => $destination->description,
                "contact_email" => $destination->contact_email,
                "latitude" => $destination->latitude,
                "longitude" => $destination->longitude,
                "created_at" => $destination->created_at,
                "updated_at" => $destination->updated_at
            ], $destination_activity, $destination_images, $route_steps)
        ]);
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }

        jsonResponse(500, [
            "status" => "error",
            "message" => $error->getMessage()
        ]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $data = getRequestData();
    $destination_id = $data["id"] ?? $data["destination_id"] ?? null;

    if (!is_numeric($destination_id) || (int) $destination_id <= 0) {
        jsonResponse(400, [
            "status" => "error",
            "message" => "Destination ID is required."
        ]);
    }

    $destination->destination_id = (int) $destination_id;

    if (!$destination->delete()) {
        jsonResponse(500, [
            "status" => "error",
            "message" => "Failed to delete destination."
        ]);
    }

    jsonResponse(200, [
        "status" => "success",
        "message" => "Destination deleted successfully."
    ]);
}

jsonResponse(405, [
    "status" => "error",
    "message" => "Method not allowed."
]);
?>
