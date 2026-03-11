<?php
// Handles CORS headers so React can communicate with the API

$allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

$request_origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if ($request_origin !== "" && in_array($request_origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: " . $request_origin);
} elseif ($request_origin === "") {
    header("Access-Control-Allow-Origin: *");
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
?>
