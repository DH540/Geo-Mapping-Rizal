<?php
// Handles CORS headers so React can communicate with the API

// Allow requests from the React dev server
header("Access-Control-Allow-Origin: http://localhost:5173");

// Allow HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow headers from React's fetch() calls
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// All responses will be in JSON
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
// Browsers send this automatically before the actual request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
?>