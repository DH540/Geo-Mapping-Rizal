-- ============================================================
-- Rizal Tourism Website — Database Schema
-- Database: geo_map_rizal
-- ============================================================

CREATE TABLE IF NOT EXISTS user (
    user_id       INT             NOT NULL AUTO_INCREMENT,
    email         VARCHAR(255)    NOT NULL UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS destination (
    destination_id  INT             NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255)    NOT NULL,
    location        VARCHAR(255)    NOT NULL,
    municipality    VARCHAR(255)    NOT NULL,
    description     TEXT            NOT NULL,
    contact_email   VARCHAR(255)    NOT NULL,
    latitude        DECIMAL(10, 7)  NOT NULL,
    longitude       DECIMAL(10, 7)  NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (destination_id)
);

CREATE TABLE IF NOT EXISTS destination_images (
    image_id        INT             NOT NULL AUTO_INCREMENT,
    destination_id  INT             NOT NULL,
    image_url       LONGTEXT        NOT NULL,
    PRIMARY KEY (image_id),
    FOREIGN KEY (destination_id) REFERENCES destination(destination_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity (
    activity_id     INT             NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL UNIQUE,
    PRIMARY KEY (activity_id)
);

CREATE TABLE IF NOT EXISTS destination_activity (
    destination_id  INT NOT NULL,
    activity_id     INT NOT NULL,
    PRIMARY KEY (destination_id, activity_id),
    FOREIGN KEY (destination_id) REFERENCES destination(destination_id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id)    REFERENCES activity(activity_id)       ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS route_steps (
    step_id         INT             NOT NULL AUTO_INCREMENT,
    destination_id  INT             NOT NULL,
    step_order      INT             NOT NULL,
    transport_type  ENUM('Bus', 'Jeep', 'Tricycle', 'Walk') NOT NULL,
    from_location   VARCHAR(255)    NOT NULL,
    to_location     VARCHAR(255)    NOT NULL,
    PRIMARY KEY (step_id),
    FOREIGN KEY (destination_id) REFERENCES destination(destination_id) ON DELETE CASCADE
);

INSERT IGNORE INTO activity (name) VALUES
    ('Camping'),
    ('Hiking'),
    ('Mountain Climbing'),
    ('Swimming'),
    ('Biking'),
    ('Trekking');
