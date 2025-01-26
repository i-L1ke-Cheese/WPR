import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Subscriptions from '../Subscriptions';

/**
 * Dashboard component voor companhy admins
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function DashboardCompanyAdmin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [tempMaxVehicles, setTempMaxVehicles] = useState({});
    const [editUserId, setEditUserId] = useState(null);
    const [deleteBusinessRenterId, setDeleteBusinessRenterId] = useState('');
    const [companyMaxVehicles, setCompanyMaxVehicles] = useState();
    //const [accountType, setAccountType] = useState('');

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        accountType: "businessRenter",
    });

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    /**
     * Gets the current user's information and checks if they are logged in.
     */
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
                setCompanyName(stuff.companyName); // Zorgt ervoor dat companyName correct wordt ingesteld
                setCompanyId(stuff.companyId); // Zorg ervoor dat companyId correct wordt ingesteld
                handleFetch(stuff.companyId); // Haalt maximale voertuigen op voor een gebruiker
                handleCompanyLimit(stuff.companyId); // haalt maximale voertuigen voor een bedrijf op
            } else {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }

    /**
     * Gets the current user's information and checks if they are logged in.
     */
    useEffect(() => {
        getUserInfo();// get user info, but also check if user is logged in, and if not, go to login page
    }, []);

    /**
     * Fetches the users for a company.
     * @param {any} companyId
     */
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
                const combinedArray = [
                    ...(data.businessRenters || []),
                    ...(data.vehicleManagers || [])
                ];
                console.log(combinedArray);
                setUsers(combinedArray);
            } else {
                alert('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    /**
     * Handles the input change for the max vehicles.
     * @param {any} id
     * @param {any} event
     */
    const handleInputChange = (id, event) => {
        const newTempMaxVehicles = { ...tempMaxVehicles };
        newTempMaxVehicles[id] = event.target.value;
        setTempMaxVehicles(newTempMaxVehicles);
    };

    /**
     * Handles the save of the max vehicles.
     * @param {any} businessRenterId
     */
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
                setEditUserId(null);
                // Zet de nieuwe user neer
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

    /**
     * Handles the delete of a user.
     */
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

    /**
     * Handles the company limit.
     */
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

    /**
     * Handles input change events and updates the form data state.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles the account type change.
     */
    const handleAccountTypeChange = (e) => {
        const { value } = e.target;
        //setAccountType(value);
        setFormData((prevData) => ({
            ...prevData,
            accountType: value,
        }));
    };

    /**
     * Handles form submission, performs validation, and sends a registration request.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSuccess(false);
        if (formData.email === "") {
            setMessage("Please enter email.");
            return;
        }

        if (formData.password === "") {
            setMessage("Please enter password.");
            return;
        }

        if (formData.firstName === "") {
            setMessage("Please enter first name.");
            return;
        }

        if (formData.lastName === "") {
            setMessage("Please enter last name.");
            return;
        }

        if (formData.dateOfBirth === "") {
            setMessage("Please enter date of birth.");
            return;
        }

        try {
            console.log(formData);
            //console.log(accountType);

            const response = await fetch(`https://localhost:7289/api/Register/register-company-account?renter=${formData.accountType}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage("Registration successful!");
            } else {
                setIsSuccess(false);
                if (result.errors) {
                    const errorMessages = Object.values(result.errors)
                        .flat()
                        .join(" ");
                    setMessage(errorMessages);
                } else {
                    setMessage(result.message || "Registration failed.");
                }
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div>

            <form className='Test' style={{ textAlign: 'center' }} onSubmit={handleSubmit}>
                <h2>Maak een zakelijke account aan</h2>
                <p style={{ textAlign: 'center' }}>Bedrijfs pagina van: {companyName}</p>
                <p style={{ textAlign: 'center' }}>Maximaal aantal voertuigen voor het bedrijf: {companyMaxVehicles}</p>
                <div className='Test' style={{ margin: 'auto', paddingBottom: '10px' }}>
                    <label htmlFor="accountType">Functie:</label>
                    <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleAccountTypeChange}
                    >
                        <option value="businessRenter">Zakelijke huurder</option>
                        <option value="vehicleManager">Wagenparkbeheerder</option>
                    </select>



                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    <label>Wachtwoord:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />


                    <label>Naam:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />



                    <label>Achternaam:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />


                    <label>Geboortedatum:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <button style={{}} type="submit">Register</button>
                </div>
                <div className='Test'>
                    <form style={{ alignContent: '' }} onSubmit={handleDelete}>
                        <p style={{ paddingTop: '20px', color: "black"}}>Verwijder een werknemer</p>
                        <div>
                            <label htmlFor="deleteBusinessRenterId">Gebruiker ID: </label>
                            <input
                                type="text"
                                className="form-control"
                                id="deleteBusinessRenterId"
                                value={deleteBusinessRenterId}
                                onChange={(e) => setDeleteBusinessRenterId(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">  Verwijder  </button>
                        </div>

                    </form>
                </div>



                <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
            </form>
            <div className="Test" style={{ color: 'black' }}>

                <div className="users-container" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                    {users.map((user, index) => (
                        <div key={index} className="Test" style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', flex: '1 0 21%' }}>
                            <p><strong>Gebruiker ID:</strong> {user.id}</p>
                            <p><strong>Naam:</strong> {user.firstName}</p>
                            <p><strong>Achternaam:</strong> {user.lastName}</p>
                            <p><strong>Bedrijfsnaam:</strong> {user.companyName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Functie:</strong> {user.userRole}</p>
                            {user.userRole == "BusinessRenter" &&
                                <p onClick={() => setEditUserId(user.id)} style={{ cursor: 'pointer' }}>
                                    <strong>Maximale toegestaande voertuigen: </strong> {user.maxVehiclesPerBusinessRenter}
                                </p>
                            }
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
            <Subscriptions />
        </div>

    );
}

export default DashboardCompanyAdmin;