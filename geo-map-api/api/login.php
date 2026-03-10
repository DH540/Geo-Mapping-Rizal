<?php
// Handles admin login

require_once "../config/cors.php";
require_once "../config/Database.php";
require_once "../models/User.php";

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status"  => "error",
        "message" => "Method not allowed."
    ]);
    exit();
}

// Get the posted JSON body from React
$data = json_decode(file_get_contents("php://input"));

// Check if email and password are present
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        "status"  => "error",
        "message" => "Email and password are required."
    ]);
    exit();
}

// Connect to the database
$database = new Database();
$db       = $database->getConnection();

// Create user object and set properties
$user                = new User($db);
$user->email         = $data->email;
$user->password_hash = $data->password; // plain text — password_verify() handles it in the model

// Attempt login
if ($user->login()) {
    http_response_code(200);
    echo json_encode([
        "status"  => "success",
        "message" => "Login successful.",
        "user"    => [
            "user_id" => $user->user_id,
            "email"   => $user->email
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status"  => "error",
        "message" => "Invalid email or password."
    ]);
}
?>