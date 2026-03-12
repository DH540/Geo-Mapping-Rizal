<?php
// Handles CORS headers so React can communicate with the API

$allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://geo-map-rizal.vercel.app",
    "https://geo-mapping-rizal-2j2h3j1xm-dh540s-projects.vercel.app/"
];

$request_origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if ($request_origin !== "" && in_array($request_origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: " . $request_origin);
} else {

    header("Access-Control-Allow-Origin: https://geo-map-rizal.vercel.app");
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {  
    http_response_code(204);
    exit();
}
?>
