<?php
require_once "../config/Database.php";

$database = new Database();
$db       = $database->getConnection();

$stmt = $db->prepare("SELECT email, password_hash FROM user");
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
?>