import React, { useState, useEffect } from 'react';
import './Frontoffice.css';

function FrontOffice() {
    const [carId, setCarId] = useState('');
    const [action, setAction] = useState('issue');
    const [status, setStatus] = useState('Beschadigd');
    const [damageReports, setDamageReports] = useState([]);
    const [damageReportId, setDamageReportId] = useState('');
    const [damageDescription, setDamageDescription] = useState('');

    const [rentalRequests, setRentalRequests] = useState([]);
    const [rentalRequestId, setRentalRequestId] = useState('');
    const [rentalRequestIntention, setRentalRequestIntention] = useState('');
    const [rentalRequestFarthestDestination, setRentalRequestFarthestDestination] = useState('');
    const [rentalRequestStatus, setRentalRequestStatus] = useState('in behandeling');

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

    // Create or update damage report
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(action);
            if (action === 'reportDamage') {
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
                        employeeId: 'currentEmployeeId', // Replace with actual employee ID
                        status: status
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
            } else if (action === 'editDamageReport') {
                const response = await fetch(`https://localhost:7289/api/DamageReport/update-schademelding/${damageReportId}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        vehicleId: carId,
                        description: damageDescription,
                        employeeId: 'currentEmployeeId',
                        status: status
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Response: ', data);
                    handleViewDamageReports();
                    return (alert('Schademelding succesvol bijgewerkt'));
                } else {
                    console.log('Response: ', data);
                    return (alert('Er is iets mis gegeaan'));
                }
            } else if (action === 'editRentalRequest') {
                const response = await fetch(`https://localhost:7289/api/RentalRequest/update-huuraanvraag/${rentalRequestId}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        vehicleId: carId,
                        status: rentalRequestStatus,
                        intention: rentalRequestIntention,
                        farthestDestination: rentalRequestFarthestDestination
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Response: ', data);
                    // Update rental requests
                    const updatedRequests = rentalRequests.map(request =>
                        request.id === rentalRequestId ? { ...request, status: rentalRequestStatus } : request
                    );
                    setRentalRequests(updatedRequests);
                    return (alert('Huuraanvraag succesvol bijgewerkt'));
                } else {
                    console.log('Response: ', data);
                    return (alert('Er is iets mis gegeaan'));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleViewDamageReports = async (vehicleId) => {
        // Fetch damage reports
        try {
            const response = await fetch(`https://localhost:7289/api/DamageReport/alle-voertuigen`);
            if (response.ok) {
                const data = await response.json();
                const carDetails = await Promise.all(
                    data.map(async (report) => {
                        const vehicleId = report.vehicleId;
                        if (vehicleId) {
                            const vehicleResponse = await fetch(`https://localhost:7289/api/Vehicle/${vehicleId}`);
                            if (vehicleResponse.ok) {
                                const vehicleData = await vehicleResponse.json();
                                return {
                                    ...report,
                                    vehicleBrand: vehicleData.brand,
                                    vehicleType: vehicleData.type,
                                };
                            }
                        }
                        return carDetails;
                    })
                );
                setDamageReports(carDetails);
            } else {
                console.error("Failed to fetch damage reports", response);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    async function handleDeleteDamageReport(reportId) {
        try {
            const response = await fetch(`https://localhost:7289/api/DamageReport/delete-schademelding/${reportId}`, {
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
                alert("Schademelding succesvol verwijderd")
                setDamageReports((prev) => prev.filter((d) => d.id !== reportId));
            }
        } catch (error) {
            console.error('Error: ', error)
            alert('Er is een fout opgetreden bij het verwijderen van de schademelding');
        }
    }

    const handleEditRentalRequest = (request) => {
        setRentalRequestId(request.id);
        setCarId(request.vehicleId);
        setAction('editRentalRequest');
        setRentalRequestStatus(request.status);
        setRentalRequestIntention(request.intention);
        setRentalRequestFarthestDestination(request.farthestDestination);
    };

    const handleEditDamageReport = (report) => {
        setCarId(report.vehicleId);
        setAction('editDamageReport');
        setDamageDescription(report.description);
        setStatus(report.status);
        setDamageReportId(report.id);
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
                        <option value="editRentalRequest">Huuraanvraag bewerken</option>
                        <option value="reportDamage">Schade melden</option>
                        <option value="editDamageReport">Schademelding bewerken</option>
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
                {action === 'editDamageReport' && (
                    <div>
                        <label htmlFor="damageDescription">Damage Description:</label>
                        <textarea
                            id="damageDescription"
                            value={damageDescription}
                            onChange={(e) => setDamageDescription(e.target.value)}
                        />
                    </div>
                )}
                {(action === 'reportDamage' || action === 'editDamageReport') && (
                    <div>
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Beschadigd">Beschadigd</option>
                            <option value="In reparatie">In reparatie</option>
                            <option value="Gerepareerd">Gerepareerd</option>
                        </select>
                    </div>
                )}
                {action === 'editRentalRequest' && (
                    <div>
                        <label htmlFor="rentalRequestStatus">Status:</label>
                        <select
                            id="rentalRequestStatus"
                            value={rentalRequestStatus}
                            onChange={(e) => setRentalRequestStatus(e.target.value)}
                        >
                            <option value="in behandeling">In behandeling</option>
                            <option value="goedgekeurd">Goedgekeurd</option>
                            <option value="afgekeurd">Afgekeurd</option>
                            <option value="uitgegeven">Uitgegeven</option>
                            <option value="ingenomen">Ingenomen</option>
                        </select>
                    </div>
                )}
                <button type="submit">Submit</button>
            </form>

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

            <h2>Schademeldingen</h2>
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
                            <td>{report.vehicleBrand} {report.vehicleType} ({report.vehicleId})</td>
                            <td>{report.description}</td>
                            <td>{report.status}</td>
                            <td>
                                <button onClick={() => handleEditDamageReport(report)}>Bewerken</button>
                                <button onClick={() => handleDeleteDamageReport(report.id)}>Verwijderen</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FrontOffice;