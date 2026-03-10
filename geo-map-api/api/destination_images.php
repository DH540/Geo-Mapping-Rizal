<?php
// Handles destination image operations

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../models/DestinationImages.php";

$database = new Database();
$db       = $database->getConnection();

$destination_images = new DestinationImages($db);

// Fetch all images for a destination
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (empty($_GET["destination_id"])) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "Destination ID is required."
        ]);
        exit();
    }

    $destination_images->destination_id = $_GET["destination_id"];

    $stmt      = $destination_images->getByDestination();
    $row_count = $stmt->rowCount();

    if ($row_count > 0) {
        $images_arr = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images_arr[] = [
                "image_id"       => $row["image_id"],
                "destination_id" => $row["destination_id"],
                "image_url"      => $row["image_url"]
            ];
        }

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "data"   => $images_arr
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status"  => "error",
            "message" => "No images found for this destination."
        ]);
    }

// Upload a new image
} elseif ($_SERVER["REQUEST_METHOD"] === "POST") {

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->destination_id) || empty($data->image_url)) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "Destination ID and image URL are required."
        ]);
        exit();
    }

    $destination_images->destination_id = $data->destination_id;
    $destination_images->image_url      = $data->image_url;

    if ($destination_images->upload()) {
        http_response_code(201);
        echo json_encode([
            "status"  => "success",
            "message" => "Image uploaded successfully.",
            "data"    => [
                "image_id" => $destination_images->image_id
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to upload image."
        ]);
    }

// Remove an image
} elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {

    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->image_id)) {
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "message" => "Image ID is required."
        ]);
        exit();
    }

    $destination_images->image_id = $data->image_id;

    if ($destination_images->delete()) {
        http_response_code(200);
        echo json_encode([
            "status"  => "success",
            "message" => "Image deleted successfully."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Failed to delete image."
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