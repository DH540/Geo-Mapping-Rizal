<?php
$request_origin = $_SERVER["HTTP_ORIGIN"] ?? "";

// Allow any vercel.app subdomain or localhost
if (
    preg_match('/^https:\/\/[\w-]+\.vercel\.app$/', $request_origin) ||
    $request_origin === "http://localhost:5173" ||
    $request_origin === "http://127.0.0.1:5173"
) {
    header("Access-Control-Allow-Origin: " . $request_origin);
} else {
    header("Access-Control-Allow-Origin: https://geo-map-rizal.vercel.app");
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}
?>