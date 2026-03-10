<?php

class DestinationActivity {
    private $conn;
    private $table = "destination_activity";

    public $destination_id;
    public $activity_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetches all activities tagged to a specific destination
    public function getByDestination() {
        $query = "SELECT a.activity_id, a.name
                  FROM " . $this->table . " da
                  JOIN activity a ON da.activity_id = a.activity_id
                  WHERE da.destination_id = :destination_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->execute();

        return $stmt;
    }

    // Tags an activity to a destination
    public function assign() {
        $query = "INSERT INTO " . $this->table . "
                    (destination_id, activity_id)
                  VALUES
                    (:destination_id, :activity_id)";

        $stmt = $this->conn->prepare($query);

        $this->destination_id = htmlspecialchars(strip_tags($this->destination_id));
        $this->activity_id    = htmlspecialchars(strip_tags($this->activity_id));

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->bindParam(":activity_id",    $this->activity_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Removes all activity tags for a destination (used during edit)
    public function deleteByDestination() {
        $query = "DELETE FROM " . $this->table . "
                  WHERE destination_id = :destination_id";

        $stmt = $this->conn->prepare($query);

        $this->destination_id = htmlspecialchars(strip_tags($this->destination_id));

        $stmt->bindParam(":destination_id", $this->destination_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>