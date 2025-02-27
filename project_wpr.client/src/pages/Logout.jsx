import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as topBTNmanager from './updateTopBtns.js'

/**
 * Logout component logt de gebruiker uit door een verzoek naar de API te sturen en toont een uitlogbericht.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het uitlogbericht toont.
 */
function Logout() {
    const navigate = useNavigate();

    /**
     * Voert de uitlogactie uit door een verzoek naar de API te sturen.
     */
    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch("https://localhost:7289/api/Logout/logout", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    topBTNmanager.showLoginBTN();
                    console.log("Logout Successful");
                } else {
                    console.error("Logout Failed");
                }
            } catch (error) {
                console.error("Error: ", error)
            }
        }

        logout();
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Je bent nu uitgelogd</h2>
            <Link to="/login" className="login-link">Log opnieuw in</Link>
        </div>
    );
}

export default Logout;