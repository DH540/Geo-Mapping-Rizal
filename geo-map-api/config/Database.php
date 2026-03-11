<?php
class Database {
    private $host     = "fdb1032.awardspace.net";
    private $db_name  = "4742039_rizaldb";
    private $username = "4742039_rizaldb";
    private $password = "WebSys2026";
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