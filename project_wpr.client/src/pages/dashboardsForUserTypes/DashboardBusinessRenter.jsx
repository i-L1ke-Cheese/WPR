import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Dashboard component voor business renters
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function DashboardBusinessRenter() {
    const navigate = useNavigate();

    const [reservations, setReservations] = useState(null);
    const [hasReservations, setHasReservations] = useState(false);

    const fetchVehicleReservations = async () => {
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/reserveringen-van-gebruiker`, {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setReservations(data.reverse());
                setHasReservations(true);
            } else {
                if (response.status === 404) {
                    setHasReservations(false);
                } else {
                    console.error("Failed to fetch vehicle reservations");
                }
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

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
            document.getElementById("DashboardFName").innerHTML = user.fName;
        }
    }

    async function deleteReservation(reservationId) {
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/verwijder-huuraanvraag/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error: ', errorText);
                alert("Er is iets mis gegaan");
            } else {
                const result = await response.text();
                console.log('Success: ', result);
                alert("Huuraanvraag succesvol verwijderd");
                setReservations((prev) => prev.filter((d) => d.id !== reservationId));
            }
        } catch (error) {
            console.error('Error: ', error);
            alert('Er is een fout opgetreden bij het verwijderen van de huuraanvraag');
        }
    }

    useEffect(() => {
        fetchVehicleReservations();
        getUserInfo();
    }, []);

    const handleDeleteReservation = (id) => {
        deleteReservation(id);
    }

    return (
        <div className="dashboard">
            <h2>Welkom op je dashboard, <span id="DashboardFName"></span></h2>
            <div className="dashboard-panel-container">

                {/*<h3>Uw Reserveringen:</h3>     &apos; = '  */}
                {!hasReservations && (<div className="dashboard-panel dashboard-panel-fullwidth">
                    <p>U heeft nog geen auto&apos;s gehuurd</p>
                </div>)}
                {hasReservations && (
                    <div className="dashboard-panel dashboard-panel-fullwidth scroll">
                        {reservations.map((reservation, index) => (
                            <div key={index} className="dashboard-panel dashboard-panel-halfwidth darkgraybg">
                                <img src="Standaardauto.jpg" alt="Vehicle" className="reservation-image" />
                                <div className="reservation-details">
                                    <p><b>Status: {reservation.status}</b></p>
                                    <h3>{reservation.vehicleBrand} {reservation.vehicleType} ({reservation.vehicleColor})</h3>
                                    <p>{reservation.startDate} tot {reservation.endDate}</p>
                                    <p>Gebruiken voor: {reservation.intention}</p>
                                    <p>Geschatte afstand: {reservation.suspectedKm}</p>
                                    {reservation.isDeleted == 0 && (
                                        <Link to={`/vehicle?id=${reservation.vehicleId}`}>Pagina van voertuig</Link>
                                    )}
                                    {reservation.isDeleted == 1 && (
                                        <p><b>Voertuig is niet meer beschikbaar</b></p>
                                    )}
                                    {reservation.startDate > new Date().toISOString() &&
                                        <div>
                                            <button onClick={() => navigate(`/edit-rental-request?id=${reservation.id}`)}>Wijzig reservering</button>
                                        </div>
                                    }
                                    {reservation.startDate > new Date().toISOString() &&
                                        <div>
                                            <button onClick={() => handleDeleteReservation(reservation.id)}>Annuleer reservering</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardBusinessRenter;