import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const EditRentalRequest = () => {
    const { id } = useParams();
    const [currentUserId, setCurrentUserId] = useState('');
    const [rentalUserId, setRentalUserId] = useState('');
    const [rentalRequest, setRentalRequest] = useState({
        startDate: '',
        endDate: '',
        intention: '',
        farthestDestination: '',
        suspectedKm: '',
        privateRenterId: '',
        businessRenterId: ''
    });

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rentalId = queryParams.get("id");

    const navigate = useNavigate();

    // Fetch the rental request details
    useEffect(() => {
        const fetchRentalRequest = async () => {
            try {
                const response = await fetch(`https://localhost:7289/api/RentalRequest/${rentalId}`);
                const data = await response.json();
                setRentalRequest(data);
            } catch (error) {
                console.error('Error fetching rental request:', error);
            }
        };

        fetchRentalRequest();
        getUserInfo();
    }, [id]);

    /**
     * Fetch the current user's id
     */
    useEffect(() => {
        if (!(rentalRequest.privateRenterId == null)) {
            setRentalUserId(rentalRequest.privateRenterId);
        } else if (!(rentalRequest.businessRenterId == null)) {
            setRentalUserId(rentalRequest.businessRenterId);
        }
    }, [rentalRequest]);

    /**
     * Fetch the current user's id
     */
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
                setCurrentUserId(data.id);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    /**
     * Handle form input changes
     * @param {any} e
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRentalRequest((prevRequest) => ({
            ...prevRequest,
            [name]: value
        }));
    };

    /**
     * Handle form submit
     * @param {any} e
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7289/api/RentalRequest/update-huuraanvraag/${rentalId}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: "in behandeling",
                    startDate: rentalRequest.startDate,
                    endDate: rentalRequest.endDate,
                    intention: rentalRequest.intention,
                    farthestDestination: rentalRequest.farthestDestination,
                    suspectedKm: rentalRequest.suspectedKm
                })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Response: ", data);
                alert('Rental request updated successfully');
                navigate("/dashboard");
            } else {
                alert('Failed to update rental request');
            }
        } catch (error) {
            console.error('Error updating rental request:', error);
        }
    };

    /**
     * Handle dashboard button click
     */
    const handleDashboardClick = () => {
        navigate("/dashboard");
    };

    if (!(currentUserId == rentalUserId)) {
        return <div><p style={{ color: 'black' }}>Uw account komt niet overeen met het account van deze huuraanvraag.</p></div>
    } else {
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
                    <div><p style={{ color: 'black' }}><b>Als u een huuraanvraag aanpast moet deze opniew worden goedgekeurd door een medewerker</b></p></div>
                    <button type="submit">Update Rental Request</button>
                    <button type="button" onClick={handleDashboardClick}>Dashboard</button>
                </form>
            </div>
        );
    }
};

export default EditRentalRequest;