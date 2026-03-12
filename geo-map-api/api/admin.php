<?php
require_once "../config/Database.php";

$database = new Database();
$db       = $database->getConnection();

$db->prepare("DELETE FROM user WHERE email = 'admin@geomap.com'")->execute();

// Create a fresh one
$email = "admin@geomap.com";
$password = "admin123";
$password_hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare("INSERT INTO user (email, password_hash) VALUES (:email, :password_hash)");
$stmt->bindParam(":email", $email);
$stmt->bindParam(":password_hash", $password_hash);

if ($stmt->execute()) {
    echo "Done! Email: " . $email . " Password: " . $password;
} else {
    echo "Failed.";
}
?>