import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
//import './AddVehicle.css';

/**
 * Component for adding a new vehicle to the database.
 * @returns
 */
const AddVehicle = () => {
    const [formData, setFormData] = useState({
        licensePlate: '',
        brand: '',
        type: '',
        color: '',
        yearOfPurchase: '',
        description: '',
        rentalPrice: '',
        vehicleType: '',
        transmissionType: '',
        camperTransmissionType: '',
        requiredLicenseType: '',
        isAvailable: true,
        isDamaged: false
    });

    const [userType, setUserType] = useState('');

    const navigate = useNavigate();

    /**
     * Haal de gebruikersinformatie op en bepaal welk dashboard moet worden weergegeven.
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
            const user = await loggedInCheckResponse.json();

            // Check if the user is a CompanyAdmin and if they have a companyId
            if (!(user.role === "EmployeeBackOffice")) {
                navigate("/dashboard");
            } else { setUserType(user.role); }


        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    /**
     * Handle form input changes.
     * @param {any} e
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'isAvailable' || name === 'isDamaged') {
            newValue = value === 'true';
        }
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handle form submission.
     * @param {any} e
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = 'https://localhost:7289/api/vehicle/voeg-voertuig-toe';

        const dataToSubmit = { ...formData };

        dataToSubmit.yearOfPurchase = parseInt(dataToSubmit.yearOfPurchase, 10);
        dataToSubmit.rentalPrice = parseFloat(dataToSubmit.rentalPrice);

        if (formData.vehicleType === 'car') {
            delete dataToSubmit.camperTransmissionType;
            delete dataToSubmit.requiredLicenseType;
        }
        if (formData.vehicleType === 'camper') {
            delete dataToSubmit.transmissionType;
        }
        if (formData.vehicleType === 'caravan') {
            delete dataToSubmit.camperTransmissionType;
            delete dataToSubmit.requiredLicenseType;
            delete dataToSubmit.transmissionType;
        }

        console.log("Submitting vehicle data:", dataToSubmit);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                console.log("Iets gaat niet goed, Voertuig: ", dataToSubmit);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            alert('Voertuig succesvol toegevoegd');
            setFormData({
                licensePlate: '',
                brand: '',
                type: '',
                color: '',
                yearOfPurchase: '',
                description: '',
                rentalPrice: '',
                vehicleType: '',
                transmissionType: '',
                camperTransmissionType: '',
                requiredLicenseType: '',
                isAvailable: 'true',
                isDamaged: 'false'
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Er is een fout opgetreden bij het toevoegen van het voertuig');
        }
    };

    return (
        <div className="vehicle-page">
            <h2>Voertuig toevoegen</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="licensePlate">Kenteken:</label>
                    <input
                        id="licensePlate"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        placeholder="Kenteken"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Merk:</label>
                    <input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Merk"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Model:</label>
                    <input
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Model"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="color">Kleur:</label>
                    <input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="Kleur"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="yearOfPurchase">Aankoopjaar:</label>
                    <input
                        id="yearOfPurchase"
                        name="yearOfPurchase"
                        value={formData.yearOfPurchase}
                        onChange={handleChange}
                        placeholder="Aankoopjaar"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Beschrijving:</label>
                    <input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Beschrijving"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rentalPrice">Huurprijs:</label>
                    <input
                        id="rentalPrice"
                        name="rentalPrice"
                        value={formData.rentalPrice}
                        onChange={handleChange}
                        placeholder="Huurprijs"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="vehicleType">Soort voertuig:</label>
                    <select
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecteer voertuigtype</option>
                        <option value="car">Auto</option>
                        <option value="camper">Camper</option>
                        <option value="caravan">Caravan</option>
                    </select>
                </div>
                {formData.vehicleType === 'car' && (
                    <div className="form-group">
                        <label htmlFor="transmissionType">Versnellingsbak:</label>
                        <input
                            id="transmissionType"
                            name="transmissionType"
                            value={formData.transmissionType}
                            onChange={handleChange}
                            placeholder="Versnellingsbak"
                            required
                        />
                    </div>
                )}
                {formData.vehicleType === 'camper' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="camperTransmissionType">Versnellingsbak:</label>
                            <input
                                id="camperTransmissionType"
                                name="camperTransmissionType"
                                value={formData.camperTransmissionType}
                                onChange={handleChange}
                                placeholder="Versnellingsbak"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="requiredLicenseType">Benodigd rijbewijs:</label>
                            <input
                                id="requiredLicenseType"
                                name="requiredLicenseType"
                                value={formData.requiredLicenseType}
                                onChange={handleChange}
                                placeholder="Benodigd rijbewijs"
                                required
                            />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <label htmlFor="isAvailable">Beschikbaarheid:</label>
                    <select
                        id="isAvailable"
                        name="isAvailable"
                        value={formData.isAvailable}
                        onChange={handleChange}
                    >
                        <option value="true">Beschikbaar</option>
                        <option value="false">Niet beschikbaar</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="isDamaged">Schade:</label>
                    <select
                        id="isDamaged"
                        name="isDamaged"
                        value={formData.isDamaged}
                        onChange={handleChange}
                    >
                        <option value="false">Niet beschadigd</option>
                        <option value="true">Beschadigd</option>
                    </select>
                </div>
                <button type="submit">Voertuig toevoegen</button>
            </form>
        </div>
    );
};

export default AddVehicle;