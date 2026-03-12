<?php
require_once "config/Database.php";

$database = new Database();
$db       = $database->getConnection();

$email    = "admin@geomap.com";   //pwede nyo itong palitan
$password = "admin123";            //same here

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$query = "INSERT INTO user (email, password_hash) VALUES (:email, :password_hash)";
$stmt  = $db->prepare($query);

$stmt->bindParam(":email",         $email);
$stmt->bindParam(":password_hash", $password_hash);

if ($stmt->execute()) {
    echo "Admin account created successfully! <br>";
    echo "Email: " . $email . "<br>";
    echo "Password: " . $password . "<br><br>";
    echo "<strong>DELETE THIS FILE NOW!</strong>";
} else {
    echo "Failed to create admin account.";
}
?>