<?php
class Database {
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    private $conn = null;

    public function __construct() {
        $this->host     = getenv('MYSQLHOST')     ?: 'localhost';
        $this->port     = getenv('MYSQLPORT')     ?: '3306';
        $this->db_name  = getenv('MYSQLDATABASE') ?: 'railway';
        $this->username = getenv('MYSQLUSER')     ?: 'root';
        $this->password = getenv('MYSQLPASSWORD') ?: '';
    }

    public function getConnection() {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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