<?php
class Database {
    private $host     = "mysql.railway.internal";
    private $db_name  = "railway";
    private $username = "root";
    private $password = "tEqCqclfvJSDLPjByxkRHKowhQTqTgFZ";
    private $conn     = null;

    // Returns the database connection
    public function getConnection() {
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch (PDOException $e) {
            echo json_encode([
                "status"  => "error",
                "message" => "Connection failed: " . $e->getMessage()
            ]);
            die();
        }

        return $this->conn;
    }
}
?>