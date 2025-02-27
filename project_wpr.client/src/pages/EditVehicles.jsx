import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './EditVehicles.css';
import './Layout.css'

/**
 * Component for editing vehicles.
 * @returns {JSX.Element} The EditVehicles component.
 */
const EditVehicles = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        brand: '',
        type: '',
        color: '',
        yearOfPurchase: '',
        licensePlate: '',
        description: '',
        rentalPrice: '',
        isAvailable: '',
        isDamaged: '',
        vehicleType: '',
        camperTransmissionType: '',
        requiredLicenseType: '',
        transmissionType: ''
    });

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

    // Fetch vehicles from the API
    /**
     * Fetches vehicles from the API and sets the state.
     */
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://localhost:7289/api/Vehicle/alle-voertuigen?i=1");
                if (response.ok) {
                    const data = await response.json();
                    const combinedArray = [
                        ...(data.cars || []),
                        ...(data.campers || []),
                        ...(data.caravans || [])
                    ];
                    console.log(combinedArray);
                    setVehicles(combinedArray);
                } else {
                    console.error("Failed to fetch vehicles");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };
        getUserInfo();
        fetchVehicles();
    }, []);

    // Handle form changes
    /**
     * Handles changes in the form inputs.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle update
    /**
     * Handles the form submission for updating a vehicle.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const method = 'PUT';
        const url = `https://localhost:7289/api/vehicle/update-voertuig/${formData.id}`; // Zorg ervoor dat formData.id een geldig voertuig-ID bevat

        console.log(`Submitting update request to URL: ${url}`);
        console.log('FormData:', formData);

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setVehicles((prev) =>
                    prev.map((v) => (v.id === data.id ? data : v))
                );

                setFormData({
                    id: '',
                    brand: '',
                    type: '',
                    color: '',
                    yearOfPurchase: '',
                    licensePlate: '',
                    description: '',
                    rentalPrice: '',
                    isAvailable: '',
                    isDamaged: '',
                    vehicleType: '',
                    camperTransmissionType: '',
                    requiredLicenseType: '',
                    transmissionType: ''
                });
            })
            .catch((error) => {
                console.error('Error:', error, formData);
            });
    };

    // Handle delete
    /**
     * Handles the deletion of a vehicle.
     * @param {string} vehicleId - The ID of the vehicle to delete.
     */
    async function handleDelete(vehicleId) {
        try {
            const response = await fetch(`https://localhost:7289/api/vehicle/verwijder-voertuig/${vehicleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error:', errorText);
                alert(`Error: ${errorText}`);
            } else {
                const result = await response.text();
                console.log('Success:', result);
                alert('Voertuig succesvol verwijderd');
                setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Er is een fout opgetreden bij het verwijderen van het voertuig');
        }
    }

    // Handle edit
    /**
     * Handles the editing of a vehicle.
     * @param {Object} vehicle - The vehicle to edit.
     */
    const handleEdit = (vehicle) => {
        setFormData(vehicle);
    };

    // Handle Click
    /**
     * Handles the click event to navigate to the add vehicle page.
     */
    const handleClick = () => {
        navigate("/addvehicle");
    }

    // Handle search
    /**
     * Handles the search input change.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter voertuigen op zoekopdracht
    /**
     * Filters the vehicles based on the search query.
     */
    const filteredVehicles = vehicles.filter((vehicle) => {
        const query = searchQuery.toLowerCase();
        return (
            vehicle.brand.toLowerCase().includes(query) ||
            vehicle.type.toLowerCase().includes(query) ||
            vehicle.licensePlate.toLowerCase().includes(query) ||
            vehicle.description.toLowerCase().includes(query) ||
            (vehicle.brand.toLowerCase() + ' ' + vehicle.type.toLowerCase()).includes(query)
        );
    });

    return (
        <div className="vehicle-page">
            <h2>Voertuigbeheer</h2>
            <form className="border" onSubmit={handleSubmit}>
                <div className='inline-form'>
                <div className="form-group">
                    <label htmlFor="licensePlate">Kenteken:</label>
                    <input // Input voor kenteken
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        placeholder="Kenteken"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Merk:</label>
                    <input // Input voor Merk
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Merk"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Model:</label>
                    <input  // Input voor Model
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Model"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="color">Kleur:</label>
                    <input // Input voor Kleur
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="Kleur"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="yearOfPurchase">Aankoopjaar:</label>
                    <input // Input voor aankoopjaar
                        name="yearOfPurchase"
                        value={formData.yearOfPurchase}
                        onChange={handleChange}
                        placeholder="Aankoopjaar"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Beschrijving:</label>
                    <input // Input voor beschrijving
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="rentalPrice">Huurprijs:</label>
                    <input // Input voor huurprijs
                        name="rentalPrice"
                        value={formData.rentalPrice}
                        onChange={handleChange}
                        placeholder="Huurprijs"
                        required
                    />
                    </div>
                </div>
                <div className='inline-form'>
                {formData.vehicleType == "car" &&
                    <div className="form-group">
                        <label htmlFor="transmissionType">Versnellingsbak:</label>
                        <input // Input voor versnellingsbak bij auto
                            name="transmissionType"
                            value={formData.transmissionType}
                            onChange={handleChange}
                            placeholder="Versnellingsbak"
                            required
                        />
                        </div>}
                {formData.vehicleType == "camper" &&
                    <div className="form-group">
                        <label htmlFor="transmission">Versnellingsbak:</label>
                        <input // Input voor versnellingsbak bij camper
                            name="camperTransmissionType"
                            value={formData.transmissionType}
                            onChange={handleChange}
                            placeholder="Versnellingsbak"
                            required
                        />
                    </div>}
                {formData.vehicleType == "camper" &&
                    <div className="form-group">
                        <label htmlFor="requiredLicenseType">Rijbewijs</label>
                        <input  // Input voor rijbewijs bij camper
                            name="requiredLicenseType"
                            value={formData.requiredLicenseType}
                            onChange={handleChange}
                            placeholder="Rijbewijs"
                            required
                        />
                    </div>}
                <div className="form-group">
                    <label htmlFor="isAvailable">Beschikbaarheid:</label>
                    <select // Input voor beschikbaarheid voertuig
                        name="isAvailable"
                        value={formData.isAvailable}
                        onChange={(e) => handleChange({ target: { name: 'isAvailable', value: e.target.value === 'true' } })}
                    >
                        <option value="true">Beschikbaar</option>
                        <option value="false">Niet beschikbaar</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="isDamaged">Schade:</label>
                    <select // Input voor schade voertuig
                        name="isDamaged"
                        value={formData.isDamaged}
                        onChange={(e) => handleChange({ target: { name: 'isDamaged', value: e.target.value === 'true' } })}
                    >
                        <option value="true">Beschadigd</option>
                        <option value="false">Niet beschadigd</option>
                    </select>
                    </div>
                </div>
                <div className='inline-form'>
                <button type="submit">Opslaan</button>
                    <button onClick={handleClick}>Voertuig toevoegen</button>
                </div>
            </form >
            <div className="searchbarwrapper">
            <label htmlFor="search">Zoeken</label>
            <input // Input om te zoeken op kenteken, merk, model of merk en model 
                className="form"
                name="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Zoeken op kenteken, merk en/of model"
                />
            </div>

            <div
                className='Test'style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
            >
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kenteken</th>
                            <th>Merk</th>
                            <th>Model</th>
                            <th>Kleur</th>
                            <th>Aankoopjaar</th>
                            <th>Beschrijving</th>
                            <th>Huurprijs</th>
                            <th>Voertuigtype</th>
                            <th>Versnellingsbak</th>
                            <th>Rijbewijs</th>
                            <th>Beschikbaar</th>
                            <th>Beschadigd</th>
                            <th>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.id}</td>
                                <td>{vehicle.licensePlate}</td>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.type}</td>
                                <td>{vehicle.color}</td>
                                <td>{vehicle.yearOfPurchase}</td>
                                <td>{vehicle.description}</td>
                                <td>{vehicle.rentalPrice}</td>
                                <td>{vehicle.vehicleType}</td>
                                <td>{vehicle.transmissionType || vehicle.camperTransmissionType || "Geen"}</td>
                                <td>{vehicle.requiredLicenseType || "Geen"}</td>
                                <td>{vehicle.isAvailable ? "Ja" : "Nee"}</td>
                                <td>{vehicle.isDamaged ? "Ja" : "Nee"}</td>
                                <td>
                                    <button onClick={() => handleEdit(vehicle)}>Bewerken</button>
                                    <button onClick={() => handleDelete(vehicle.id)}>Verwijderen</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditVehicles;