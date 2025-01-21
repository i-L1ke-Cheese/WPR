import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const getUserInfo = async () => {
        const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (loggedInCheckResponse.ok) {
            setIsLoggedIn(true);
        } 
    }

    useEffect(() => {
        // Controleer of de gebruiker is ingelogd
        getUserInfo();
    }, []);

    return (
        <div className="home-container">
            <h2>Welkom bij CarAndAll</h2>
            <p className="tekst">
                Bij CarAndAll draait alles om mobiliteit. Wij zijn de partner voor iedereen die op zoek is naar flexibele, betrouwbare en betaalbare oplossingen voor voertuigverhuur.
            </p>
            <p className="tekst">
                Of u nu een auto nodig heeft om een project uit te voeren, een camper om te touren door Nederland, of een caravan voor een vakantie op de camping, wij staan voor u klaar.
            </p>
            {!isLoggedIn && (
                <button className="login-button" onClick={() => navigate('/login')}>
                    Inloggen
                </button>
            )}
            {isLoggedIn && (
                <button className="login-button" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </button>
            )}
        </div>
    );
}

export default Home;