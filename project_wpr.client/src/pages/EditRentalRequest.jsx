import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditRentalRequest = () => {
    const { id } = useParams();
    //const history = useHistory();
    const [rentalRequest, setRentalRequest] = useState({
        startDate: '',
        endDate: '',
        intention: '',
        farthestDestination: '',
        suspectedKm: ''
    });

    useEffect(() => {
        // Fetch the rental request details
        const fetchRentalRequest = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/RentalRequest/${id}`);
                const data = await response.json();
                setRentalRequest(data);
            } catch (error) {
                console.error('Error fetching rental request:', error);
            }
        };

        fetchRentalRequest();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRentalRequest((prevRequest) => ({
            ...prevRequest,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/update-huuraanvraag/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rentalRequest)
            });

            if (response.ok) {
                alert('Rental request updated successfully');
                history.push('/dashboard');
            } else {
                alert('Failed to update rental request');
            }
        } catch (error) {
            console.error('Error updating rental request:', error);
        }
    };

    return (
        <div>
            <h2>Edit Rental Request</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={rentalRequest.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={rentalRequest.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Intention:</label>
                    <input
                        type="text"
                        name="intention"
                        value={rentalRequest.intention}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Farthest Destination:</label>
                    <input
                        type="text"
                        name="farthestDestination"
                        value={rentalRequest.farthestDestination}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Suspected Km:</label>
                    <input
                        type="number"
                        name="suspectedKm"
                        value={rentalRequest.suspectedKm}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Rental Request</button>
            </form>
        </div>
    );
};

export default EditRentalRequest;