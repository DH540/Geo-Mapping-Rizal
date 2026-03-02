import React, { useState } from "react";
import "./adminLogin.css";

const AdminLogin = ({ onBackToHome, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple validation - in production you'd verify against a backend
        if (email && password) {
            console.log("Login successful:", { email });
            onLoginSuccess();
        }
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
        // Add forgot password logic here
    };

    return (
        <div className="admin_login_container">
            <div className="admin_login_content">
                {/* Right side - Login Form */}
                <div className="admin_login_form_section">
                    <div className="admin_login_form_wrapper">
                        <h1 className="admin_login_title">Admin Portal</h1>
                        
                        <form onSubmit={handleLogin} className="admin_login_form">
                            {/* Email Input */}
                            <div className="admin_form_group">
                                <label htmlFor="email" className="admin_form_label">
                                    <i className="fas fa-envelope"></i>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="admin_form_input"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="admin_form_group">
                                <label htmlFor="password" className="admin_form_label">
                                    <i className="fas fa-lock"></i>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="admin_form_input"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Forgot Password Link */}
                            <div className="admin_forgot_password">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button type="submit" className="admin_login_btn">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <button className="admin_back_btn" onClick={onBackToHome}>
                ← Back to Home
            </button>
        </div>
    );
};

export default AdminLogin;
