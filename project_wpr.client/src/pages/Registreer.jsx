import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Registreer() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [age, setAge] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { email, password, firstName, lastName, age};

        try {
            const response = await fetch("https://localhost:7289/api/register/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("registering successful:", result);
            } else {
                console.error("registering failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <form className="form" onSubmit={handleSubmit}>
            <p className="form-title">Log hier in</p>
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
                    id="age"
                    name="age"
                    placeholder="Voer uw leeftijd in"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
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
            <button type="submit" className="submit">Registreer</button>   
        </form>
    )
}

export default Registreer;