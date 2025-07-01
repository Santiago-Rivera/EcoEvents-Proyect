import { Link } from 'react-router-dom';

const Home = () => (
    <div className="home-container">
        <div className="hero-section">
            <h1>🌱 Bienvenido a EcoEventos</h1>
            <p className="hero-subtitle">
                Conecta con tu comunidad a través de eventos ecológicos y sostenibles
            </p>
            <p className="hero-description">
                Descubre talleres, limpiezas ambientales, conferencias sobre sostenibilidad 
                y mucho más. ¡Únete a nosotros para crear un futuro más verde!
            </p>
            <div className="hero-buttons">
                <Link to="/eventos" className="btn btn-primary">
                    Ver Eventos
                </Link>
            </div>
        </div>
        
        <div className="features-section">
            <h2>¿Por qué EcoEventos?</h2>
            <div className="features-grid">
                <div className="feature-card">
                    <span className="feature-icon">🌍</span>
                    <h3>Impacto Real</h3>
                    <p>Participa en eventos que generan un impacto positivo en el medio ambiente</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">👥</span>
                    <h3>Comunidad</h3>
                    <p>Conecta con personas que comparten tu pasión por la sostenibilidad</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">📚</span>
                    <h3>Aprende</h3>
                    <p>Desarrolla nuevas habilidades en talleres y conferencias especializadas</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🎯</span>
                    <h3>Organiza</h3>
                    <p>Crea tus propios eventos y lidera el cambio en tu comunidad</p>
                </div>
            </div>
        </div>
    </div>
);

export default Home;