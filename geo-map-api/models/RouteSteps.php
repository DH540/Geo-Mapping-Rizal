<?php

class RouteSteps {
    private $conn;
    private $table = "route_steps";

    public $step_id;
    public $destination_id;
    public $step_order;
    public $transport_type;
    public $from_location;
    public $to_location;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetches all route steps for a destination in order
    public function getByDestination() {
        $query = "SELECT step_id, destination_id, step_order,
                         transport_type, from_location, to_location
                  FROM " . $this->table . "
                  WHERE destination_id = :destination_id
                  ORDER BY step_order ASC";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->execute();

        return $stmt;
    }

    // Adds a single route step for a destination
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                    (destination_id, step_order, transport_type, from_location, to_location)
                  VALUES
                    (:destination_id, :step_order, :transport_type, :from_location, :to_location)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->destination_id = htmlspecialchars(strip_tags($this->destination_id));
        $this->step_order     = htmlspecialchars(strip_tags($this->step_order));
        $this->transport_type = htmlspecialchars(strip_tags($this->transport_type));
        $this->from_location  = htmlspecialchars(strip_tags($this->from_location));
        $this->to_location    = htmlspecialchars(strip_tags($this->to_location));

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->bindParam(":step_order",     $this->step_order);
        $stmt->bindParam(":transport_type", $this->transport_type);
        $stmt->bindParam(":from_location",  $this->from_location);
        $stmt->bindParam(":to_location",    $this->to_location);

        if ($stmt->execute()) {
            $this->step_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Removes all route steps for a destination (used during edit)
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