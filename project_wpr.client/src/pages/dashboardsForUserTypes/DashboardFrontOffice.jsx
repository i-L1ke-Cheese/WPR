import React, { useState, useEffect } from 'react';
import './DashboardFrontoffice.css';

function DashboardFrontOffice() {
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
    const [suspectedKm, setSuspectedKm] = useState('');
    const [rentalRequestStatus, setRentalRequestStatus] = useState();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [userDepartment, setUserDepartment] = useState('');

    const currentDate = new Date();

    /**
     * Fetches rental requests and damage reports from the API.
     */
    useEffect(() => {
        const fetchUserDepartment = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/Account/getCurrentAccount`, {
                    credentials: 'include',
                })
                if (response.ok) {
                    const data = await response.json();
                    setUserDepartment(data.role);
                } else {
                    console.error("Failed to fetch user department");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchUserDepartment();
    }, []);

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
                            console.log(data);
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

                                        intention: request.intention,
                                        farthestDestination: request.farthestDestination,
                                        suspectedKm: request.suspectedKm,

                                        //intention: userDepartment === 'EmployeeBackOffice' ? request.intention : undefined,
                                        //farthestDestination: userDepartment === 'EmployeeBackOffice' ? request.farthestDestination : undefined,
                                        //suspectedKm: userDepartment === 'EmployeeBackOffice' ? request.suspectedKm : undefined,
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
    }, [userDepartment]);

    /**
     * Handles form submission, performs validation, and sends a request to the API.
     * @param {any} e
     * @returns
     */
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
                        employeeId: employeeId,
                        status: status,
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
                if (!rentalRequestStatus) {
                    return alert('Er moet een status worden ingevuld');
                }

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
                        farthestDestination: rentalRequestFarthestDestination,
                        startDate: startDate,
                        endDate: endDate,
                        suspectedKm: suspectedKm,
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

    /**
     * Fetches damage reports from the API.
     * @param {any} vehicleId
     */
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

    /**
     * Handles the deletion of a damage report.
     * @param {any} reportId
     */
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

    /**
    * Handles the editing of a rental request.
    */
    const handleEditRentalRequest = (request) => {
        setRentalRequestId(request.id);
        setCarId(request.vehicleId);
        setAction('editRentalRequest');
        setRentalRequestStatus(request.status);
        setRentalRequestIntention(request.intention);
        setRentalRequestFarthestDestination(request.farthestDestination);
        setStartDate(request.startDate);
        setEndDate(request.endDate);
        setSuspectedKm(request.suspectedKm);
    };

    /**
    * Handles the editing of a damage report.
    */
    const handleEditDamageReport = (report) => {
        setCarId(report.vehicleId);
        setAction('editDamageReport');
        setDamageDescription(report.description);
        setStatus(report.status);
        setDamageReportId(report.id);
    };

    return (
        <div className='div'>
            <div className='Test' style={{ width: 'auto' }}>
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
                                {userDepartment == "EmployeeBackOffice" &&
                                    <>
                                        <option value="in behandeling">In behandeling</option>
                                        <option value="goedgekeurd">Goedgekeurd</option>
                                        <option value="afgekeurd">Afgekeurd</option>
                                    </>
                                }
                                {userDepartment == "EmployeeFrontOffice" &&
                                    <>
                                        <option value={null}>-- Kies optie --</option>
                                        <option value="uitgegeven">Uitgegeven</option>
                                        <option value="ingenomen">Ingenomen</option>
                                    </>
                                }

                            </select>
                        </div>
                    )}
                    <button type="submit">Submit</button>
                </form>
            </div>

            <h2>Huuraanvragen</h2>
            <div className='Test' style={{ width: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Voertuig</th>
                            <th>Van</th>
                            <th>Tot</th>
                            {userDepartment === 'EmployeeBackOffice' &&
                                <>
                                    <th>Intentie</th>
                                    <th>Verste bestemming</th>
                                    <th>Verwachte km</th>
                                </>
                            }
                            <th>Huurder</th>
                            <th>Status</th>
                            <th>Aanpassen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentalRequests
                            .filter(request => {
                                if (userDepartment === 'EmployeeFrontOffice') {
                                    return ['goedgekeurd', 'uitgegeven', 'ingenomen'].includes(request.status);
                                }
                                return true;
                            })
                            .filter(request => new Date(request.endDate) >= currentDate)
                            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Sort rental requests by start date
                            .map(request => (
                                <tr key={request.id}>
                                    <td>{request.vehicleBrand} {request.vehicleType} ({request.vehicleId})</td>
                                    <td>{request.startDate}</td>
                                    <td>{request.endDate}</td>
                                    {userDepartment === 'EmployeeBackOffice' &&
                                        <>
                                            <td>{request.intention}</td>
                                            <td>{request.farthestDestination}</td>
                                            <td>{request.suspectedKm}</td>
                                        </>
                                    }
                                    <td>{request.renterFirstName} {request.renterLastName}</td>
                                    <td>{request.status}</td>
                                    <td><button onClick={() => handleEditRentalRequest(request)}>Acties</button></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <h2>Schademeldingen</h2>
            <div className='Test'>
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
        </div>
    );
}

export default DashboardFrontOffice;