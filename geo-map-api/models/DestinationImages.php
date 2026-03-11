<?php

class DestinationImages {
    private $conn;
    private $table = "destination_images";

    public $image_id;
    public $destination_id;
    public $image_url;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetches all images for a specific destination
    public function getByDestination() {
        $query = "SELECT image_id, destination_id, image_url
                  FROM " . $this->table . "
                  WHERE destination_id = :destination_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->execute();

        return $stmt;
    }

    // Adds a new image record for a destination
    public function upload() {
        $query = "INSERT INTO " . $this->table . "
                    (destination_id, image_url)
                  VALUES
                    (:destination_id, :image_url)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->destination_id = htmlspecialchars(strip_tags($this->destination_id));
        $this->image_url      = htmlspecialchars(strip_tags($this->image_url));

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->bindParam(":image_url",      $this->image_url);

        if ($stmt->execute()) {
            $this->image_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Removes a single image by image_id
    public function delete() {
        $query = "DELETE FROM " . $this->table . "
                  WHERE image_id = :image_id";

        $stmt = $this->conn->prepare($query);

        $this->image_id = htmlspecialchars(strip_tags($this->image_id));

        $stmt->bindParam(":image_id", $this->image_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Removes all images for a destination
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
