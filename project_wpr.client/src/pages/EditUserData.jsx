import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditUserData.css';
import { use } from 'react';

const EditUserData = () => {
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        place: '',
        licensenumber: ''
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
                firstname: data.fName,
                lastname: data.lName,
                email: data.email,
                phone: data.phoneNr,
                address: data.address,
                place: data.place,
                licensenumber: data.licenseNumber
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
        //voornaam
        if (!userData.firstname) {
            errors.name = 'Voornaam is verplicht';
        }
        //achternaam
        if (!userData.firstname) {
            errors.name = 'Voornaam is verplicht';
        }
        //email
        if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Email is ongeldig';
        }
        //telefoonnummer
        if (userData.phone && !/^\d{9,13}$/.test(userData.phone)) {
            errors.phone = 'Telefoonnummer moet tussen 10 en 13 cijfers zijn';
        }
        //adres
        if (userData.address && !/^\w{1,50}\s\d{1,5}$/.test(userData.address)) {
            errors.address = 'Adres is ongeldig';
        } else if (!userData.place && userData.address) {
            errors.address = 'Plaatsnaam is verplicht als adres is ingevoerd';
        }
        //plaatsnaam
        if (!userData.address && userData.place) {
            errors.place = 'Adres is verplicht als plaatsnaam is ingevoerd';
        }
        //rijbewijsnummer
        if (userData.licensenumber && !/^\d{10}$/.test(userData.licensenumber)) {
            errors.licensenumber = 'Rijbewijsnummer moet 10 cijfers zijn';
        }
        console.log('errors: ', errors);

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
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                place: userData.place,
                licenseNumber: userData.licensenumber
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
                    <label>Voornaam: </label>
                    <input
                        type="text"
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Achternaam: </label>
                    <input
                        type="text"
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Telefoonnummer: </label>
                    <input
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Adres + huisnummer: </label>
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Plaats: </label>
                    <input
                        type="text"
                        name="place"
                        value={userData.place}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Rijbewijsnummer: </label>
                    <input
                        type="text"
                        name="licensenumber"
                        value={userData.licensenumber}
                        onChange={handleChange}
                    />
                </div>
                    {errors.firstname && <p className="error">{errors.firstname}</p>}
                    {errors.lastname && <p className="error">{errors.lastname}</p>}
                    {errors.email && <p className="error">{errors.email}</p>}
                    {errors.phone && <p className="error">{errors.phone}</p>}
                    {errors.address && <p className="error">{errors.address}</p>}
                    {errors.place && <p className="error">{errors.place}</p>}
                    {errors.licensenumber && <p className="error">{errors.licensenumber}</p>}

                <button type="submit">Gegevens opslaan</button>
            </form>
        </div>
    );
};

export default EditUserData;