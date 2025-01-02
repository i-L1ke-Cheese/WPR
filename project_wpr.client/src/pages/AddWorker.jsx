import React, { useState } from 'react';

function AddWorker() {
    const [businessRenterId, setBusinessRenterId] = useState('');
    const [addCompany, setAddCompany] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7289/api/AddUserToCompany/SetCompanyFromUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ businessRenterId, addCompany }),
            });
            if (response.ok) {
                alert('User added successfully');
            } else {
                alert('Failed to add user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    return (
        <div className="container">

            <form onSubmit={handleSubmit}>
                <p>Page to add users to your company! LETS GO</p>
                <div className="form-group">
                
                    <label htmlFor="businessRenterId">Business Renter ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="businessRenterId"
                        value={businessRenterId}
                        onChange={(e) => setBusinessRenterId(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Add User</button>
            </form>
        </div>
    );
}

export default AddWorker;
