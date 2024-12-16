import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Row from './components/Row';
import Home from './pages/Home';
import About from './pages/About';
//import Company from './pages/Company'
import Registreer from './pages/Registreer';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import VehicleOverview from './pages/VehicleOverview';
import VehicleDetails from './pages/VehicleDetails';
import Settings from './pages/Settings';
import './App.css';
import * as topBTNmanager from './pages/updateTopBtns.js'

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
                                <li><Link to="/dashboard">Dashboard</Link></li>{ /* Alleen weergeven als je ingelogd bent */ }
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
                            {/*<Route path="/Company" element={<Company />} />*/}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;