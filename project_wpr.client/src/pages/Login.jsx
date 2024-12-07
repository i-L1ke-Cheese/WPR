    import React from 'react';
    import { Link } from 'react-router-dom';
    import './Login.css';
// https://uiverse.io/nathann09/bad-hound-78 Gebruikt voor inspiratie en hulp om frontend mooi te maken
function Login() {
    
        return (
        <form className="form">
            <p className="form-title">Log hier in</p>
            <div className="input-container">
                <input type="email" placeholder="Enter email"/>
                    <span></span>
                </div>
            <div className="input-container">
                <input type="password" placeholder="Voer uw wachtwoord in"/>
            </div>
            <button type="submit" className="submit">Login</button>

                <p className="registreer-link">
                    Geen account? <Link to="/registreer">Registreer hier</Link>
                </p>
                <p className="registreer-link">
                   <Link to="/wachtwoord_vergeten">Wachtwoord vergeten</Link>
                </p>
        </form>
        )
    }

    export default Login;