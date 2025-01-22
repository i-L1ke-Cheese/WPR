import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Dashboard component voor private renters
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function DashboardPrivateRenter() {
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
                setReservations(data);
                console.log(reservations);
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

    useEffect(() => {
        fetchVehicleReservations();
        getUserInfo();
    }, []);

    const handleEditUserDataClick = () => {
        navigate('/edituserdata');
    }

    return (
        <div className="dashboard">
            <h2>Welkom op je dashboard, <span id="DashboardFName">gebruiker</span></h2>
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="dashboard-panel dashboard-panel-fullwidth pointer" onClick={handleEditUserDataClick}>Gegevens inzien/veranderen</div>
                <div className="dashboard-panel dashboard-panel-halfwidth darkgraybg">
                    <p>placeholder</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPrivateRenter;