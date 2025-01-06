import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

/**
 * Dashboard component toont een welkomstbericht en enkele placeholders voor toekomstige inhoud.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function Dashboard() {
    const navigate = useNavigate();

    const [reservations, setreservations] = useState(null);
    const [hasReservations, sethasReservations] = useState(false);

    const fetchVehicleReservations = async () => {
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/reserveringen-van-gebruiker`, {
                method: "GET",
                credentials: "include"
            });
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

    const getUserInfo = async () => {
        const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (loggedInCheckResponse.ok) {
            const stuff = await loggedInCheckResponse.json();
            document.getElementById("DashboardFName").innerHTML = stuff.fName;
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();
        fetchVehicleReservations();
    }, [])

    const handleEditUserDataClick = () => {
        navigate('/edituserdata');
    }

    return (
        <div className="dashboard">
            <h2>Welkom op je dashboard, <span id="DashboardFName">gebruiker</span></h2>
            <div className="dashboard-panel-container">
                
                    {/*<h3>Uw Reserveringen:</h3>     &apos; = '  */}
                    {!hasReservations && <p>U heeft nog geen auto&apos;s gehuurd</p>}
                    {hasReservations && (
                        <div className="dashboard-panel dashboard-panel-fullwidth">
                            {reservations.map((reservation, index) => (
                                <div key={index} className="dashboard-panel dashboard-panel-halfwidth darkgraybg">
                                    <img src="Standaardauto.jpg" alt="Vehicle" className="reservation-image" />
                                    <div className="reservation-details">
                                        <h3>{reservation.vehicleBrand} {reservation.vehicleModel} ({reservation.vehicleColor})</h3>
                                        <p>{reservation.startDate} tot {reservation.endDate}</p>
                                        <p>Gebruiken voor: {reservation.intention}</p>
                                        <p>Geschatte afstand: {reservation.suspectedKm}</p>
                                        <Link to={`/vehicle?id=${reservation.vehicleId}`}>Pagina van voertuig</Link>
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

export default Dashboard;