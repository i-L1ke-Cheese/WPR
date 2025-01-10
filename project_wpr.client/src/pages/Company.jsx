import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Company() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [tempMaxVehicles, setTempMaxVehicles] = useState({});
    const [editUserId, setEditUserId] = useState(null);
    const [addBusinessRenterId, setAddBusinessRenterId] = useState('');
    const [deleteBusinessRenterId, setDeleteBusinessRenterId] = useState('');
    const [companyMaxVehicles, setCompanyMaxVehicles] = useState();

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
            // Controleer of de gebruiker de rol 'CompanyAdmin' heeft
            if (stuff.role && stuff.role.includes("CompanyAdmin")) {
                setCompanyName(stuff.companyName);
                setCompanyId(stuff.companyId); // Zorg ervoor dat companyId correct wordt ingesteld
                handleFetch(stuff.companyId);
                handleCompanyLimit(stuff.companyId);
            } else {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();// get user info, but also check if user is logged in, and if not, go to login page
    }, []);

    const handleFetch = async (companyId) => {
        try {
            const response = await fetch(`https://localhost:7289/api/CompanyWorkers/GetCompanyWorkers?companyIDset=${companyId}`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                const tempData = {};
                data.forEach(user => {
                    tempData[user.id] = user.maxVehiclesPerBusinessRenter;
                });
                setTempMaxVehicles(tempData);
            } else {
                alert('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const handleInputChange = (id, event) => {
        const newTempMaxVehicles = { ...tempMaxVehicles };
        newTempMaxVehicles[id] = event.target.value;
        setTempMaxVehicles(newTempMaxVehicles);
    };

    const handleSave = async (businessRenterId) => {
        try {
            const response = await fetch('https://localhost:7289/api/VehicleLimit/SetBusinessRenterVehicleLimit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ businessRenterId, maxVehiclesPerBusinessRenter: tempMaxVehicles[businessRenterId] }),
            });
            if (response.ok) {
                alert('Max vehicles updated successfully');
                setEditUserId(null); // Reset edit mode
                // Update the users state with the new value
                setUsers(users.map(user =>
                    user.id === businessRenterId ? { ...user, maxVehiclesPerBusinessRenter: tempMaxVehicles[businessRenterId] } : user
                ));
            } else {
                alert('Failed to update max vehicles');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const handleAdd = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7289/api/AddUserToCompany/SetUserToCompany', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ BusinessRenterId: addBusinessRenterId, Id: companyId }), // Zorg ervoor dat de DTO correct wordt gebruikt
            });
            if (response.ok) {
                alert('Werknemer toegevoegd');
                handleFetch(companyId);
            } else {
                alert('Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7289/api/AddUserToCompany/DeleteUserFromCompany', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ BusinessRenterId: deleteBusinessRenterId, Id: companyId }), // Zorg ervoor dat de DTO correct wordt gebruikt
            });
            if (response.ok) {
                alert('Werknemer verwijderd');
                handleFetch(companyId);
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const handleCompanyLimit = async (companyId) => {
        try {
            const response = await fetch(`https://localhost:7289/api/VehicleLimit/GetCompanyRenterVehicleLimit?companyId=${companyId}`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCompanyMaxVehicles(data);
            } else {
                alert('Mag geen auto huren');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };


    return (
        <div className="container" style={{ color: 'black' }}>
            <p>Bedrijfs pagina van: {companyName}</p>
            <p>Maximaal aantal voertuigen voor het bedrijf: {companyMaxVehicles}</p>
            <form onSubmit={handleAdd}>
                <p>Voeg een werknemer toe aan {companyName}:</p>
                <div className="form-group">
                    <label htmlFor="addBusinessRenterId">Gebruiker ID: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="addBusinessRenterId"
                        value={addBusinessRenterId}
                        onChange={(e) => setAddBusinessRenterId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">  Voeg toe  </button>
            </form>
            <form onSubmit={handleDelete}>
                <p>Verwijder een werknemer</p>
                <div className="form-group">
                    <label htmlFor="deleteBusinessRenterId">Gebruiker ID: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="deleteBusinessRenterId"
                        value={deleteBusinessRenterId}
                        onChange={(e) => setDeleteBusinessRenterId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">  Verwijder  </button>
            </form>


            <div className="users-container" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                {users.map((user, index) => (
                    <div key={index} className="user-card" style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
                        <p><strong>User ID:</strong> {user.id}</p>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Company Name:</strong> {user.companyName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p onClick={() => setEditUserId(user.id)} style={{ cursor: 'pointer' }}>
                            <strong>Max Vehicles Per Business Renter: </strong> {user.maxVehiclesPerBusinessRenter}
                        </p>
                        {editUserId === user.id && (
                            <div>
                                <input
                                    type="number"
                                    value={tempMaxVehicles[user.id] || ''}
                                    onChange={(event) => handleInputChange(user.id, event)}
                                />
                                <button onClick={() => handleSave(user.id)}>Save</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Company;









