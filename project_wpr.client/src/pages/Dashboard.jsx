import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

/**
 * Dashboard component toont een welkomstbericht en enkele placeholders voor toekomstige inhoud.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function Dashboard() {
    return (
        <div className="dashboard">
            <h2>Welkom op je dashboard [voornaam]</h2>
            <div className="placeholder-container">
                <div className="placeholder">Placeholder 1 Settings pagina</div>
                <div className="placeholder">Placeholder 2</div>
                <div className="placeholder">Placeholder 3</div>
            </div>
        </div>
    );
}

export default Dashboard;