import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Dashboard component voor business renters
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function DashboardVehicleManager() {

    const [rentalRequests, setRentalRequests] = useState([]);

    const currentDate = new Date();

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
                            if (request.privateRenterId) {
                                userId = request.privateRenterId;
                            } else if (request.businessRenterId) {
                                userId = request.businessRenterId;
                            }
                            console.log(userId, request.businessRenterId, request.privateRenterId);
                            if (userId) {
                                const userResponse = await fetch(`https://localhost:7289/api/Account/getUser?userID=${userId}`, {
                                    credentials: 'include',
                                });
                                if (userResponse.ok) {
                                    const userData = await userResponse.json();
                                    return {
                                        ...request,
                                        renterFirstName: userData.fName,
                                        renterLastName: userData.lName,
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

    return (
        <div className="dashboard">
            <h2>Huuraanvragen</h2>
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
                    {rentalRequests
                        .filter(request => new Date(request.endDate) >= currentDate)
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Sort rental requests by start date
                        .map(request => (
                            <tr key={request.id}>
                                <td>{request.vehicleBrand} {request.vehicleType} ({request.vehicleId})</td>
                                <td>{request.startDate}</td>
                                <td>{request.endDate}</td>
                                <td>{request.renterFirstName} {request.renterLastName}</td>
                                <td>{request.status}</td>{/* STATUS NOG TOEVOEGEN*/}
                                <td><button onClick={() => handleEditRentalRequest(request)}>Acties</button></td>
                            </tr>
                        ))}
                </tbody>
            </table>

        </div>
    );
}

export default DashboardVehicleManager;