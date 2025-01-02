import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

/**
 * Dashboard component toont een welkomstbericht en enkele placeholders voor toekomstige inhoud.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function Dashboard() {
    const navigate = useNavigate();

    const getUserInfo = async () => {
        const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (loggedInCheckResponse.ok) {
            const stuff = await loggedInCheckResponse.json();
            document.getElementById("DashboardFName").innerHTML = stuff.fName;
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();
    })

    const handleEditUserDataClick = () => {
        navigate('/edituserdata');
    }

    return (
        <div className="dashboard">
            <h2>Welkom op je dashboard, <span id="DashboardFName">gebruiker</span></h2>
            <div className="placeholder-container">
                <div className="placeholder" onClick={handleEditUserDataClick}>Gegevens inzien/veranderen</div>
                <div className="placeholder">Placeholder 2</div>
                <div className="placeholder">Placeholder 3</div>
            </div>
        </div>
    );
}

export default Dashboard;