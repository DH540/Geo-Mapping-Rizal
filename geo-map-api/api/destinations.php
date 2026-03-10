<?php
// Handles all destination CRUD operations

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../models/Destination.php";

// Connect to the database
$database = new Database();
$db       = $database->getConnection();

// Create destination object
$destination = new Destination($db);

// Fetch all or one destination
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // GET ONE — if ?id= is provided
    if (isset($_GET["id"])) {
        $destination->destination_id = $_GET["id"];

        if ($destination->getOne()) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "data"   => [
                    "destination_id" => $destination->destination_id,
                    "name"           => $destination->name,
                    "municipality"   => $destination->municipality,
                    "description"    => $destination->description,
                    "email"          => $destination->email,
                    "latitude"       => $destination->latitude,
                    "longitude"      => $destination->longitude,
                    "created_at"     => $destination->created_at,
                    "updated_at"     => $destination->updated_at
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "status"  => "error",
                "message" => "Destination not found."
            ]);
        }

    // no query param
    } else {
        $stmt      = $destination->getAll();
        $row_count = $stmt->rowCount();

        if ($row_count > 0) {
            $destinations_arr = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $destinations_arr[] = [
                    "destination_id" => $row["destination_id"],
                    "name"           => $row["name"],
                    "municipality"   => $row["municipality"],
                    "description"    => $row["description"],
                    "email"          => $row["email"],
                    "latitude"       => $row["latitude"],
                    "longitude"      => $row["longitude"],
                    "created_at"     => $row["created_at"],
                    "updated_at"     => $row["updated_at"]
                ];
            }

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "data"   => $destinations_arr
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "status"  => "error",
                "message" => "No destinations found."
            ]);
        }
    }

// Create a new destination
} elseif ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"));

    if (
        empty($data->name)         ||
        empty($data->municipality) ||
        empty($data->description)  ||
        empty($data->email)        ||
        empty($data->latitude)     ||
        empty($data->longitude)
    ) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "All fields are required."
        ]);
        exit();
    }
    $destination->name         = $data->name;
    $destination->municipality = $data->municipality;
    $destination->description  = $data->description;
    $destination->email        = $data->email;
    $destination->latitude     = $data->latitude;
    $destination->longitude    = $data->longitude;

    if ($destination->create()) {
        http_response_code(201);
        echo json_encode([
            "status"  => "success",
            "message" => "Destination created successfully.",
            "data"    => [
                "destination_id" => $destination->destination_id
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to create destination."
        ]);
    }

// Update an existing destination
} elseif ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields
    if (
        empty($data->destination_id) ||
        empty($data->name)           ||
        empty($data->municipality)   ||
        empty($data->description)    ||
        empty($data->email)          ||
        empty($data->latitude)       ||
        empty($data->longitude)
    ) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "All fields are required."
        ]);
        exit();
    }

    $destination->destination_id = $data->destination_id;
    $destination->name           = $data->name;
    $destination->municipality   = $data->municipality;
    $destination->description    = $data->description;
    $destination->email          = $data->email;
    $destination->latitude       = $data->latitude;
    $destination->longitude      = $data->longitude;

    if ($destination->update()) {
        http_response_code(200);
        echo json_encode([
            "status"  => "success",
            "message" => "Destination updated successfully."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to update destination."
        ]);
    }

// Remove a destination
} elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->destination_id)) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "Destination ID is required."
        ]);
        exit();
    }

    $destination->destination_id = $data->destination_id;

    if ($destination->delete()) {
        http_response_code(200);
        echo json_encode([
            "status"  => "success",
            "message" => "Destination deleted successfully."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to delete destination."
        ]);
    }

// Method not allowed
} else {
    http_response_code(405);
    echo json_encode([
        "status"  => "error",
        "message" => "Method not allowed."
    ]);
}
?>