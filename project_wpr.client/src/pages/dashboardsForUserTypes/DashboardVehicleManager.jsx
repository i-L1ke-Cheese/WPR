import React, { useState, useEffect } from 'react';
import './DashboardFrontoffice.css';
import { Link, useNavigate } from 'react-router-dom';

function DashboardFrontOffice() {
    const [rentalRequests, setRentalRequests] = useState([]);
    const [companyName, setCompanyName] = useState();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);

    const currentDate = new Date();

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
            console.log(user)
            setCompanyName(user.companyName);

        } else {
            navigate("/login");
        }
    }

    const fetchRentalRequests = async () => {
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/reserveringen-van-company`, {
                method: "GET",
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();

                const userDetails = await Promise.all(
                    data.map(async (request) => {
                        return {
                            ...request,
                            renterFirstName: request.firstName,
                            renterLastName: request.lastName,
                        };
                    })
                );
                setRentalRequests(userDetails);
                setReservations(data.reverse());
            } else {
                console.error("Failed to fetch vehicles");
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    // Fetch all rental requests
    useEffect(() => {
        getUserInfo();
        fetchRentalRequests();
    }, []);

    return (
        <div className='div'>
            <h2>Huuraanvragen van {companyName}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Voertuig</th>
                        <th>Van</th>
                        <th>Tot</th>
                        <th>Huurder</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rentalRequests
                        .map((request, index) => (
                            <tr key={`${request.id}-${index}`}>
                                <td>{request.vehicleBrand} {request.vehicleType} ({request.vehicleId})</td>
                                <td>{request.startDate}</td>
                                <td>{request.endDate}</td>
                                <td>{request.renterFirstName} {request.renterLastName}</td>
                                <td>{request.status}</td>{/* STATUS NOG TOEVOEGEN*/}
                            </tr>
                        ))}
                </tbody>
            </table>

            <h2>Huuraanvragen historie van {companyName}</h2>
            <div className="dashboard-panel dashboard-panel-fullwidth scroll">
                {reservations.filter(request => new Date(request.endDate) < currentDate)
                    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map((reservation, index) => (
                        <div key={index} className="dashboard-panel dashboard-panel-halfwidth darkgraybg">
                            <img src="Standaardauto.jpg" alt="Vehicle" className="reservation-image" />
                            <div className="reservation-details">
                                <p>Gehuurd door: {reservation.firstName + " " + reservation.lastName}</p>
                                <p><b>Status: {reservation.status}</b></p>
                                <h3>{reservation.vehicleBrand} {reservation.vehicleType} ({reservation.vehicleColor})</h3>
                                <p>{reservation.startDate} tot {reservation.endDate}</p>
                                <p>Gebruiken voor: {reservation.intention}</p>
                                <p>Geschatte afstand: {reservation.suspectedKm}</p>
                            </div>
                        </div>
                    ))}
            </div>

        </div>
    );
}

export default DashboardFrontOffice;
