import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import * as topBTNmanager from './updateTopBtns.js'

// https://uiverse.io/nathann09/bad-hound-78 Gebruikt voor inspiratie en hulp om frontend mooi te maken

/**
 * Component for the login page.
 * @returns
 */
function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	/**
	 * Handles the form submit event.
	 * @param {any} e
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = { email, password };

		try {
			const response = await fetch("https://localhost:7289/login?useCookies=true", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				console.log("Login successful");
				topBTNmanager.showAccountDropdown();
				navigate('/dashboard');
			} else {
				console.error("Login failed");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	/**
	 * Checks if the user is already logged in.
	 */
	const check = async () => {
		const loggedInCheckResponse = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (loggedInCheckResponse.ok) { //if already logged in, and still opening /login, get redirected to the dashboard
			navigate("/dashboard");
		}
	}

	/**
	 * useEffect hook to check if the user is already logged in.
	 */
	useEffect(() => {
		check();
	}, []);

	return (
		<form className="form" onSubmit={handleSubmit}>
			<p className="form-title">Log hier in</p>
			<div className="input-container">
				<input
					type="email"
					placeholder="Enter email:"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<span></span>
			</div>
			<div className="input-container">
				<input
					type="password"
					placeholder="Enter password:"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<p id="message" className="green"></p>
			<button type="submit" className="submit">Login</button>
			<p className="registreer-link">
				Geen account? <Link to="/registreer">Registreer hier</Link>
			</p>
			<p className="registreer-link">
				<Link to="/wachtwoord_vergeten">Wachtwoord vergeten</Link>
			</p>
		</form>
	);
}

export default Login;