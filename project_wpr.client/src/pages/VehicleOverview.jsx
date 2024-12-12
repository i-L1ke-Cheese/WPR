import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleOverview.css';

/**
 * VehicleOverview component haalt alle voertuigen op uit de database en toont deze.
 * Gebruikers kunnen op een voertuig klikken om naar de detailpagina van dat voertuig te navigeren.
 * 
 * @returns {JSX.Element} Het gerenderde component dat een overzicht van voertuigen toont.
 */
function VehicleOverview() {
    //Zorgen dat alle voertuigen worden opgehaald uit de database
    const [vehicles, setVehicles] = useState([]);
    const [filterType, setFilterType] = useState('');
    const navigate = useNavigate();
    var selectedVehicle = null;

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://localhost:7289/api/Vehicle/alle-voertuigen")
                if (response.ok) {
                    const data = await response.json();
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

    const handleVehicleClick = (vehicle) => {
        navigate(`/vehicle?id=${vehicle.id}`);
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    }

    //Filter de voertuigen op basis van het geselecteerde type
    const filteredVehicles = filterType
        ? vehicles.filter(vehicle => vehicle.vehicleType && vehicle.vehicleType.toLowerCase() === filterType.toLowerCase())
        : vehicles;

    return (
        <div className="vehicle-overview">
            <h2>Vehicle Overview</h2>
            <div className="filter-container">
                <label htmlFor="vehicleType">Filter op type: </label>
                <select id="vehicleType" value={filterType} onChange={handleFilterChange}>
                    <option value="">Alle voertuigen</option>
                    <option value="car">Auto</option>
                    <option value="camper">Camper</option>
                    <option value="caravan">Caravan</option>
                </select>
            </div>
            <div className="container">
                {filteredVehicles.map(vehicle => (
                    <div key={vehicle.id}>
                        <img
                            src={'Standaardauto.jpg'} //Hier moet de eerste foto komen uit de database
                            alt={vehicle.brand + " " + vehicle.type}
                            className={selectedVehicle === vehicle.id ? 'selected' : ''}
                            onClick={() => handleVehicleClick(vehicle)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VehicleOverview;
