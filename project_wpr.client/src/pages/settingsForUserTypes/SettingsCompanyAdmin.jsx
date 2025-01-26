import React, { useState, useEffect } from 'react';
import './settings.css';
import { useNavigate } from 'react-router-dom';

/**
 * Componenet for editing user data.
 * @returns {JSX.Element} THe EditUserData component.
 */
const SettingsCompanyAdmin = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        companyId: 0,
    });

    const [companyData, setCompanyData] = useState({
        name: '',
        adress: '',
        companyPhone: '',
        kVK_number: '',
    });

    const [errors, setErrors] = useState({});

    /**
     * Fetches the current user information from the server.
     */
    const getUserInfo = async () => {
        const response = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUserData({
                firstname: data.fName || '',
                lastname: data.lName || '',
                email: data.email || '',
                phone: data.phoneNr || '',
                companyId: data.companyId || 0
            })

        } else {
            navigate("/login");
        }
    }

    /**
     * Fetches the current company information from the server.
     */
    const getCompanyInfo = async () => {
        const response = await fetch(`https://localhost:7289/api/Company/getCurrentCompany?companyId=${userData.companyId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            setCompanyData({
                name: data.name || '',
                adress: data.adress || '',
                companyPhone: data.companyPhone || '',
                kVK_number: data.kVK_number || '',
            })
        } else {
            console.error("Er is iets misgegaan")
        }
    }

    /**
     * Fetches the user information when the component mounts.
     */
    useEffect(() => {
        getUserInfo();
    }, []);

    /**
     * Fetches the company information when the userData state is updated.
     */
    useEffect(() => {
        if (userData.companyId !== 0) {
            getCompanyInfo();
        }
    }, [userData.companyId]);

    /**
     * Handles input changes and updtes the userData state.
     * @param {any} e - The event object.
     */
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    /**
     * Handles input changes and updtes the companyData state.
     * @param {any} e
     */
    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({
            ...companyData,
            [name]: value
        });
    };


    /**
     * Validates the user data.
     * @returns {Object} An object containing validation errors, if any.
     */
    const validate = () => {
        const errors = {};
        //voornaam
        if (!userData.firstname) {
            errors.firstname = 'Voornaam is verplicht';
        }
        //achternaam
        if (!userData.lastname) {
            errors.lastname = 'Achternaam is verplicht';
        }
        //email
        if (!userData.email) {
            errors.email = 'Email is verplicht';
        } else if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Email is ongeldig';
        }
        //telefoonnummer gebruiker
        if (userData.phone && !/^\d{10,15}$/.test(userData.phone)) {
            errors.phone = 'Admintelefoonnummer moet tussen 10 en 15 cijfers zijn';
        }
        //bedrijfsnaam
        if (!companyData.name) {
            errors.name = 'Bedrijfsnaam is verplicht';
        }
        //bedrijfsadres
        if (!companyData.adress) {
            errors.adress = 'Adres is verplicht';
        }
        //telefoonnummer bedrijf
        if (companyData.companyPhone && !/^\d{10,15}$/.test(companyData.companyPhone)) {
            errors.companyPhone= 'Bedrijfstelefoonnummer moet tussen 10 en 15 cijfers zijn';
        }
        console.log('errors: ', errors);

        return errors;
    };

    /**
     * Handles form submission and updates the user data on the server.
     * @param {Object} e - The event object.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Als er geen telefoonnummer, adres, plaats of rijb. nummer is zorgen dat hij wordt veranderd in een lege string ("")
        if (!userData.phone) {
            userData.phone = "";
        }
        if (!companyData.companyPhone) {
            companyData.companyPhone = "";
        }
        const userResponse = await fetch("https://localhost:7289/api/Account/updateUser", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Firstname: userData.firstname,
                Lastname: userData.lastname,
                Email: userData.email,
                Phone: userData.phone,
                Address: "",
                Place: "",
                LicenseNumber: "",
            })
        });
        const companyResponse = await fetch(`https://localhost:7289/api/Company/update-company/${userData.companyId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Name: companyData.name,
                Adress: companyData.adress,
                CompanyPhone: companyData.companyPhone,
                KVK_number: companyData.kVK_number,
            })
        });

        if (userResponse.ok && companyResponse.ok) {
            setErrors({});
            alert('Gegevens succesvol bijgewerkt.');
        } else {
            console.error('Failed to update user data')
            setErrors({ api: 'Bijwerken van gegevens mislukt.' });
        }
    };

    return (
        <div className="Test">
            <h2 style={{ textAlign: 'center' }}>Gegevens inzien/bewerken</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstname">Voornaam: </label>
                    <input
                        id="firstname"
                        type="text"
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleUserChange}
                    />
                </div>
                <div>
                    <label htmlFor="lastname">Achternaam: </label>
                    <input
                        id="lastname"
                        type="text"
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleUserChange}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleUserChange}
                    />
                </div>
                <div>
                    <label htmlFor="phone">Admintelefoonnummer: </label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleUserChange}
                    />
                </div>
                <div>
                    <label htmlFor="name">Bedrijfsnaam: </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={companyData.name}
                        onChange={handleCompanyChange}
                    />
                </div>
                <div>
                    <label htmlFor="adress">Adres: </label>
                    <input
                        id="adress"
                        type="text"
                        name="adress"
                        value={companyData.adress}
                        onChange={handleCompanyChange}
                    />
                </div>
                <div>
                    <label htmlFor="companyPhone">Bedrijfstelefoonnummer: </label>
                    <input
                        id="companyPhone"
                        type="text"
                        name="companyPhone"
                        value={companyData.companyPhone}
                        onChange={handleCompanyChange}
                    />
                </div>
                {errors.firstname && <p className="error">{errors.firstname}</p>}
                {errors.lastname && <p className="error">{errors.lastname}</p>}
                {errors.email && <p className="error">{errors.email}</p>}
                {errors.phone && <p className="error">{errors.phone}</p>}
                {errors.name && <p className="error">{errors.name}</p>}
                {errors.adress && <p className="error">{errors.adress}</p>}
                {errors.companyPhone && <p className="error">{errors.companyPhone}</p>}

                <button type="submit">Gegevens opslaan</button>
            </form>
        </div>
    );

};

export default SettingsCompanyAdmin;