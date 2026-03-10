<?php
// Handles commute route step operations

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../models/RouteSteps.php";

// Connect to the database
$database = new Database();
$db       = $database->getConnection();

// Create route steps object
$route_steps = new RouteSteps($db);

// Fetch all route steps for a destination
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (empty($_GET["destination_id"])) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "Destination ID is required."
        ]);
        exit();
    }

    $route_steps->destination_id = $_GET["destination_id"];

    $stmt      = $route_steps->getByDestination();
    $row_count = $stmt->rowCount();

    if ($row_count > 0) {
        $steps_arr = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $steps_arr[] = [
                "step_id"        => $row["step_id"],
                "destination_id" => $row["destination_id"],
                "step_order"     => $row["step_order"],
                "transport_type" => $row["transport_type"],
                "from_location"  => $row["from_location"],
                "to_location"    => $row["to_location"]
            ];
        }

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "data"   => $steps_arr
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status"  => "error",
            "message" => "No route steps found for this destination."
        ]);
    }

// Add a new route step
} elseif ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"));

    if (
        empty($data->destination_id) ||
        empty($data->step_order)     ||
        empty($data->transport_type) ||
        empty($data->from_location)  ||
        empty($data->to_location)
    ) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "All fields are required."
        ]);
        exit();
    }

    $route_steps->destination_id = $data->destination_id;
    $route_steps->step_order     = $data->step_order;
    $route_steps->transport_type = $data->transport_type;
    $route_steps->from_location  = $data->from_location;
    $route_steps->to_location    = $data->to_location;

    if ($route_steps->create()) {
        http_response_code(201);
        echo json_encode([
            "status"  => "success",
            "message" => "Route step added successfully.",
            "data"    => [
                "step_id" => $route_steps->step_id
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to add route step."
        ]);
    }

// Remove all route steps for a destination
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

    $route_steps->destination_id = $data->destination_id;

    if ($route_steps->deleteByDestination()) {
        http_response_code(200);
        echo json_encode([
            "status"  => "success",
            "message" => "Route steps deleted successfully."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to delete route steps."
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