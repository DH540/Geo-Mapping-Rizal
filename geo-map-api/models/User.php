<?php
class User {
    private $conn;
    private $table = "user";

    public $user_id;
    public $email;
    public $password_hash;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Admin login method
    public function login() {
        $query = "SELECT user_id, email, password_hash
                  FROM " . $this->table . "
                  WHERE email = :email
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->email = htmlspecialchars(strip_tags($this->email));

        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && password_verify($this->password_hash, $row["password_hash"])) {
            $this->user_id       = $row["user_id"];
            $this->email         = $row["email"];
            $this->password_hash = $row["password_hash"];
            return true;
        }

        return false;
    }
}
?>