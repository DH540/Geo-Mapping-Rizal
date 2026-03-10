<?php
// api/activities.php
// Handles fetching all preset activity categories

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../models/Activity.php";

// Only allow GET requests
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "status"  => "error",
        "message" => "Method not allowed."
    ]);
    exit();
}

// Connect to the database
$database = new Database();
$db       = $database->getConnection();

// Create activity object
$activity = new Activity($db);

// Fetch all activities
$stmt      = $activity->getAll();
$row_count = $stmt->rowCount();

if ($row_count > 0) {
    $activities_arr = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $activities_arr[] = [
            "activity_id" => $row["activity_id"],
            "name"        => $row["name"]
        ];
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "data"   => $activities_arr
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "status"  => "error",
        "message" => "No activities found."
    ]);
}
?>