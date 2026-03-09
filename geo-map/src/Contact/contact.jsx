import React, { useState } from "react";
import "./contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", formData);
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="contact_page">
            <div className="contact_background">
                <img src="/hero_img.png" alt="contact background" />
            </div>

            <div className="contact_content">
                {/* LEFT - INFO */}
                <div className="contact_leftside">
                    <h2 className="contact_heading">Get In Touch</h2>
                    <p className="contact_subtext">
                        Have questions about geological and natural destinations in Rizal?
                        We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
                    </p>

                    <div className="contact_info_list">
                        <div className="contact_info_item">
                            <span className="contact_info_icon">📍</span>
                            <div>
                                <span className="contact_info_label">Address</span>
                                <span className="contact_info_value">Province of Rizal, Philippines</span>
                            </div>
                        </div>

                        <div className="contact_info_item">
                            <span className="contact_info_icon">📧</span>
                            <div>
                                <span className="contact_info_label">Email</span>
                                <span className="contact_info_value">info@geomaprizal.ph</span>
                            </div>
                        </div>

                        <div className="contact_info_item">
                            <span className="contact_info_icon">📞</span>
                            <div>
                                <span className="contact_info_label">Phone</span>
                                <span className="contact_info_value">+63 (2) 8123 4567</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT - FORM */}
                <div className="contact_rightside">
                    <h2>Send Us a Message</h2>

                    {submitted && (
                        <div className="contact_success">
                            ✅ Thank you! Your message has been sent.
                        </div>
                    )}

                    <form className="contact_form" onSubmit={handleSubmit}>
                        <div className="contact_field">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="contact_field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="contact_field">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="contact_field">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Write your message..."
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="contact_submit_btn">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
