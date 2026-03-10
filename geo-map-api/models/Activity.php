<?php
class Activity {
    private $conn;
    private $table = "activity";

    public $activity_id;
    public $name;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetches all preset activity categories
    public function getAll() {
        $query = "SELECT activity_id, name
                  FROM " . $this->table . "
                  ORDER BY activity_id ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>