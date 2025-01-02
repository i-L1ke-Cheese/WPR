import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditUserData.css';
import { use } from 'react';

const EditUserData = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    const getUserInfo = async () => {
        const response = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUserData({
                name: data.fName,
                email: data.email,
                phone: data.phone
            })
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const validate = () => {
        const errors = {};
        if (!userData.name) {
            errors.name = 'Naam is verplicht';
        }
        if (!userData.email) {
            errors.email = 'Email is verplicht';
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Email is ongeldig';
        }
        //if (!userData.phone) { // Missvhien weghalen als telefoonnummer toch niet verplicht is
        //    errors.phone = 'Telefoonnummer is verplicht';
        //} else
        if (!/^\d{10,13}$/.test(userData.phone)) {
            errors.phone = 'Telefoonnummer moet tussen 10 en 13 cijfers zijn';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const response = await fetch("https://localhost:7289/api/Account/updateUser", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('updated user data: ', result);
            alert('Gegevens succesvol bijgewerkt.');
        } else {
            console.error('Failed to update user data')
            setErrors({ api: 'Bijwerken van gegevens mislukt.' });
        }
        console.log('Updated user data:', userData);
    };

    return (
        <div className="edituserdata">
            <h2>Gegevens inzien/bewerken</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Naam:</label>
                    <input
                        type="text"
                        name="naam"
                        value={userData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                    {errors.email && <p className="error">{errors.email}</p>}
                <div>
                    <label>Telefoonnummer:</label>
                    <input
                        type="text"
                        name="telefoonnummer"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </div>
                    {errors.phone && <p className="error">{errors.phone}</p>}
                <button type="submit">Gegevens opslaan</button>
            </form>
        </div>
    );
};

export default EditUserData;