import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Header from './Home/header';
import Footer from './Home/footer';
import Hero from './Home/hero';
import Offers from './Home/offers';
import Promo from './Home/promo';
import RouteMap from './Route/route';
import Explore from './Explore/explore';
import Contact from './Contact/contact';
import AdminLogin from './Admin/adminLogin';
import AdminDashboard from './Admin/adminDashboard';

const ADMIN_STORAGE_KEY = 'geo-map-admin-user';

function getStoredAdminUser() {
    const storedValue = localStorage.getItem(ADMIN_STORAGE_KEY);

    if (!storedValue) {
        return null;
    }

    try {
        return JSON.parse(storedValue);
    } catch {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return null;
    }
}

export default function App() {
    const [adminUser, setAdminUser] = useState(() => getStoredAdminUser());

    const handleLoginSuccess = (user) => {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
        setAdminUser(user);
    };

    const handleLogout = () => {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        setAdminUser(null);
    };

    return (
        <div className="App">
            <Header />
            <Routes>
                {/* Home */}
                <Route path="/" element={
                    <main>
                        <Hero />
                        <Offers />
                        <Promo />
                    </main>
                } />

                {/* Explore */}
                <Route path="/explore" element={<Explore />} />

                {/* Routes */}
                <Route path="/routes" element={<RouteMap />} />

                {/* Contact */}
                <Route path="/contact" element={<Contact />} />

                {/* Admin Login */}
                <Route path="/admin" element={
                    adminUser
                        ? <Navigate to="/admin/dashboard" />
                        : <AdminLogin onLoginSuccess={handleLoginSuccess} />
                } />

                {/* Admin Dashboard - protected */}
                <Route path="/admin/dashboard" element={
                    adminUser
                        ? <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />
                        : <Navigate to="/admin" />
                } />
            </Routes>
            <Footer />
        </div>
    );
}
