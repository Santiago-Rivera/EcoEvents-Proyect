import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Por favor selecciona un asunto');
      return false;
    }
    if (!formData.message.trim()) {
      setError('El mensaje es requerido');
      return false;
    }
    if (formData.message.trim().length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres');
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
      // Simular envío del formulario (aquí puedes integrar con tu backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos una respuesta exitosa
      console.log('Mensaje enviado:', formData);
      
      setSuccess('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-container">
      
      <section className="contact-section">
        <h2>📞 ¿Cómo Contactarnos?</h2>
        <p>
          ¿Tienes alguna pregunta, sugerencia o quieres organizar un evento? 
          ¡Nos encantaría saber de ti!
        </p>
      </section>

      <div className="contact-grid">
        <section className="contact-info">
          <h2>📧 Información de Contacto</h2>
          <div className="contact-item">
            <h3>Email Principal</h3>
            <p>📬 contacto@ecoeventos.com</p>
          </div>
          
          <div className="contact-item">
            <h3>Organizadores</h3>
            <p>🌱 organizadores@ecoeventos.com</p>
          </div>
          
          <div className="contact-item">
            <h3>Soporte Técnico</h3>
            <p>🛠️ soporte@ecoeventos.com</p>
          </div>
          
          <div className="contact-item">
            <h3>Teléfono</h3>
            <p>📱 +1 (555) 123-4567</p>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>✉️ Envíanos un Mensaje</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            {error && (
              <div className="alert-error-contact">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="alert-success-contact">
                <span className="success-icon">✅</span>
                <span>{success}</span>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Asunto *</label>
              <select 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Selecciona un tema</option>
                <option value="evento">Organizar un evento</option>
                <option value="participar">Quiero participar</option>
                <option value="sugerencia">Sugerencia</option>
                <option value="soporte">Soporte técnico</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mensaje *</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5}
                placeholder="Cuéntanos en qué podemos ayudarte... (mínimo 10 caracteres)"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading || success !== ''}>
              {loading ? (
                <span className="loading-content">
                  <span className="loading-spinner"></span>
                  Enviando mensaje...
                </span>
              ) : success ? (
                <span className="success-content">
                  ✅ ¡Mensaje Enviado!
                </span>
              ) : (
                <span className="submit-button-content">
                  📨 Enviar Mensaje
                </span>
              )}
            </button>
          </form>
        </section>
      </div>

      <section className="faq-section">
        <h2>❓ Preguntas Frecuentes</h2>
        
        <div className="faq-item">
          <h3>¿Cómo puedo organizar mi propio evento?</h3>
          <p>
            Simplemente regístrate en nuestra plataforma y ve al Dashboard. 
            Ahí podrás crear y gestionar tus eventos ecológicos.
          </p>
        </div>
        
        <div className="faq-item">
          <h3>¿Los eventos son gratuitos?</h3>
          <p>
            La mayoría de nuestros eventos son gratuitos. Cuando hay algún costo, 
            se indica claramente en la descripción del evento.
          </p>
        </div>
        
        <div className="faq-item">
          <h3>¿Qué necesito llevar a los eventos?</h3>
          <p>
            Cada evento especifica qué materiales son necesarios. Generalmente 
            proporcionamos las herramientas principales, pero te pedimos que traigas 
            agua, protector solar y ganas de ayudar al planeta.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
