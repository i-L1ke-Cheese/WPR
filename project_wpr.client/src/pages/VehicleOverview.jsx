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
    const [filterVehicleType, setFilterVehicleType] = useState('');

    const [brands, setBrands] = useState([]);
    const [filterBrand, setFilterBrand] = useState('');

    const [types, setTypes] = useState([]);
    const [filterType, setFilterType] = useState('');

    const [colors, setColors] = useState([]);
    const [filterColor, setFilterColor] = useState('');

    const navigate = useNavigate();
    var selectedVehicle = null;

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("https://localhost:7289/api/Vehicle/alle-voertuigen")
                if (response.ok) {
                    const data = await response.json();
                    setVehicles(data);

                    const uniqueBrands = [...new Set(data.map(vehicle => vehicle.brand))].sort();
                    setBrands(uniqueBrands);

                    const uniqueTypes = [...new Set(data.map(vehicle => vehicle.type))].sort();
                    setTypes(uniqueTypes);

                    const uniqueColors = [...new Set(data.map(vehicle => vehicle.color))].sort();
                    setColors(uniqueColors);
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

    const handleFilterVehicleTypeChange = (event) => {
        setFilterVehicleType(event.target.value);
    }

    const handleFilterBrandChange = (event) => {
        setFilterBrand(event.target.value);
    }

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
    }

    const handleFilterColorChange = (event) => {
        setFilterColor(event.target.value);
    }

    const filteredVehicles = vehicles.filter(vehicle => {
        return (filterVehicleType ? vehicle.vehicleType.toLowerCase() === filterType.toLowerCase() : true) &&
            (filterBrand ? vehicle.brand.toLowerCase() === filterBrand.toLowerCase() : true) &&
            (filterType ? vehicle.type.toLowerCase() === filterType.toLowerCase() : true) &&
        (filterColor ? vehicle.color.toLowerCase() === filterColor.toLowerCase() : true);
    });


    return (
        <div className="vehicle-overview">
            <h2>Vehicle Overview</h2>
            <div className="filter-container">
                <label htmlFor="vehicleType">Filter op type voertuig: </label>
                <select id="vehicleType" value={filterVehicleType} onChange={handleFilterVehicleTypeChange}>
                    <option value="">Alle voertuigen</option>
                    <option value="car">Auto</option>
                    <option value="camper">Camper</option>
                    <option value="caravan">Caravan</option>
                </select> <br/>
                <label htmlFor="brand">Filter op merk: </label>
                <select id="brand" value={filterBrand} onChange={handleFilterBrandChange}>
                    <option value="">Alle merken</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select> <br />
                <label htmlFor="type">Filteren op model: </label>
                <select id="type" value={filterBrand} onChange={handleFilterTypeChange}>
                    <option value="">Alle modellen</option>
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    )) }
                </select> <br />
                <label htmlFor="color">Filteren op kleur: </label>
                <select id="color" value={filterColor} onChange={handleFilterColorChange}>
                    <option value="">Alle kleuren</option>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    )) }
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
