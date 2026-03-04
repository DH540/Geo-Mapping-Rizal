import './App.css';
import { useState } from 'react';
import Header from './Home/header';
import Footer from './Home/footer';
import Hero from './Home/hero';
import Offers from './Home/offers';
import Promo from './Home/promo';
import Route from './Route/route';
import AdminLogin from './Admin/adminLogin';
import AdminDashboard from './Admin/adminDashboard';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const handleAdminClick = () => {
        setCurrentPage('admin');
    };

    const handleRoutesClick = () => {
        setCurrentPage('routes');
    };

    const handleBackToHome = () => {
        setCurrentPage('home');
        setIsAdminLoggedIn(false);
    };

    const handleLoginSuccess = () => {
        setIsAdminLoggedIn(true);
    };

    const handleLogout = () => {
        setIsAdminLoggedIn(false);
        setCurrentPage('home');
    };

    // Admin Dashboard View (if logged in)
    if (currentPage === 'admin' && isAdminLoggedIn) {
        return (
            <div className="App">
                <Header onAdminClick={handleAdminClick} onHomeClick={handleBackToHome} onRoutesClick={handleRoutesClick} currentPage={currentPage} />
                <AdminDashboard onLogout={handleLogout} />
            </div>
        );
    }

    // Admin Login View
    if (currentPage === 'admin') {
        return (
            <div className="App">
                <Header onAdminClick={handleAdminClick} onHomeClick={handleBackToHome} onRoutesClick={handleRoutesClick} currentPage={currentPage} />
                <AdminLogin onBackToHome={handleBackToHome} onLoginSuccess={handleLoginSuccess} />
                <Footer />
            </div>
        );
    }

    // Routes View
    if (currentPage === 'routes') {
        return (
            <div className="App">
                <Header onAdminClick={handleAdminClick} onHomeClick={handleBackToHome} onRoutesClick={handleRoutesClick} currentPage={currentPage} />
                <Route />
                <Footer />
            </div>
        );
    }

    // Home View
    return (
        <div className="App">
            <Header onAdminClick={handleAdminClick} onHomeClick={handleBackToHome} onRoutesClick={handleRoutesClick} currentPage={currentPage} />
            <main>
                <Hero />
                <Offers />
                <Promo />
            </main>
            <Footer />
        </div>
    );
}