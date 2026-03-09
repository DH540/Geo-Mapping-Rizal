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

export default function App() {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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
                    isAdminLoggedIn
                        ? <Navigate to="/admin/dashboard" />
                        : <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
                } />

                {/* Admin Dashboard - protected */}
                <Route path="/admin/dashboard" element={
                    isAdminLoggedIn
                        ? <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
                        : <Navigate to="/admin" />
                } />
            </Routes>
            <Footer />
        </div>
    );
}