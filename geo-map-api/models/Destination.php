<?php

class Destination {
    private $conn;
    private $table = "destination";

    public $destination_id;
    public $name;
    public $location;
    public $municipality;
    public $description;
    public $contact_email;
    public $latitude;
    public $longitude;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetches all destinations
    public function getAll() {
        $query = "SELECT destination_id, name, location, municipality, description,
                         contact_email, latitude, longitude, created_at, updated_at
                  FROM " . $this->table . "
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Fetches a single destination by ID
    public function getOne() {
        $query = "SELECT destination_id, name, location, municipality, description,
                         contact_email, latitude, longitude, created_at, updated_at
                  FROM " . $this->table . "
                  WHERE destination_id = :destination_id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":destination_id", $this->destination_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->destination_id = $row["destination_id"];
            $this->name           = $row["name"];
            $this->location       = $row["location"];
            $this->municipality   = $row["municipality"];
            $this->description    = $row["description"];
            $this->contact_email  = $row["contact_email"];
            $this->latitude       = $row["latitude"];
            $this->longitude      = $row["longitude"];
            $this->created_at     = $row["created_at"];
            $this->updated_at     = $row["updated_at"];
            return true;
        }

        return false;
    }

    // Adds a new destination
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                    (name, location, municipality, description, contact_email, latitude, longitude)
                  VALUES
                    (:name, :location, :municipality, :description, :contact_email, :latitude, :longitude)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->name         = htmlspecialchars(strip_tags($this->name));
        $this->location     = htmlspecialchars(strip_tags($this->location));
        $this->municipality = htmlspecialchars(strip_tags($this->municipality));
        $this->description  = htmlspecialchars(strip_tags($this->description));
        $this->contact_email = htmlspecialchars(strip_tags($this->contact_email));
        $this->latitude     = htmlspecialchars(strip_tags($this->latitude));
        $this->longitude    = htmlspecialchars(strip_tags($this->longitude));

        $stmt->bindParam(":name",         $this->name);
        $stmt->bindParam(":location",     $this->location);
        $stmt->bindParam(":municipality", $this->municipality);
        $stmt->bindParam(":description",  $this->description);
        $stmt->bindParam(":contact_email", $this->contact_email);
        $stmt->bindParam(":latitude",     $this->latitude);
        $stmt->bindParam(":longitude",    $this->longitude);

        if ($stmt->execute()) {
            $this->destination_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Edits an existing destination
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET name         = :name,
                      location     = :location,
                      municipality = :municipality,
                      description  = :description,
                      contact_email = :contact_email,
                      latitude     = :latitude,
                      longitude    = :longitude
                  WHERE destination_id = :destination_id";

        $stmt = $this->conn->prepare($query);

        $this->name           = htmlspecialchars(strip_tags($this->name));
        $this->location       = htmlspecialchars(strip_tags($this->location));
        $this->municipality   = htmlspecialchars(strip_tags($this->municipality));
        $this->description    = htmlspecialchars(strip_tags($this->description));
        $this->contact_email  = htmlspecialchars(strip_tags($this->contact_email));
        $this->latitude       = htmlspecialchars(strip_tags($this->latitude));
        $this->longitude      = htmlspecialchars(strip_tags($this->longitude));
        $this->destination_id = htmlspecialchars(strip_tags($this->destination_id));

        $stmt->bindParam(":name",           $this->name);
        $stmt->bindParam(":location",       $this->location);
        $stmt->bindParam(":municipality",   $this->municipality);
        $stmt->bindParam(":description",    $this->description);
        $stmt->bindParam(":contact_email",  $this->contact_email);
        $stmt->bindParam(":latitude",       $this->latitude);
        $stmt->bindParam(":longitude",      $this->longitude);
        $stmt->bindParam(":destination_id", $this->destination_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Removes a destination (cascades to images, activities, routes)
    public function delete() {
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
