import React, { useState, useEffect } from 'react';
import './Frontoffice.css';
//import axios from 'axios';

function FrontOffice() {
    const [carId, setCarId] = useState('');
    const [action, setAction] = useState('issue');
    const [damageDescription, setDamageDescription] = useState('');
    const [rentalRequests, setRentalRequests] = useState([]);
    const [damageReports, setDamageReports] = useState([]);

    // Fetch all rental requests
    useEffect(() => {
        const fetchRentalRequests = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/RentalRequest/reserveringen-van-alle-autos`);
                if (response.ok) {
                    const data = await response.json();
                    const userDetails = await Promise.all(
                        data.map(async (request) => {
                            let userId = null;
                            if (request.PrivateRenterId) {
                                userId = request.PrivateRenterId;
                            } else if (request.BusinessRenterId) {
                                userId = request.BusinessRenterId;
                            }
                            if (userId) {
                                const userResponse = await fetch(`https://localhost:7289/api/Account/getUser?userID=${userId}`, {
                                    credentials: 'include',
                                });
                                if (userResponse.ok) {
                                    const userData = await userResponse.json();
                                    return {
                                        ...request,
                                        renterFirstName: userData.FName,
                                        renterLastName: userData.LName,
                                    };
                                }
                            }
                            return request;
                        })
                    );
                    setRentalRequests(userDetails);
                } else {
                    console.error("Failed to fetch vehicles");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }

        fetchRentalRequests();
        handleViewDamageReports();
    }, []);

    // Create damage report
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(carId, damageDescription);
            const response = await fetch(`https://localhost:7289/api/DamageReport/maak-schademelding`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vehicleId: carId,
                    date: new Date().toISOString().split('T')[0],
                    description: damageDescription,
                    employeeId: 'currentEmployeeId' // Replace with actual employee ID
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Response: ', data);
                handleViewDamageReports();
                return (alert('Schademelding succesvol toegevoegd'));
            } else {
                console.log('Response: ', data);
                return (alert('Er is iets mis gegeaan'));
            }
        } catch (error) {
            console.log(error);
        }

        
    };

    const handleViewDamageReports = async (vehicleId) => {
        // Fetch damage reports for a specific vehicle
        try {
            const response = await fetch(`https://localhost:7289/api/DamageReport/alle-voertuigen`);
            if (response.ok) {
                const data = await response.json();
                setDamageReports(data);
            } else {
                console.error("Failed to fetch damage reports", response);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return (
        <div className='div'>
            <h2>Front Office</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="carId">Car ID:</label>
                    <input
                        type="text"
                        id="carId"
                        value={carId}
                        onChange={(e) => setCarId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="action">Action:</label>
                    <select
                        id="action"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    >
                        <option value="issue">Uitgeven</option>
                        <option value="return">Innemen</option>
                        <option value="reportDamage">Schade melden</option>
                    </select>
                </div>
                {action === 'reportDamage' && (
                    <div>
                        <label htmlFor="damageDescription">Damage Description:</label>
                        <textarea
                            id="damageDescription"
                            value={damageDescription}
                            onChange={(e) => setDamageDescription(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit">Submit</button>
            </form>

            <h2>Rental Requests</h2>
            <table>
                <thead>
                    <tr>
                        <th>Voertuig</th>
                        <th>Van</th>
                        <th>Tot</th>
                        <th>Huurder</th>
                        <th>Status</th>
                        <th>Aanpassen</th>
                    </tr>
                </thead>
                <tbody>
                    {rentalRequests.map(request => (
                        <tr key={request.id}>
                            <td>{request.vehicleBrand} {request.vehicleType} ({request.vehicleId})</td>
                            <td>{request.startDate}</td>
                            <td>{request.endDate}</td>
                            <td>{request.renterFirstName} {request.renterLastName}</td>
                            <td>{request.status}</td>{/* STATUS NOG TOEVOEGEN*/}
                            <td><button onClick={() => { /* HandleEdit om voertuig id bovenin in te vullen? */ }} >Acties</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <h2>Damage Reports</h2>
            <table>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Voertuig</th>
                        <th>Beschrijving</th>
                        <th>Status</th>
                        <th>Aanpassen</th>
                    </tr>
                </thead>
                <tbody>
                    {damageReports.map(report => (
                        <tr key={report.id}>
                            <td>{report.date}</td>
                            <td>{report.vehicleId}</td>
                            <td>{report.description}</td>
                            <td>{report.status}</td>
                            <td><button onClick={() => {/* Status van schademelding aanpassen */ }}>Bewerken</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FrontOffice;