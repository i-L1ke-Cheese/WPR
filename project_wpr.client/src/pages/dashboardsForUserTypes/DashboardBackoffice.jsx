import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Layout.css'
import '../EditVehicles.css';

/**
 * Dashboard component voor companhy admins
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function DashboardBackoffice() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        department: "", // For the switchable option
    });

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    /**
     * Handles input change events and updates the form data state.
     * 
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles form submission, performs validation, and sends a registration request.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSuccess(false);
        if (formData.email === "") {
            setMessage("Please enter email.");
            return;
        }

        if (formData.password === "") {
            setMessage("Please enter password.");
            return;
        }

        if (formData.firstName === "") {
            setMessage("Please enter first name.");
            return;
        }

        if (formData.lastName === "") {
            setMessage("Please enter last name.");
            return;
        }

        if (formData.dateOfBirth === "") {
            setMessage("Please enter date of birth.");
            return;
        }

        if (formData.department === "") {
            setMessage("Please select a department.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7289/api/Register/register-employee-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage("Registration successful!");
            } else {
                setIsSuccess(false);
                if (result.errors) {
                    const errorMessages = Object.values(result.errors)
                        .flat()
                        .join(" ");
                    setMessage(errorMessages);
                } else {
                    setMessage(result.message || "Registration failed.");
                }
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage("An error occurred. Please try again later.");
        }
    };

    /**
    * Handles the click event for the edit vehicles button.
    */
    const handleEditVehiclesClick = () => {
        navigate('/editvehicles');
    };

    return (
        <div>
            <div className='Test'>
                <h3 style={{ color: 'black', textAlign: "center" }}>Maak een nieuwe werknemer aan</h3>
                <br />
                <form className="noMargin" onSubmit={handleSubmit}>
                    <div className='inline-form'>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Wachtwoord:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="firstName">Voornaam:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName">Achternaam:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='inline-form'>
                        <div>
                            <label htmlFor="dateOfBirth">Geboortedatum:</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="department">Functie:</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Selecteer Functie--</option>
                                <option value="Frontoffice">Front Office</option>
                                <option value="Backoffice">Back Office</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit">Registreer</button>

                    <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
                </form>
            </div>
            <div className="Test">
                <h3 style={{ color: 'black', textAlign: "center" }}>Voertuigen</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <button onClick={handleEditVehiclesClick}>Voertuigen aanpassen</button>
                </div>
            </div>
        </div>
    );
}

export default DashboardBackoffice;