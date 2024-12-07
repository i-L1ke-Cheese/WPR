import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Registreer() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };
    return (
        <form className="form" onSubmit={handleSubmit}>
            <p className="form-title">Log hier in</p>
            <div className="input-container">
                <label htmlFor="email" className="visually-hidden">emailadres:</label>
                <input type="email" placeholder="Enter email" />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="naam" className="visually-hidden">Naam:</label>
                <input type="text" id="naam" name="naam" placeholder="Voer uw naam in" pattern="[A-Za-z\s]+" required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="achternaam" className="visually-hidden">Achternaam:</label>
                <input type="text" id="achternaam" name="achternaam" placeholder="Voer uw achternaam in" pattern="[A-Za-z\s]+" required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="password" className="visually-hidden">Wachtwoord:</label>
                <input type="password" placeholder="Voer uw wachtwoord in" />
            </div>
            <button type="submit" className="submit">Login</button>   
        </form>
    )
}

export default Registreer;