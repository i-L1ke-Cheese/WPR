import React, { useState, useEffect } from 'react';
import './EditVehicles.css';

const EditVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
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
    const [isEditing, setIsEditing] = useState(false);

    // Fetch vehicles from the API
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://localhost:7289/api/Vehicle/alle-voertuigen?i=1")
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setVehicles(data);
                } else {
                    console.error("Failed to fetch vehicles");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchVehicles();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle add/update
    const handleSubmit = (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/vehicle/${formData.id}` : '/api/vehicle';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setVehicles((prev) =>
                    isEditing
                        ? prev.map((v) => (v.id === data.id ? data : v))
                        : [...prev, data]
                );
                setIsEditing(false);
                setFormData({ id: null, licensePlate: '', brand: '', color: '', status: true });
            });
    };

    // Handle delete
    const handleDelete = (id) => {
        fetch(`/api/vehicle/${id}`, { method: 'DELETE' })
            .then(() => setVehicles((prev) => prev.filter((v) => v.id !== id)));
    };

    // Handle edit
    const handleEdit = (vehicle) => {
        setFormData(vehicle);
        setIsEditing(true);
    };

    return (
        <div className="vehicle-page">
            <h2>Voertuigbeheer</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    placeholder="Kenteken"
                    required
                />
                <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Merk/Model"
                    required
                />
                <input
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Kleur"
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleChange({ target: { name: 'status', value: e.target.value === 'true' } })}
                >
                    <option value="true">Actief</option>
                    <option value="false">Inactief</option>
                </select>
                <button type="submit">{isEditing ? 'Opslaan' : 'Toevoegen'}</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Kenteken</th>
                        <th>Merk</th>
                        <th>Model</th>
                        <th>Kleur</th>
                        <th>Aankoopdatum</th>
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
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
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
                            <td>{vehicle.isAvailable ? 1 : 0}</td>
                            <td>{vehicle.isDamaged ? 1 : 0}</td>
                            <td>
                                <button onClick={() => handleEdit(vehicle)}>Bewerken</button>
                                <button onClick={() => handleDelete(vehicle.id)}>Verwijderen</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EditVehicles;








//import React, { useState, useEffect } from 'react';
//import './EditUserData.css';
//import { useNavigate } from 'react-router-dom';

//const EditUserata = () => {
//    const navigate = useNavigate();

//    const [vehicleData, setVehicleData] = useState({
//        brand: '',
//        type: '',
//        color: '',
//        yearOfPurchase: '',
//        licensePlate: '',
//        description: '',
//        rentalPrice: '',
//        isAvailable: '',
//        isDamaged: '',
//        vehicleType: '',
//        camperTransmission: '',
//        requiredLicense: '',
//        carTransmission: ''
//    });

//    const [errors, setErrors] = useState({});

//    const getVehicleInfo = async () => {