import React, { useState, useEffect } from 'react';
import './DashboardFrontoffice.css';
import { Link, useNavigate } from 'react-router-dom';
import '././LayoutDashboard.css'

function DashboardVehicleManager() {
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

    const pastReservations = reservations.filter(request => new Date(request.endDate) < currentDate);

    const groupedReservations = pastReservations.reduce((acc, reservation) => {
        const employeeName = `${reservation.firstName} ${reservation.lastName}`;
        if (!acc[employeeName]) {
            acc[employeeName] = [];
        }
        acc[employeeName].push(reservation);
        return acc;
    }, {});

    const sortedEmployeeNames = Object.keys(groupedReservations).sort();

    return (
        <div>
            <h2 className='title' style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.35)' }} >Huuraanvragen van {companyName}</h2>
            <div className='Test'>
            <table >
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
            </div>

            <h2 className='title' style={{ paddingTop: '20px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.35)' }}>Huuraanvragen historie van {companyName}</h2>
            {sortedEmployeeNames.map(employeeName => (
                <div className='Test' key={employeeName}>
                    <h3 style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>{employeeName}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Voertuig</th>
                                <th>Van</th>
                                <th>Tot</th>
                                <th>Huurder</th>
                                <th>Status</th>
                                <th>Gebruiken voor</th>
                                <th>Geschatte afstand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedReservations[employeeName].map((reservation, index) => (
                                <tr key={index}>
                                    <td>{reservation.vehicleBrand} {reservation.vehicleType} ({reservation.vehicleColor})</td>
                                    <td>{reservation.startDate}</td>
                                    <td>{reservation.endDate}</td>
                                    <td>{reservation.firstName} {reservation.lastName}</td>
                                    <td>{reservation.status}</td>
                                    <td>{reservation.intention}</td>
                                    <td>{reservation.suspectedKm}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default DashboardVehicleManager;
