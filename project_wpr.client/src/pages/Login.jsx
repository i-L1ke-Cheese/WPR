import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import './Login.css';
// https://uiverse.io/nathann09/bad-hound-78 Gebruikt voor inspiratie en hulp om frontend mooi te maken
function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
				console.log("Login successful:");
				document.getElementById("message").innerHTML = "login succesfull";
				const response = await fetch("https://localhost:7289/api/Account/getCurrentAccount", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-type": "application/json"
					}
				});

				if (response.ok) {
					console.log("ok");
				} else {
					console.log("not ok");
				}
			} else {
				console.error("Login failed");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

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
