import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="back-link">
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
