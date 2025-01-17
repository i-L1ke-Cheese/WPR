
import React, { useEffect } from 'react';
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
import Company from './pages/Company';
import EditUserData from './pages/EditUserData';
import EditVehicles from './pages/EditVehicles';
import AddVehicle from './pages/AddVehicle';
import CreateCompany from './pages/CreateCompany'
import FrontOffice from './pages/FrontOffice';
import Privacyverklaring from './pages/Privacyverklaring';
import './App.css';
import * as topBTNmanager from './pages/updateTopBtns';

function App() {

    useEffect(() => {
        topBTNmanager.showAccountDropdown();
    })

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="main-layout">
                    {/* Sidebar */}
                    <div className="sidebar">
                        <nav>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/overview">Overzicht</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li> { /* Alleen weergeven als je ingelogd bent */}
                                <li><Link to="/Company">Company</Link></li>
                                <li><Link to="/EditVehicles">Voertuigen aanpassen</Link></li> {/* Alleen weergeven als backoffice medewerker */ }
                            </ul>
                        </nav>
                    </div>
                    {/* Main content */}
                    <div className="content">
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
                            <Route path="/company" element={<Company />} />
                            <Route path="/edituserdata" element={<EditUserData />} />
                            <Route path="/editvehicles" element={<EditVehicles />} />
                            <Route path="/addvehicle" element={<AddVehicle />} />
                            <Route path="/createcompany" element={<CreateCompany />} />
                            <Route path="/frontoffice" element={<FrontOffice />} />
                            <Route path="/privacyverklaring" element={<Privacyverklaring /> } />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;