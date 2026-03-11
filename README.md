# Geo-Map Rizal
**Discover Hidden Gems, Inspire Adventure Everywhere!**

An interactive geo-mapping web application for exploring the province of Rizal, built with React, Leaflet, and a PHP/MySQL backend.

**Live Demo:** [geo-mapping-rizal.vercel.app](https://geo-mapping-rizal.vercel.app)
---

## Built With

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Admin Account Setup](#admin-account-setup)
- [Running the App](#running-the-app)

---

## Overview

Geo-Map Rizal is a web-based interactive map that lets users explore points of interest across Rizal province. The frontend is built with React + Vite and uses Leaflet for map rendering. The backend uses PHP with a MySQL database served through XAMPP.

---

## Prerequisites

Before you begin, make sure you have the following installed:

- [XAMPP](https://www.apachefriends.org/) (with Apache and MySQL)
- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## Installation

**1. Clone the repository into your XAMPP `htdocs` folder.**

Open a terminal and navigate to your XAMPP `htdocs` directory. The path depends on your OS:

| OS | Default Path |
|----|-------------|
| Windows | `C:/xampp/htdocs/` |

```bash
cd /path/to/your/xampp/htdocs
git clone <your-repository-url> GeoMap
```

**2. Start Apache and MySQL in XAMPP.**

Open the XAMPP Control Panel and click **Start** next to both **Apache** and **MySQL**.

---

## Database Setup

**3. Import the database schema.**

1. Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin) in your browser
2. Click **Import** in the top navigation
3. Click **Browse**, then locate and select `schema.sql` found at:
   ```
   GeoMap/Geo-Mapping-Rizal/geo-map-api/schema.sql
   ```
4. Click **Import** at the bottom of the page

---

## Admin Account Setup

**4. Create the admin user.**

In the `GeoMap/Geo-Mapping-Rizal/geo-map-api/` directory, create a new file called `admin.php` and paste the following code:

```php
<?php
require_once "config/Database.php";

$database = new Database();
$db       = $database->getConnection();

$email    = "admin@geomap.com";   // You can change this
$password = "admin123";            // You can change this

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$query = "INSERT INTO user (email, password_hash) VALUES (:email, :password_hash)";
$stmt  = $db->prepare($query);

$stmt->bindParam(":email",         $email);
$stmt->bindParam(":password_hash", $password_hash);

if ($stmt->execute()) {
    echo "Admin account created successfully! <br>";
    echo "Email: " . $email . "<br>";
    echo "Password: " . $password . "<br><br>";
    echo "<strong>DELETE THIS FILE NOW!</strong>";
} else {
    echo "Failed to create admin account.";
}
?>
```

**5. Run the script.**

Open your browser and go to:
```
http://localhost/GeoMap/Geo-Mapping-Rizal/geo-map-api/admin.php
```

**6. Verify the account was created.**

Go back to [http://localhost/phpmyadmin](http://localhost/phpmyadmin), open the database, and check the **user** table — your admin account should be listed there.

**7. Delete `admin.php` immediately.**

> 🔒 **Security:** Delete `admin.php` right after confirming the account was created. Leaving it accessible is a security risk.

---

## Running the App

**8. Install frontend dependencies.**

Open a terminal and navigate to the frontend directory:

```bash
cd GeoMap/Geo-Mapping-Rizal/geo-map
npm install
```

**9. Start the development server.**

```bash
npm run dev
```
