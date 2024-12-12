import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';

function Header() {

    const navigate = useNavigate();

    const toggleVisibility = () => {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    const closeDropdown = () => {
        const myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }

    const goLogin = () => {
        navigate("/login");
    }
    const goDashboard = (e) => {
        e.preventDefault();
        closeDropdown();
        navigate("/dashboard");
    }
    const goSettings = (e) => {
        e.preventDefault();
        closeDropdown();
        navigate("/settings");
    }
    const goSignout = (e) => {
        e.preventDefault();
        closeDropdown();
        navigate("/logout");
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) {
                closeDropdown();
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    })

    return (
        <div className="topBar">
            <div className="navbar">
                <h1 id="PageTitle" >CarAndAll</h1>
                <div id="AccountDropdownBTNTopBar" className="dropdown hide">
                    <button className="AccountMenuBTN" onClick={toggleVisibility}>ACCOUNT
                    </button>
                    <div className="dropdown-content" id="myDropdown">
                        <p><b>hey, <span id="dropdownUserTag">user</span>!</b></p>
                        <a href="#" onClick={goDashboard}>Dashboard</a>
                        <a href="#" onClick={goSettings}>Settings</a>
                        <a href="#" onClick={goSignout}>Sign Out</a>
                    </div>
                </div>
                <div id="LoginBTNTopBar" className="dropdown hide">
                    <button className="AccountMenuBTN" onClick={goLogin}>LOG IN
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;