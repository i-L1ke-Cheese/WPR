import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import DashboardPrivateRenter from './dashboardsForUserTypes/DashboardPrivateRenter';
import DashboardBusinessRenter from './dashboardsForUserTypes/DashboardBusinessRenter';
import DashboardCompanyAdmin from './dashboardsForUserTypes/DashboardCompanyAdmin';
import DashboardFrontoffice from './dashboardsForUserTypes/DashboardFrontOffice';
import DashboardVehicleManager from './dashboardsForUserTypes/DashboardVehicleManager';
import DashboardBackoffice from './dashboardsForUserTypes/DashboardBackoffice';



/**
 * Dashboard component toont een welkomstbericht en enkele placeholders voor toekomstige inhoud.
 * 
 * @returns {JSX.Element} Het gerenderde component dat het dashboard toont.
 */
function Dashboard() {
    const navigate = useNavigate();

    const [userType, setUserType] = useState("");

    /**
     * Haal de gebruikersinformatie op en bepaal welk dashboard moet worden weergegeven.
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
            console.log(user);
            //document.getElementById("DashboardFName").innerHTML = user.fName;

            
            console.log("setUserType: ", user.role)

            // Check if the user is a CompanyAdmin and if they have a companyId
            if (user.role === "CompanyAdmin" && !user.companyId) {
                navigate("/createcompany");
            } else { setUserType(user.role); }


        } else {
            navigate("/login"); 
        }

    }

    /**
     * Haal de gebruikersinformatie op bij het laden van de pagina.
     */
    useEffect(() => {
        getUserInfo();
    }, []);

    if (userType === "PrivateRenter") {
        return (
            <DashboardPrivateRenter />
        );
    } else if (userType === "BusinessRenter") {
        return (
            <DashboardBusinessRenter />
        );
    } else if (userType === "CompanyAdmin") {
        return (
            <DashboardCompanyAdmin />
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