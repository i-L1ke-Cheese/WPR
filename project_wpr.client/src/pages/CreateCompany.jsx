import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * CreateCompany component
 * @returns
 */
function CreateCompany() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [KVK_number, setKVK] = useState("");
    const [userID, setUserID] = useState("");
    const [bedrijfsNaam, setBedrijfsNaam] = useState("");
    const [email, setMail] = useState("");

    /**
     * Get user info
     */
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
                setMail(stuff.email);
            } else {
                navigate("/dashboard");
            }
        } else {
            navigate("/login");
        }
    }

    /**
     * useEffect to get the user info
     */
    useEffect(() => {
        getUserInfo();
    }, []);

    /**
     * Handle submit to create a company and send an email
     * @param {any} event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { Name: name, Adress: adress, KVK_number: KVK_number, CompanyPhone: "0611223344" };

        try {
            const response = await fetch(`https://localhost:7289/api/CompanyCreator/CreateCompany?id=${userID}`, {
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

                // mail via endpoint versturen
                const emailResponse = await fetch('https://localhost:7289/api/Email/send-email', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({  
                        from: "carandall@2a3e198781496c5c.maileroo.org",
                        to: `${email}`,
                        subject: `Bedrijf aangemaakt: ${name}`,
                        templateId: "862",
                        templateData: JSON.stringify({
                            naam: result.name,
                            adres: result.adress,
                            kvk: result.KVK_number
                        })
                    }),
                });

                if (emailResponse.ok) {
                    console.log("Email sent successfully");
                } else {
                    console.error("Failed to send email");
                }

                navigate("/dashboard");
            } else {
                console.error("Registering failed");
                document.getElementById("RegisterConfirmationMessageTag").innerHTML = "Failed";
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

