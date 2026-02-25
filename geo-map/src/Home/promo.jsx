import React, { useState, useEffect } from "react";
import "./promo.css";

const images = [
    "/carousel1_img.png",
    "/carousel2_img.png",
    "/carousel3_img.png",
];

const Promo = () => {
    const [current, setCurrent] = useState(0);

    // Auto slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrent(current === 0 ? images.length - 1 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === images.length - 1 ? 0 : current + 1);
    };

    return (
        <div className="promo" style={{ backgroundImage: `url(${images[current]})` }}>
            
            {/* DARK OVERLAY */}
            <div className="promo_overlay" />

            {/* CONTENT */}
            <div className="promo_container">
                <h2>Discover Rizal's Hidden Gems!</h2>
                <p>Explore the best outdoor activities and nature spots in Rizal. Whether you're into hiking, camping, or just want to relax by the lake, we've got you covered!</p>
                <button className="promo_btn">Explore Now</button>
            </div>

            {/* ARROWS */}
            <button className="promo_arrow left" onClick={prevSlide}>&#8249;</button>
            <button className="promo_arrow right" onClick={nextSlide}>&#8250;</button>

            {/* DOTS */}
            <div className="promo_dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`promo_dot ${index === current ? "active" : ""}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Promo;