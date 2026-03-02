import React, { useState } from "react";
import "./offers.css";

const Offers = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="offers">
            <div className="offers_container">
                <h2>Nature Awaits You!</h2>
                <h3>What brings you to Rizal?</h3>
                <div className="card_grid">
                    <div className="card" style={{ backgroundImage: "url('/camp_img.png')" }}>
                        <span>Camping</span>
                    </div>
                    <div className="card" style={{ backgroundImage: "url('/hiking_img.png')" }}>
                        <span>Hiking</span>
                    </div>
                    <div className="card" style={{ backgroundImage: "url('/climbing_img.png')" }}>
                        <span>Mountain Climbing</span>
                    </div>   
                </div>

                
                {showMore && (
                    <div className="card_grid card_grid_more">
                        <div className="card" style={{ backgroundImage: "url('/swimming_img.png')" }}>
                            <span>Swimming</span>
                        </div>
                        <div className="card" style={{ backgroundImage: "url('/biking_img.png')" }}>
                            <span>Biking</span>
                        </div>
                        <div className="card" style={{ backgroundImage: "url('/trekking_img.png')" }}>
                            <span>Trekking</span>
                        </div>
                    </div>
                )}

                <button className="more_btn" onClick={() => setShowMore(!showMore)}>
                    {showMore ? "Show Less ▲" : "More ▼"}
                </button>
            </div>
        </div>
    );
}

export default Offers;