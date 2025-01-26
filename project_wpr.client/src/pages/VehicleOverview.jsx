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
    const [filterVehicleType, setFilterVehicleType] = useState(localStorage.getItem('filterVehicleType') || '');

    const [rentalRequests, setRentalRequests] = useState([]);

    const [brands, setBrands] = useState([]);
    const [filterBrand, setFilterBrand] = useState(localStorage.getItem('filterBrand') || '');

    const [types, setTypes] = useState([]);
    const [filterType, setFilterType] = useState(localStorage.getItem('filterType') || '');

    const [colors, setColors] = useState([]);
    const [filterColor, setFilterColor] = useState(localStorage.getItem('filterColor') || '');

    const [startDate, setStartDate] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem('filterStartDate') || '');

    const [endDate, setEndDate] = useState([]);
    const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem('filterEndDate') || '');

    const [userRole, setUserRole] = useState('');

    const navigate = useNavigate();
    var selectedVehicle = null;

    /**
     * useEffect hook om de gebruikersrol op te halen uit de API.
     */
    useEffect(() => {
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
                console.log(user);
                setUserRole(user.role);
            } else {
                navigate("/login");
            }
        }

        getUserInfo();
    }, [navigate]);

    /**
     * useEffect hook om de voertuigen en reserveringen op te halen uit de API.
     */
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/AvailableVehicle/beschikbare-voertuigen`);

                if (response.ok) {
                    var data = await response.json();
                    // Filter voertuigen als de gebruiker een BusinessRenter is
                    if (userRole === "BusinessRenter") {
                        data = data.filter(vehicle => vehicle.vehicleType === "car");
                    }
                    setVehicles(data);
                } else {
                    console.error("Failed to fetch vehicles");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        const fetchReservations = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/RentalRequest/reserveringen-van-alle-autos`);

                if (response.ok) {
                    const data = await response.json();
                    setRentalRequests(data);
                } else {
                    console.error("Failed to fetch rental requests");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }

        if (userRole == '' || userRole == "BusinessRenter") {
            fetchVehicles();
            fetchReservations();
        }
    }, [userRole]);



    /**
     * useEffect hook om de unieke merken, types en kleuren van de gefilterde voertuigen op te halen zodat deze in de filter dropdowns getoond kunnen worden.
     */
    useEffect(() => {
        const filteredVehicles = vehicles.filter(vehicle => {
            return (filterVehicleType ? vehicle.vehicleType.toLowerCase() === filterVehicleType.toLowerCase() : true) &&
                (filterBrand ? vehicle.brand.toLowerCase() === filterBrand.toLowerCase() : true) &&
                (filterType ? vehicle.type.toLowerCase() === filterType.toLowerCase() : true) &&
                (filterColor ? vehicle.color.toLowerCase() === filterColor.toLowerCase() : true);
        });

        const uniqueBrands = [...new Set(filteredVehicles.map(vehicle => vehicle.brand))].sort();
        setBrands(uniqueBrands);

        const uniqueTypes = [...new Set(filteredVehicles.map(vehicle => vehicle.type))].sort();
        setTypes(uniqueTypes);

        const uniqueColors = [...new Set(filteredVehicles.map(vehicle => vehicle.color))].sort();
        setColors(uniqueColors);
    }, [vehicles, filterVehicleType, filterBrand, filterType, filterColor]);

    /**
     * Functie die wordt aangeroepen wanneer een voertuig wordt aangeklikt.
     * @param {any} vehicle
     */
    const handleVehicleClick = (vehicle) => {
        navigate(`/vehicle?id=${vehicle.id}`);
    };

    /**
     * Functie die wordt aangeroepen wanneer de filter voor het voertuigtype wordt aangepast.
     * @param {any} event
     */
    const handleFilterVehicleTypeChange = (event) => {
        const value = event.target.value;
        setFilterVehicleType(value);
        localStorage.setItem('filterVehicleType', value);
    }

    /**
     * Functie die wordt aangeroepen wanneer de filter voor het merk wordt aangepast.
     * @param {any} event
     */
    const handleFilterBrandChange = (event) => {
        const value = event.target.value;
        setFilterBrand(value);
        localStorage.setItem('filterBrand', value);
    }

    /**
     * Functie die wordt aangeroepen wanneer de filter voor het type wordt aangepast.
     * @param {any} event
     */
    const handleFilterTypeChange = (event) => {
        const value = event.target.value;
        setFilterType(value);
        localStorage.setItem('filterType', value);
    }

    /**
    * Functie die wordt aangeroepen wanneer de filter voor de kleur wordt aangepast.
    * @param {any} event
    */
    const handleFilterColorChange = (event) => {
        const value = event.target.value;
        setFilterColor(value);
        localStorage.setItem('filterColor', value);
    }

    /**
    * Functie die wordt aangeroepen wanneer de filter voor de startDate wordt aangepast.
    * @param {any} event
    */
    const handleFilterStartDateChange = (event) => {
        const value = event.target.value;
        setFilterStartDate(value);
        localStorage.setItem('filterStartDate', value);
    }

    /**
    * Functie die wordt aangeroepen wanneer de filter voor de endDate wordt aangepast.
    * @param {any} event
    */
    const handleFilterEndDateChange = (event) => {
        const value = event.target.value;
        setFilterEndDate(value);
        localStorage.setItem('filterEndDate', value);
    }

    /**
     * Functie die wordt aangeroepen wanneer de reset filters knop wordt aangeklikt.
     */
    const handleResetFilters = () => {
        setFilterVehicleType('');
        setFilterBrand('');
        setFilterType('');
        setFilterColor('');
        setFilterStartDate('');
        setFilterEndDate('');
        localStorage.removeItem('filterVehicleType');
        localStorage.removeItem('filterBrand');
        localStorage.removeItem('filterType');
        localStorage.removeItem('filterColor');
        localStorage.removeItem('filterStartDate');
        localStorage.removeItem('filterEndDate');
    }
    /**
     * Filter de voertuigen op basis van de geselecteerde filters.
     */
    const filteredVehicles = vehicles.filter(vehicle => {
        const vehicleRentalRequests = rentalRequests.filter(request => request.vehicleId === vehicle.id);
        const isAvailable = vehicleRentalRequests.every(request => {
            const requestStartDate = new Date(request.startDate);
            const requestEndDate = new Date(request.endDate);
            const filterStart = filterStartDate ? new Date(filterStartDate) : null;
            const filterEnd = filterEndDate ? new Date(filterEndDate) : null;

            if (filterStart && filterEnd) {
                return (requestEndDate < filterStart || requestStartDate > filterEnd);
            } else if (filterStart) {
                return requestEndDate < filterStart;
            } else if (filterEnd) {
                return requestStartDate > filterEnd;
            }
            return true;
        });

        return isAvailable &&
            (filterVehicleType ? vehicle.vehicleType.toLowerCase() === filterVehicleType.toLowerCase() : true) &&
            (filterBrand ? vehicle.brand.toLowerCase() === filterBrand.toLowerCase() : true) &&
            (filterType ? vehicle.type.toLowerCase() === filterType.toLowerCase() : true) &&
            (filterColor ? vehicle.color.toLowerCase() === filterColor.toLowerCase() : true);
    });     

    return (
        <div className="vehicle-overview">
            <h2 style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Vehicle Overview</h2>


            <div className="border" style={{ paddingTop: '20px', maxWidth: 'auto'}}>
                <label htmlFor="vehicleType">Filter op type voertuig: </label>
                <select id="vehicleType" value={filterVehicleType} onChange={handleFilterVehicleTypeChange} >
                    <option value="">Alle voertuigen</option>
                    <option value="car">Auto</option>
                    <option value="camper">Camper</option>
                    <option value="caravan">Caravan</option>
                </select> <br style={{ paddingTop: '20px' }} />

                <label htmlFor="brand">Filter op merk: </label>
                <select id="brand" value={filterBrand} onChange={handleFilterBrandChange}>
                    <option value="">Alle merken</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select> <br />
                <label htmlFor="type">Filteren op model: </label>
                <select id="type" value={filterType} onChange={handleFilterTypeChange}>
                    <option value="">Alle modellen</option>
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select> <br />
                <label htmlFor="color">Filteren op kleur: </label>
                <select id="color" value={filterColor} onChange={handleFilterColorChange}>
                    <option value="">Alle kleuren</option>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select> <br />
                <label htmlFor="startDate">Startdatum: </label>
                <input
                    type="date"
                    id="startDate"
                    value={filterStartDate}
                    onChange={handleFilterStartDateChange}
                /> <br />
                <label htmlFor="endDate">Einddatum: </label>
                <input
                    type="date"
                    id="endDate"
                    value={filterEndDate}
                    onChange={handleFilterEndDateChange}
                /> <br />
                <button onClick={handleResetFilters}>Reset filters</button>
            </div>
            <div className="container" style={{ paddingTop: '20px' ,textShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)' }}>
                {filteredVehicles.map(vehicle => (
                    <div style={{ border: '1px solid black', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }} key={vehicle.id} >
                        <img
                            src={'Standaardauto.jpg'} //Hier moet de eerste foto komen uit de database
                            alt={vehicle.brand + " " + vehicle.type}
                            className={selectedVehicle === vehicle.id ? 'selected' : ''}
                            onClick={() => handleVehicleClick(vehicle)}
                        />
                        <p style={{ color: 'black' }}>{vehicle.vehicleType + ": " + vehicle.brand + " " + vehicle.type}</p>
                        <p style={{ color: 'black' }}>{vehicle.licensePlate + " (" + vehicle.color + ")"}</p>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default VehicleOverview;
