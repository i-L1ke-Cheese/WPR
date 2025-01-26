import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Registreer from './pages/Registreer'
import Login from './pages/Login'
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import VehicleOverview from './pages/VehicleOverview';
import VehicleDetails from './pages/VehicleDetails';
import Settings from './pages/Settings';
import EditUserData from './pages/EditUserData';
import EditVehicles from './pages/EditVehicles';
import AddVehicle from './pages/AddVehicle';
import CreateCompany from './pages/CreateCompany'
import Privacyverklaring from './pages/Privacyverklaring';
import EditRentalRequest from './pages/EditRentalRequest';
import './App.css';
import * as topBTNmanager from './pages/updateTopBtns';
import Subscriptions from './pages/Subscriptions';

/**
 * App component is de hoofdcomponent van de applicatie.
 * @returns
 */
function App() {
    const [userType, setUserType] = useState("");
    /**
     * useEffect hook die de showAccountDropdown functie van topBTNmanager aanroept.
     */
    useEffect(() => {
        topBTNmanager.showAccountDropdown();
        getUserInfo();
    })

    /**
     * Haal de gebruikersinformatie op en stel de usertype in.
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
            const user = await loggedInCheckResponse.json();
            setUserType(user.role);
        }
    }


    return (
        <Router>
            <div className="App">
                <Header />
                <div className="main-layout"  >
                    {/* Sidebar */}
                    <div className="sidebar">
                        <nav>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/overview">Overzicht</Link></li>
                                <li><Link to="/about">Over ons</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                {userType === "EmployeeBackOffice" &&
                                    <li><Link to="/EditVehicles">Voertuigen aanpassen</Link></li>
                                }
                            </ul>
                        </nav>
                    </div>
                    {/* Main content */}
                    <div className="content" > 
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/overview" element={<VehicleOverview />} />
                            <Route path="/vehicle" element={<VehicleDetails /> } />
                            <Route path="/about" element={<About />} />
                            <Route path="/registreer" element={<Registreer />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/edituserdata" element={<EditUserData />} />
                            <Route path="/editvehicles" element={<EditVehicles />} />
                            <Route path="/addvehicle" element={<AddVehicle />} />
                            <Route path="/createcompany" element={<CreateCompany />} />
                            <Route path="/subscriptions" element={<Subscriptions />} />
                            <Route path="/privacyverklaring" element={<Privacyverklaring />} />
                            <Route path="/edit-rental-request" element={<EditRentalRequest />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;