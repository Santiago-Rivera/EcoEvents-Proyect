import { useState } from 'react';
import { login } from '../services/authService.ts';
import type { LoginCredentials } from '../services/authService.ts';

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showDiagnostic, setShowDiagnostic] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!credentials.email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!credentials.password.trim()) {
      setError('La contraseña es requerida');
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
      const data = await login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess('¡Inicio de sesión exitoso! Bienvenido de vuelta.');
      
      // Limpiar formulario
      setCredentials({ email: '', password: '' });
      
      // Opcional: redirigir después de un breve delay
      setTimeout(() => {
        // Verificar si hay una ruta de retorno, sino ir al dashboard o home
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        window.location.href = returnUrl || '/eventos'; // Redirigir a eventos en lugar de dashboard
      }, 2000);
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const errorMessage = error instanceof Error ? error.message : 'Credenciales inválidas. Verifica tu email y contraseña.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🌱 EcoEvents</h1>
          <h2 className="login-subtitle">Iniciar Sesión</h2>
          <p className="login-description">Accede a tu cuenta para gestionar eventos ecológicos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert-error-login">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              {error.includes('conectar') && (
                <button 
                  type="button"
                  onClick={() => setShowDiagnostic(!showDiagnostic)}
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  {showDiagnostic ? 'Ocultar' : 'Mostrar'} Diagnóstico
                </button>
              )}
            </div>
          )}
          
          {success && (
            <div className="alert-success-login">
              <span className="success-icon">✅</span>
              <span>{success}</span>
            </div>
          )}
          
          <div className="form-field-container-login">
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              value={credentials.email}
              onChange={handleChange} 
              required 
              disabled={loading}
              className="input-login"
            />
          </div>
          
          <div className="form-field-container-login">
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              value={credentials.password}
              onChange={handleChange} 
              required 
              disabled={loading}
              className="input-login"
            />
          </div>
          
          <button type="submit" disabled={loading || success !== ''} className="btn-login">
            {loading ? (
              <span className="loading-content">
                <span className="loading-spinner"></span>
                Iniciando sesión...
              </span>
            ) : success ? (
              <span className="success-content">
                ✅ ¡Sesión Iniciada!
              </span>
            ) : (
              <span className="login-button-content">
                🔐 Iniciar Sesión
              </span>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-help">¿Problemas para acceder? Contacta al administrador</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
