import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
    return (
        <div className="footer">    
            <div className="footer_tourism">
                <span className="footer_tourism_text">Related Website</span>
                <div className="footer_tourism_links">
                    <a href="https://www.tourism.gov.ph">Department of Tourism</a>
                    <a href="https://thephilippines.online">Travel Philippines</a>
                </div>
            </div>

            <div className="footer_business">
                <span className="footer_business_text">Business Registration</span>
                <div className="footer_business_links">
                    <a href="https://emerhub.com/glossaries/dot-accreditation/">Requirements</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdJF3QQGGCplZSybrgaZRtxRxOeu3JKyr_IagEsDaDTEKgGWA/viewform?usp=send_form">Submission</a>
                    <Link to="/contact">Contact Us</Link>
                </div>
            </div>

            <div className="footer_contact">
                <span className="footer_contact_text">Our Socials</span>
                <div className="footer_contact_links">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                </div>
            </div>

            <div className="footer_bottom">
               Copyright  © 2026 Department of Tourism Philippines, All Rights Reserved 
            </div>
        </div>
    );
}

export default Footer;