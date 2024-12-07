import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Row from './components/Row';
import Home from './pages/Home';
import About from './pages/About';
import Registreer from './pages/Registreer'
import Login from './pages/Login'
import './App.css';

function App() {
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
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/login">Login</Link></li>
                            </ul>
                        </nav>
                    </div>
                    {/* Main content */}
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/registreer" element={<Registreer />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;