import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Logout component logt de gebruiker uit door een verzoek naar de API te sturen en toont een uitlogbericht.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het uitlogbericht toont.
 */
function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch("https://localhost:7289/api/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
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