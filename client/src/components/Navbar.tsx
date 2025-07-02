import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">🌱 EcoEventos</Link>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/eventos">Eventos</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
            </ul>
            <ul className="nav-auth">
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;