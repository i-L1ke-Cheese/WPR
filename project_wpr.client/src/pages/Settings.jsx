import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Settings() {

    const navigate = useNavigate();

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
            console.log(stuff);
            document.getElementById("DashboardFName").innerHTML = stuff.fName;
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        getUserInfo(); // get user info, but also check if user is logged in, and if not, go to login page
    })

  return (
    <h2>SETTINGS</h2>
  );
}

export default Settings;