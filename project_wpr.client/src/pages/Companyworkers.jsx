import React, { useState } from 'react';

function Getworkers() {
    const [addCompany, setAddCompany] = useState('');
    const [users, setUsers] = useState([]);

    const handleFetch = async () => {
        try {
            const response = await fetch(`https://localhost:7289/api/CompanyWorkers/companyTest?companyIDset=${addCompany}`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                alert('Users fetched successfully');
            } else {
                alert('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    return (
        <div className="container">
            <p>Page to add users to your company! LETS GO</p>
            <div className="form-group">
                <label htmlFor="addCompany">Company ID</label>
                <input
                    type="number"
                    className="form-control"
                    id="addCompany"
                    value={addCompany}
                    onChange={(e) => setAddCompany(e.target.value)}
                    required
                />
            </div>
            <button onClick={handleFetch} className="btn btn-primary">Fetch Users</button>

            <div className="users-container" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                {users.map((user, index) => (
                    <div key={index} className="user-card" style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Company Name:</strong> {user.companyName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Max Vehicles Per Business Renter:</strong> {user.maxVehiclesPerBusinessRenter}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Getworkers;
