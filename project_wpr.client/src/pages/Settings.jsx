import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import SettingsCompanyAdmin from './settingsForUserTypes/SettingsCompanyAdmin';
import SettingsRenter from './settingsForUserTypes/SettingsRenter';


/**
 * Dashboard component toont een welkomstbericht en enkele placeholders voor toekomstige inhoud.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function Dashboard() {
    const navigate = useNavigate();

    const [userType, setUserType] = useState("");

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
            //document.getElementById("DashboardFName").innerHTML = user.fName;

            setUserType(user.role);

            // Check if the user is a CompanyAdmin and if they have a companyId
            if (user.role === "CompanyAdmin" && !user.companyId) {
                navigate("/createcompany");
            }
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    if (userType === "PrivateRenter") {
        return (
            <SettingsRenter />
        );
    } else if (userType === "BusinessRenter") {
        return (
            <SettingsRenter />
        );
    } else if (userType === "CompanyAdmin") {
        return (
            <SettingsCompanyAdmin />
        );
    } else if (userType === "EmployeeFrontOffice") {
        return (
            <div>
                <h2>FrontOffice</h2>
                <DashboardFrontoffice />
            </div>
        );
    } else if (userType === "VehicleManager") {
        return (
            <DashboardVehicleManager />
        );
    } else if (userType === "EmployeeBackOffice") {
        return (
            <div>
                <h2>BackOffice</h2>
                <DashboardBackoffice />
                <DashboardFrontoffice />
            </div>
        );
    }
}

export default Dashboard;