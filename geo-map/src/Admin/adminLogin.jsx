import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminLogin.css";
import { loginAdmin } from "./services/authApi";

const AdminLogin = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            const user = await loginAdmin(email, password);
            onLoginSuccess(user);
        } catch (loginError) {
            setError(loginError.message || "Login failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
    };

    return (
        <div className="admin_login_container">
            <div className="admin_login_content">
                <div className="admin_login_form_section">
                    <div className="admin_login_form_wrapper">
                        <h1 className="admin_login_title">Admin Portal</h1>

                        <form onSubmit={handleLogin} className="admin_login_form">
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
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="admin_form_group">
                                <label htmlFor="password" className="admin_form_label">
                                    <i className="fas fa-lock"></i>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="admin_form_input"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="admin_forgot_password">
                                <a href="#" onClick={(event) => { event.preventDefault(); handleForgotPassword(); }}>
                                    Forgot password?
                                </a>
                            </div>

                            {error && <p className="admin_login_error">{error}</p>}

                            <button type="submit" className="admin_login_btn" disabled={isSubmitting}>
                                {isSubmitting ? "Signing in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <button className="admin_back_btn" onClick={() => navigate("/")}>
                Back to Home
            </button>
        </div>
    );
};

export default AdminLogin;
