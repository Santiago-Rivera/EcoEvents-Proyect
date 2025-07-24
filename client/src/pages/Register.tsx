import { useState } from 'react';
import { register } from '../services/authService.ts';
import type { RegisterData } from '../services/authService.ts';

const Register = () => {
  const [userData, setUserData] = useState<RegisterData>({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!userData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!userData.email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!userData.password.trim()) {
      setError('La contraseña es requerida');
      return false;
    }
    if (userData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('¡Registro exitoso! Bienvenido a EcoEvents.');
      
      // Limpiar formulario
      setUserData({ name: '', email: '', password: '' });
      
      // Opcional: redirigir después de un breve delay
      setTimeout(() => {
        window.location.href = '/eventos'; // Redirigir a la página de eventos después del registro
      }, 2000);
      
    } catch (error) {
      console.error('Error al registrarse:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al registrarse';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">🌱 EcoEvents</h1>
          <h2 className="register-subtitle">Crear Cuenta</h2>
          <p className="register-description">Únete a nuestra comunidad y crea eventos que marquen la diferencia</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="alert-error-register">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert-success-register">
              <span className="success-icon">✅</span>
              <span>{success}</span>
            </div>
          )}
          
          <div className="form-field-container-register">
            <input 
              name="name" 
              type="text" 
              placeholder="Nombre completo" 
              value={userData.name}
              onChange={handleChange} 
              required 
              disabled={loading}
              className="input-register"
            />
          </div>
          
          <div className="form-field-container-register">
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              value={userData.email}
              onChange={handleChange} 
              required 
              disabled={loading}
              className="input-register"
            />
          </div>
          
          <div className="form-field-container-register">
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña (mínimo 6 caracteres)" 
              value={userData.password}
              onChange={handleChange} 
              required 
              disabled={loading}
              className="input-register"
              minLength={6}
            />
          </div>
          
          <button type="submit" disabled={loading || success !== ''} className="btn-register">
            {loading ? (
              <span className="loading-content">
                <span className="loading-spinner"></span>
                Registrando...
              </span>
            ) : success ? (
              <span className="success-content">
                ✅ ¡Registro Exitoso!
              </span>
            ) : (
              <span className="register-button-content">
                ✨ Crear mi Cuenta
              </span>
            )}
          </button>
        </form>
        
        <div className="register-benefits">
          <h4>¿Por qué unirte a EcoEvents?</h4>
          <ul>
            <li>🌍 Crea eventos con impacto ambiental</li>
            <li>🤝 Conecta con una comunidad ecológica</li>
            <li>📊 Gestiona y organiza tus eventos</li>
            <li>🎯 Promueve la sostenibilidad</li>
          </ul>
        </div>
        
        <div className="register-footer">
          <p className="register-help">Al registrarte, aceptas nuestros términos de uso y política de privacidad</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
