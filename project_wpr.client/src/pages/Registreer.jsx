import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * Registreer component toont een formulier voor het registreren van een nieuwe gebruiker.
 * @returns
 */
function Registreer() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [dateOfBirth, setdateOfBirth] = useState("");
    const [renter, setRenter] = useState("")

    /**
     * handleSubmit functie stuurt een POST-verzoek naar de API om een nieuwe gebruiker te registreren.
     * @param {any} event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { email, password, firstName, lastName, dateOfBirth };

        try {
            const response = await fetch(`https://localhost:7289/api/Register/register?renter=${renter}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("registering successful:", result);
                document.getElementById("RegisterConfirmationMessageTag").innerHTML = "Registratie compleet u kunt inloggen.";

            } else {
                console.error("registering failed");
                document.getElementById("message").innerHTML = "Probeer opnieuw";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    /**
     * handleUserTypeSelection functie verandert de geselecteerde gebruikerstypeknop en zet de renterstate.
     * @param {any} userType
     * @param {any} e
     */
    const handleUserTypeSelection = async (userType, e) => {
        setRenter(userType);
        const clickedButton = e.currentTarget;
        const buttons = document.querySelectorAll('.userTypeSelectionBtn');
        buttons.forEach((button) => {
            if (button === clickedButton) {
                button.classList.add('darkblue');
            } else {
                button.classList.remove('darkblue');
            }
        });
    };

    /**
     * useEffect haalt de renterstate op en zet deze op "Private" bij het laden van de pagina.
     */
    useEffect(() => {
        setRenter("Private");
    }, []);

    return (
        <form className="form" onSubmit={handleSubmit}>
            <p className="form-title">Registeer hier</p>
            <div className="button-container">
                <button className="userTypeSelectionBtn darkblue" type="button" onClick={(e) => handleUserTypeSelection("Private", e)}>PrivateRenter</button>
                {/*<button className="userTypeSelectionBtn" type="button" onClick={(e) => handleUserTypeSelection("Business", e)}>BusinessRenter</button>*/}
                <button className="userTypeSelectionBtn" type="button" onClick={(e) => handleUserTypeSelection("Admin", e)}>CompanyAdmin</button>
            {/*    <button className="userTypeSelectionBtn" type="button" onClick={(e) => handleUserTypeSelection("VehicleManager", e)}>VehicleManager</button>*/}
            {/*    <button className="userTypeSelectionBtn" type="button" onClick={(e) => handleUserTypeSelection("FrontOffice", e)}>FrontOffice</button>*/}
            {/*    <button className="userTypeSelectionBtn" type="button" onClick={(e) => handleUserTypeSelection("BackOffice", e)}>BackOffice</button>*/}
            </div>
            <div className="input-container">
                <label htmlFor="email" className="visually-hidden">emailadres:</label>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="naam" className="visually-hidden">Naam:</label>
                <input
                    type="text"
                    id="naam"
                    name="naam"
                    placeholder="Voer uw naam in"
                    pattern="[A-Za-z\s]+"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="achternaam" className="visually-hidden">Achternaam:</label>
                <input
                    type="text"
                    id="achternaam"
                    name="achternaam"
                    placeholder="Voer uw achternaam in"
                    pattern="[A-Za-z\s]+"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                    required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="age" className="visually-hidden">Leeftijd:</label>
                <input
                    type="text"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    placeholder="Voer uw geboortedatum in"
                    value={dateOfBirth}
                    onChange={(e) => setdateOfBirth(e.target.value)}
                    required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="password" className="visually-hidden">Wachtwoord:</label>
                <input
                    type="password"
                    placeholder="Voer uw wachtwoord in"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <p id="RegisterConfirmationMessageTag" className="green"></p>
            <button type="submit" className="submit">Registreer</button>
            <p className="registreer-link">
                Al een account? <Link to="/login">Log hier in</Link>
            </p>
            <p className="registreer-link">
                <Link to="/wachtwoord_vergeten">Wachtwoord vergeten</Link>
            </p>
        </form>
    )
}

export default Registreer;