import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const EditRentalRequest = () => {
    const { id } = useParams();
    const [currentUserId, setCurrentUserId] = useState('');
    const [rentalUserId, setRentalUserId] = useState('');
    const [rentalRequest, setRentalRequest] = useState({
        startDate: '',
        endDate: '',
        intention: '',
        farthestDestination: '',
        suspectedKm: ''
    });

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rentalId = queryParams.get("id");


    // Fetch the rental request details
    useEffect(() => {
        const fetchRentalRequest = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/RentalRequest/${rentalId}`);
                const data = await response.json();

                setRentalRequest({
                    startDate: data.startDate,
                    endDate: data.endDate,
                    intention: data.intention,
                    farthestDestination: data.farthestDestination,
                    suspectedKm: data.suspectedKm
                });

                console.log(rentalRequest);
                if (!(rentalRequest.privateRenterId == null)) {
                    setRentalUserId(rentalRequest.privateRenterId);
                } else if (!(rentalRequest.businessRenterId == null)) {
                    setRentalUserId(rentalRequest.businessRenterId);
                }
                console.log("UserId: ", rentalUserId);

            } catch (error) {
                console.error('Error fetching rental request:', error);
            }
        };

        fetchRentalRequest();
        getUserInfo();
    }, [id]);


    const getUserInfo = async () => {
        try {
            const response = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUserId(data.UserId);
            }

            console.log("Current userid: ", currentUserId);

        } catch (error) {
            console.error("Error: ", error);
        }
    }


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
            const response = await fetch(`https://localhost:7289/api/RentalRequest/update-huuraanvraag/${rentalId}`, {
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

    //if (!(currentUserId == rentalUserId)) {
    //    return <div><p style={{ color: 'black' }}>Uw account komt niet overeen met het account van deze huuraanvraag.</p></div>
    //} //else {
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
   // }
};

export default EditRentalRequest;