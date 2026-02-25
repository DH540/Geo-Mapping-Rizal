import React, { useState } from "react";
import "./hero.css";

const Hero = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };

    return (
        <div className="hero">
            <div className="hero_content">
                <img src="/hero_img.png" alt="hero" className="hero_img" />
                 
                <form onSubmit={handleSearch} className="search_form">
                    <input 
                        type="text" 
                        placeholder="Where to?" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search_input"
                    />
                    <button type="submit" className="search_btn">Search</button>
                </form>
            </div>
        </div>
    );
}

export default Hero;