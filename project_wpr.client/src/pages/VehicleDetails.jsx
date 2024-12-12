import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './VehicleDetails.css';

function VehicleDetails() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);


    const location = useLocation();
    // Extract the query parameter
    const queryParams = new URLSearchParams(location.search);
    const vehicleId = queryParams.get("id");

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/vehicle/${vehicleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setVehicle(data);
                } else {
                    console.error("Failed to fetch vehicle details");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchVehicle();

        
    }, [id]);

    if (!vehicle) {
        return <div style={{ color: 'black', textAlign: 'center' }}>Loading...</div>;
    }

    if (vehicle.pictures === null) {
            vehicle.pictures = [];
    }

    return (
        <div className="vehicle-details">
            <h2>{vehicle.brand} {vehicle.type}</h2>
            <div className="vehicle-info" >
                <p><strong>Kleur:</strong> {vehicle.color}</p>
                <p><strong>Aankoopjaar:</strong> {vehicle.yearOfPurchase}</p>
                <p><strong>Kenteken:</strong> {vehicle.licensePlate}</p>
                <p><strong>Beschrijving:</strong> {vehicle.description}</p>
                {vehicle.transmissionType && <p><strong>Versnellingsbak:</strong> {vehicle.transmissionType}</p>}
                {vehicle.requiredLicenseType && <p><strong>Rijbewijs:</strong> {vehicle.requiredLicenseType}</p>}
            </div>
            <div className='vehicle-pictures'>
                {/*{vehicle.pictures.map(picture => (*/}
                {/*    <img key={picture.id} src={picture.filePath} alt="Voertuigfoto's" />*/}
                {/*))}*/}
                <img src='Standaardauto.jpg'/>
            </div>
        </div>
    );
}

export default VehicleDetails;
