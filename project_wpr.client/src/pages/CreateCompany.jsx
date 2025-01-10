import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function CreateCompany() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [KVK_number, setKVK] = useState(""); 
    const [userID, setUserID] = useState("");

    const getUserInfo = async () => {
        const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (loggedInCheckResponse.ok) {
            const stuff = await loggedInCheckResponse.json();
            if (stuff.role && stuff.role.includes("CompanyAdmin")) {
                console.log(stuff);
                setUserID(stuff.id);
            } else {
                navigate("/dashboard");
            }
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();// get user info, but also check if user is logged in, and if not, go to login page
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { Name: name, Adress: adress, KVK_number: KVK_number };

        try {
            const response = await fetch(`https://localhost:7289/api/CompanyCreator/company?id=${userID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Company created:", result);
                document.getElementById("RegisterConfirmationMessageTag").innerHTML = "Uw bedrijf is aangemaakt";
                navigate("/dashboard");
            } else {
                console.error("registering failed");
                document.getElementById("RegisterConfirmationMessageTag").innerHTML = "failed";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <p className="form-title">Voeg uw bedrijf hier toe</p>
            <div className="input-container">
                <label htmlFor="name" className="visually-hidden">Naam:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Voer uw bedrijfsnaam in"
                    pattern="[A-Za-z\s]+"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="adress" className="visually-hidden">Adres:</label>
                <input
                    type="text"
                    id="adress"
                    name="adress"
                    placeholder="Voer uw adres in"
                    pattern="[A-Za-z\s]+"
                    value={adress}
                    onChange={(e) => setAdress(e.target.value)}
                    required />
                <span></span>
            </div>
            <div className="input-container">
                <label htmlFor="KVK" className="visually-hidden">KVK nummer:</label>
                <input
                    type="text"
                    id="KVK"
                    name="KVK"
                    placeholder="Voer uw KVK nummer in"
                    value={KVK_number}
                    onChange={(e) => setKVK(e.target.value)}
                    required />
                <span></span>
            </div>
            <p id="RegisterConfirmationMessageTag" className="green"></p>
            <button type="submit" className="submit">Maak aan</button>
        </form>
    );
}

export default CreateCompany;
