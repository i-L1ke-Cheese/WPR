import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import './VehicleDetails.css';

/**
 * VehicleDetails component haalt gedetailleerde informatie op over een specifiek voertuig en toont deze.
 * Het gebruikt het voertuig-ID uit de URL-parameters of querystring om de voertuigdetails van de API op te halen.
 * 
 * @returns {JSX.Element} Het gerenderde component dat voertuigdetails toont.
 */
function VehicleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);

    const [reservations, setreservations] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [hasReservations, sethasReservations] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [intention, setIntention] = useState('');
    const [suspectedKm, setSuspectedKm] = useState('');
    const [FarthestDestination, setFarthestDestination] = useState('');

    const [currentUserId, setCurrentUserId] = useState('');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const vehicleId = queryParams.get("id");

    const [email, setEmail] = useState("");

    const fetchVehicleReservations = async () => {
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/reserveringen-van-auto?vehicleId=${vehicleId}`);
            if (response.ok) {
                const data = await response.json();
                setreservations(data);
                console.log(reservations);
                sethasReservations(true);
            } else {
                if (response.status == 404) {
                    sethasReservations(false);
                } else {
                    console.error("Failed to fetch vehicle reservations");
                }
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentUserId == "None") {
            navigate("/login");
        }
        try {
            const response = await fetch('https://localhost:7289/api/RentalRequest/huur-auto', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "startDate": startDate,
                    "endDate": endDate,
                    "vehicleId": vehicleId,
                    "intention": intention, "suspectedKm": suspectedKm,
                    "FarthestDestination": FarthestDestination,
                    "Status": "in behandeling"
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Response:', data);
                document.getElementById("rentalRequestConfirmationMessage").innerHTML = "<strong><span style='color: green;'>Success!</span></strong>";
                fetchVehicleReservations();
                // mail via endpoint versturen
                const emailResponse = await fetch('https://localhost:7289/api/Email/send-email', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        from: "carandall@2a3e198781496c5c.maileroo.org",
                        to: `${email}`,
                        subject: `Huuraanvraag ingediend: ${vehicle.brand} ${vehicle.type}`,
                        templateId: "862",
                        templateData: JSON.stringify({ Name: "Template"
                        })
                    }),
                });

                if (emailResponse.ok) {
                    console.log("Email sent successfully");
                } else {
                    console.error("Failed to send email");
                }
            } else {
                document.getElementById("rentalRequestConfirmationMessage").innerHTML = "<strong><span style='color: red;'>Failed: " + data.message + "</span></strong>";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const getUserInfo = async () => {
        try {
            const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (loggedInCheckResponse.ok) {
                const stuff = await loggedInCheckResponse.json();
                setCurrentUserId(stuff.UserId);
                setEmail(stuff.mail);
            } else {
                setCurrentUserId("None");
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    /**
     * useEffect hook om de voertuigdetails op te halen uit de API.
     */
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
        }
        fetchVehicle();
        getUserInfo();

    }, [id]);

    useEffect(() => {
        fetchVehicleReservations();
    }, [vehicle])

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
                <p><strong>Huurprijs per dag:</strong> &euro;{vehicle.rentalPrice}</p>
                <p><strong>Voertuigtype:</strong> { vehicle.vehicleType}</p>
                {vehicle.transmissionType && <p><strong>Versnellingsbak:</strong> {vehicle.transmissionType}</p>}
                {vehicle.requiredLicenseType && <p><strong>Rijbewijs:</strong> {vehicle.requiredLicenseType}</p>}
            </div>
            <div className='vehicle-pictures'>
                {/*{vehicle.pictures.map(picture => (*/}
                {/*    <img key={picture.id} src={picture.filePath} alt="Voertuigfoto's" />*/}
                {/*))}*/}
                <img src='Standaardauto.jpg'/>
            </div>
            <div className="vehicle-info" >

                {!hasReservations && (<p><strong>Dit voertuig is nog niet gereserveerd!</strong></p>)}
                {hasReservations && (<p><strong>Al gereserveerd op de volgende dagen:</strong></p>)}
                {hasReservations && (
                    reservations.map((reservation, index) => (
                    <p key={index}>{reservation.startDate} - {reservation.endDate}</p>
                    )))}
                
            </div>
            {!showForm && <button onClick={() => setShowForm(!showForm)} style={{ display: 'inline' }} className="submit">Huur deze auto</button>}
            {showForm && currentUserId != "None" && (
                <form onSubmit={handleSubmit} style={{ marginTop: '10px', border: "1px solid black" }}>
                    <div>
                        <label htmlFor="startDate">Startdatum: </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate">Einddatum: </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="intention">Intentie: </label>
                        <textarea
                            id="intention"
                            value={intention}
                            onChange={(e) => setIntention(e.target.value)}
                            placeholder="Omschrijf wat je met de auto gaat doen"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="FarthestDestination">Verste bestemming: </label>
                        <textarea
                            id="FarthestDestination"
                            value={FarthestDestination}
                            onChange={(e) => setFarthestDestination(e.target.value)}
                            placeholder="Verste bestemming"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="suspectedKm">Verwachte afstand (Km):</label>
                        <input
                            type="number"
                            id="suspectedKm"
                            value={suspectedKm}
                            onChange={(e) => setSuspectedKm(e.target.value)}
                            placeholder="Bijv. 150"
                            required
                        />
                    </div>
                    <button type="submit">Verzenden</button>
                    <button onClick={() => setShowForm(false)}>Annuleren</button>
                    <p id="rentalRequestConfirmationMessage"></p>
                </form>
            )}
            {showForm && currentUserId == "None" && (<div>
                <h3>Please <Link to="/login">log in</Link> first!</h3>
                <button onClick={() => setShowForm(false)}>Annuleren</button>
            </div>)}
        </div>
    );
}

export default VehicleDetails;
