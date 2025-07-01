import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Evento } from '../services/eventService.ts';
import { participarEnEvento } from '../services/eventService.ts';

interface EventCardProps {
    evento: Evento;
}

const EventCard = ({ evento }: EventCardProps) => {
    const [mostrarParticipantes, setMostrarParticipantes] = useState(false);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [mostrarModalParticipacion, setMostrarModalParticipacion] = useState(false);
    
    // Estados para el formulario de participación
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        comentarios: '',
        recibirNotificaciones: false
    });
    const [enviandoRegistro, setEnviandoRegistro] = useState(false);
    
    // Formatear la fecha para mostrar
    const formatearFecha = (fechaString: string) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Verificar si el evento es próximo o pasado
    const esPasado = new Date(evento.date) < new Date();
    const participantesActuales = evento._count?.registrations || 0;
    const maxParticipantes = evento.maxParticipants || 0;
    const porcentajeOcupacion = maxParticipantes > 0 ? (participantesActuales / maxParticipantes) * 100 : 0;

    // Función para manejar participar en evento
    const handleParticipar = () => {
        setMostrarModalParticipacion(true);
    };

    // Función para manejar cambios en el formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Función para confirmar participación y enviar correo
    const handleConfirmarParticipacion = async () => {
        try {
            // Validar campos requeridos
            if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim()) {
                alert('Por favor, completa todos los campos requeridos (nombre, email y teléfono).');
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            setEnviandoRegistro(true);

            // Usar el servicio para enviar datos
            const resultado = await participarEnEvento({
                eventoId: evento.id,
                eventoTitulo: evento.title,
                eventoFecha: evento.date,
                eventoUbicacion: evento.location || '',
                participante: {
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    comentarios: formData.comentarios,
                    recibirNotificaciones: formData.recibirNotificaciones
                }
            });

            // Mostrar mensaje de éxito
            alert(`¡Registro exitoso! ${resultado.correoEnviado ? 'Se ha enviado un correo de confirmación a tu email.' : 'Participación registrada correctamente.'}`);
            
            // Limpiar formulario
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                comentarios: '',
                recibirNotificaciones: false
            });
            
            setMostrarModalParticipacion(false);
            console.log('Participación registrada:', resultado);

        } catch (error) {
            console.error('Error al enviar datos:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`Error al registrar participación: ${errorMessage}`);
        } finally {
            setEnviandoRegistro(false);
        }
    };

    // Función para ver lista de participantes
    const handleVerParticipantes = () => {
        setMostrarParticipantes(true);
    };

    // Función para compartir evento
    const handleCompartir = () => {
        const textoCompartir = `¡Únete al evento "${evento.title}"!\n📅 ${formatearFecha(evento.date)}\n📍 ${evento.location}\n\n${evento.description}`;
        const urlEvento = window.location.href;
        
        // Verificar si el navegador soporta Web Share API
        if (navigator.share) {
            navigator.share({
                title: evento.title,
                text: textoCompartir,
                url: urlEvento
            }).catch((error) => console.log('Error al compartir:', error));
        } else {
            // Fallback: mostrar opciones de redes sociales
            mostrarOpcionesCompartir(textoCompartir, urlEvento);
        }
    };

    // Función para mostrar opciones de compartir
    const mostrarOpcionesCompartir = (texto: string, url: string) => {
        const textoEncoded = encodeURIComponent(texto);
        const urlEncoded = encodeURIComponent(url);
        
        const opciones = [
            {
                nombre: 'WhatsApp',
                url: `https://wa.me/?text=${textoEncoded}%20${urlEncoded}`,
                color: '#25D366'
            },
            {
                nombre: 'Facebook',
                url: `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}&quote=${textoEncoded}`,
                color: '#1877F2'
            },
            {
                nombre: 'Twitter',
                url: `https://twitter.com/intent/tweet?text=${textoEncoded}&url=${urlEncoded}`,
                color: '#1DA1F2'
            },
            {
                nombre: 'LinkedIn',
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`,
                color: '#0A66C2'
            }
        ];

        // Crear modal de compartir
        const modalHtml = `
            <div id="share-modal" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                background: rgba(0,0,0,0.5); display: flex; align-items: center; 
                justify-content: center; z-index: 1000;
            ">
                <div style="
                    background: white; padding: 2rem; border-radius: 1rem; 
                    max-width: 400px; width: 90%;
                ">
                    <h3 style="margin: 0 0 1rem 0; text-align: center;">Compartir Evento</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${opciones.map(opcion => `
                            <a href="${opcion.url}" target="_blank" style="
                                display: flex; align-items: center; padding: 0.75rem; 
                                text-decoration: none; background: ${opcion.color}; 
                                color: white; border-radius: 0.5rem; font-weight: 500;
                            ">
                                <span style="margin-right: 0.5rem;">🔗</span>
                                Compartir en ${opcion.nombre}
                            </a>
                        `).join('')}
                    </div>
                    <button onclick="document.getElementById('share-modal').remove()" style="
                        width: 100%; margin-top: 1rem; padding: 0.75rem; 
                        background: #6b7280; color: white; border: none; 
                        border-radius: 0.5rem; cursor: pointer;
                    ">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    // Función para ver detalles
    const handleVerDetalles = () => {
        setMostrarDetalles(true);
    };

    // Lista simulada de participantes (en un caso real vendría de la API)
    const participantesSimulados = [
        { id: 1, nombre: 'María González', email: 'maria@example.com', fechaRegistro: '2025-06-20' },
        { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos@example.com', fechaRegistro: '2025-06-21' },
        { id: 3, nombre: 'Ana Martínez', email: 'ana@example.com', fechaRegistro: '2025-06-22' },
        { id: 4, nombre: 'Luis Fernández', email: 'luis@example.com', fechaRegistro: '2025-06-23' },
        { id: 5, nombre: 'Elena Torres', email: 'elena@example.com', fechaRegistro: '2025-06-24' }
    ].slice(0, participantesActuales);

    return (
        <div className={`event-card-modern ${esPasado ? 'past-event' : 'future-event'}`}>
            <div className="event-status-badge">
                {esPasado ? '✅ Completado' : '🎯 Próximo'}
            </div>
            
            <div className="event-content">
                <div className="event-header">
                    <h3 className="event-title">{evento.title}</h3>
                    <div className="event-date">
                        📅 {formatearFecha(evento.date)}
                    </div>
                </div>

                <div className="event-description">
                    <p>{evento.description}</p>
                </div>

                <div className="event-details">
                    <div className="event-location">
                        <span className="detail-icon">📍</span>
                        <span>{evento.location}</span>
                    </div>

                    {maxParticipantes > 0 && (
                        <div className="event-capacity">
                            <span className="detail-icon">👥</span>
                            <span>{participantesActuales}/{maxParticipantes} participantes</span>
                            <div className="capacity-bar">
                                <div 
                                    className="capacity-fill"
                                    style={{ width: `${Math.min(porcentajeOcupacion, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {evento.creator && (
                        <div className="event-organizer">
                            <span className="detail-icon">👤</span>
                            <span>Organizado por: {evento.creator.name}</span>
                        </div>
                    )}
                </div>

                <div className="event-actions">
                    {!esPasado && (
                        <>
                            <button className="btn btn-join" onClick={handleParticipar}>
                                👥 Participar
                            </button>
                            <button className="btn btn-share" onClick={handleCompartir}>
                                🔗 Compartir
                            </button>
                        </>
                    )}
                    <button className="btn btn-details" onClick={handleVerDetalles}>
                        👁️ Ver Detalles
                    </button>
                </div>
            </div>

            {/* Modal de Participantes - Renderizado fuera del componente */}
            {mostrarParticipantes && createPortal(
                <div className="modal-overlay modal-outside" onClick={() => setMostrarParticipantes(false)}>
                    <div className="modal-content participants-modal-outside" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-outside">
                            <h3>👥 Participantes del Evento</h3>
                            <button className="btn-close-outside" onClick={() => setMostrarParticipantes(false)}>✖️</button>
                        </div>
                        <div className="modal-body-outside">
                            <div className="participants-outside">
                                <div className="event-info-summary">
                                    <h4>{evento.title}</h4>
                                    <p>📅 {formatearFecha(evento.date)}</p>
                                    <p>📍 {evento.location}</p>
                                </div>

                                <div className="participants-stats-outside">
                                    <div className="stats-card">
                                        <div className="stat-number">{participantesActuales}</div>
                                        <div className="stat-label">Participantes Registrados</div>
                                    </div>
                                    <div className="stats-card">
                                        <div className="stat-number">{maxParticipantes - participantesActuales}</div>
                                        <div className="stat-label">Lugares Disponibles</div>
                                    </div>
                                    <div className="stats-card">
                                        <div className="stat-number">{maxParticipantes}</div>
                                        <div className="stat-label">Capacidad Total</div>
                                    </div>
                                </div>

                                <div className="capacity-section">
                                    <h4>📊 Ocupación del Evento</h4>
                                    <div className="capacity-bar-large">
                                        <div 
                                            className="capacity-fill-large"
                                            style={{ width: `${Math.min(porcentajeOcupacion, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="capacity-info">
                                        <span>{Math.round(porcentajeOcupacion)}% ocupado</span>
                                        <span>{maxParticipantes - participantesActuales} lugares libres</span>
                                    </div>
                                </div>
                                
                                {participantesActuales > 0 ? (
                                    <div className="participants-list-outside">
                                        <h4>📋 Lista de Participantes Registrados</h4>
                                        <div className="participants-grid">
                                            {participantesSimulados.map((participante) => (
                                                <div key={participante.id} className="participant-card">
                                                    <div className="participant-avatar">
                                                        👤
                                                    </div>
                                                    <div className="participant-info">
                                                        <h5>{participante.nombre}</h5>
                                                        <p className="participant-email">{participante.email}</p>
                                                        <span className="participant-date">
                                                            Registrado: {new Date(participante.fechaRegistro).toLocaleDateString('es-ES')}
                                                        </span>
                                                    </div>
                                                    <div className="participant-status">
                                                        ✅ Confirmado
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-participants-outside">
                                        <div className="empty-state">
                                            <div className="empty-icon">👥</div>
                                            <h4>Aún no hay participantes registrados</h4>
                                            <p>¡Sé el primero en participar en este increíble evento!</p>
                                            {!esPasado && (
                                                <button className="btn-join-now" onClick={() => {
                                                    setMostrarParticipantes(false);
                                                    handleParticipar();
                                                }}>
                                                    🎯 Participar Ahora
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer-outside">
                            {!esPasado && participantesActuales < maxParticipantes && (
                                <button className="btn-participate-outside" onClick={() => {
                                    setMostrarParticipantes(false);
                                    handleParticipar();
                                }}>
                                    👥 Unirme al Evento
                                </button>
                            )}
                            <button className="btn-share-outside" onClick={handleCompartir}>
                                🔗 Compartir Evento
                            </button>
                            <button className="btn-details-outside" onClick={() => {
                                setMostrarParticipantes(false);
                                setMostrarDetalles(true);
                            }}>
                                📋 Ver Detalles
                            </button>
                            <button className="btn-cancel-outside" onClick={() => setMostrarParticipantes(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal de Participación - Renderizado fuera del componente */}
            {mostrarModalParticipacion && createPortal(
                <div className="modal-overlay modal-outside" onClick={() => setMostrarModalParticipacion(false)}>
                    <div className="modal-content participation-modal-outside" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-outside">
                            <h3>🎯 Participar en {evento.title}</h3>
                            <button className="btn-close-outside" onClick={() => setMostrarModalParticipacion(false)}>✖️</button>
                        </div>
                        <div className="modal-body-outside">
                            <div className="participation-outside">
                                <div className="event-info-card">
                                    <div className="event-info-header">
                                        <h4>📅 {formatearFecha(evento.date)}</h4>
                                        <p>📍 {evento.location}</p>
                                        <p>👥 {maxParticipantes - participantesActuales} lugares disponibles de {maxParticipantes}</p>
                                    </div>
                                </div>

                                <div className="success-message">
                                    <h4>✅ ¡Lugares Disponibles!</h4>
                                    <p>Únete a este increíble evento. Solo necesitamos algunos datos para completar tu registro.</p>
                                </div>
                                
                                <div className="registration-form-outside">
                                    <h4>Formulario de Registro</h4>
                                    
                                    <div className="form-field-container">
                                        <input 
                                            type="text" 
                                            name="nombre"
                                            placeholder="Tu nombre completo" 
                                            className="input-outside"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-field-container">
                                        <input 
                                            type="email" 
                                            name="email"
                                            placeholder="Tu correo electrónico" 
                                            className="input-outside"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-field-container">
                                        <input 
                                            type="tel" 
                                            name="telefono"
                                            placeholder="Tu teléfono celular" 
                                            className="input-outside"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-field-container">
                                        <textarea 
                                            name="comentarios"
                                            placeholder="¿Tienes alguna pregunta o comentario? (opcional)"
                                            className="textarea-outside"
                                            value={formData.comentarios}
                                            onChange={handleInputChange}
                                            rows={3}
                                        ></textarea>
                                    </div>
                                    
                                    <div className="checkbox-outside">
                                        <input 
                                            type="checkbox" 
                                            id="notifications-outside" 
                                            name="recibirNotificaciones"
                                            checked={formData.recibirNotificaciones}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="notifications-outside">
                                            Quiero recibir recordatorios y actualizaciones sobre este evento
                                        </label>
                                    </div>
                                </div>

                                <div className="benefits-section">
                                    <h4>🌟 ¿Qué incluye tu participación?</h4>
                                    <ul>
                                        <li>✅ Acceso completo al evento</li>
                                        <li>✅ Materiales y recursos digitales</li>
                                        <li>✅ Certificado de participación</li>
                                        <li>✅ Networking con otros participantes</li>
                                        <li>✅ Recordatorios automáticos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-outside">
                            <button 
                                className="btn-confirm-outside" 
                                onClick={handleConfirmarParticipacion}
                                disabled={enviandoRegistro}
                            >
                                {enviandoRegistro ? '📤 Enviando...' : '🎯 Confirmar Participación'}
                            </button>
                            <button className="btn-participants-outside" onClick={handleVerParticipantes}>
                                👥 Ver Quién Participa
                            </button>
                            <button className="btn-cancel-outside" onClick={() => setMostrarModalParticipacion(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal de Detalles - Renderizado fuera del componente */}
            {mostrarDetalles && createPortal(
                <div className="modal-overlay modal-outside" onClick={() => setMostrarDetalles(false)}>
                    <div className="modal-content details-modal-outside" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-outside">
                            <h3>📋 Detalles del Evento</h3>
                            <button className="btn-close-outside" onClick={() => setMostrarDetalles(false)}>✖️</button>
                        </div>
                        <div className="modal-body-outside">
                            <div className="details-outside">
                                <div className="event-title-card">
                                    <h2>{evento.title}</h2>
                                    <span className={`status-badge-large ${esPasado ? 'completed' : 'active'}`}>
                                        {esPasado ? '✅ Evento Completado' : '🎯 Evento Próximo'}
                                    </span>
                                </div>

                                <div className="details-grid">
                                    <div className="detail-card">
                                        <div className="detail-icon">�</div>
                                        <div className="detail-content">
                                            <h4>Fecha y Hora</h4>
                                            <p>{formatearFecha(evento.date)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-card">
                                        <div className="detail-icon">📍</div>
                                        <div className="detail-content">
                                            <h4>Ubicación</h4>
                                            <p>{evento.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-card">
                                        <div className="detail-icon">👥</div>
                                        <div className="detail-content">
                                            <h4>Participación</h4>
                                            <p>{participantesActuales} de {maxParticipantes} participantes registrados</p>
                                            <div className="capacity-bar-outside">
                                                <div 
                                                    className="capacity-fill-outside"
                                                    style={{ width: `${Math.min(porcentajeOcupacion, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="capacity-text">
                                                {maxParticipantes - participantesActuales} lugares disponibles ({Math.round(porcentajeOcupacion)}% ocupado)
                                            </span>
                                        </div>
                                    </div>

                                    {evento.creator && (
                                        <div className="detail-card">
                                            <div className="detail-icon">👤</div>
                                            <div className="detail-content">
                                                <h4>Organizador</h4>
                                                <p>{evento.creator.name}</p>
                                                <span className="organizer-email-outside">{evento.creator.email}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="detail-card">
                                        <div className="detail-icon">⏰</div>
                                        <div className="detail-content">
                                            <h4>Estado del Evento</h4>
                                            <p>{esPasado ? 'Este evento ya ha finalizado' : 'Evento programado y activo'}</p>
                                            <span className="capacity-text">
                                                {esPasado ? 'Revisa los participantes que asistieron' : 'Aún puedes registrarte para participar'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detail-card">
                                        <div className="detail-icon">🎯</div>
                                        <div className="detail-content">
                                            <h4>Disponibilidad</h4>
                                            <p>{esPasado ? 'Evento finalizado' : maxParticipantes - participantesActuales > 0 ? 'Lugares disponibles' : 'Evento completo'}</p>
                                            <span className="capacity-text">
                                                {esPasado ? 'No se aceptan más registros' : maxParticipantes - participantesActuales > 0 ? `${maxParticipantes - participantesActuales} cupos libres` : 'Lista de espera disponible'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {evento.description && (
                                    <div className="description-card">
                                        <h4>📝 Descripción del Evento</h4>
                                        <p>{evento.description}</p>
                                    </div>
                                )}

                                <div className="event-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">📊 Estado</span>
                                        <span className={`stat-value ${esPasado ? 'completed' : 'active'}`}>
                                            {esPasado ? 'Completado' : 'Próximo'}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">👥 Registrados</span>
                                        <span className="stat-value">
                                            {participantesActuales} personas
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">📍 Modalidad</span>
                                        <span className="stat-value">
                                            {evento.location?.toLowerCase().includes('virtual') || evento.location?.toLowerCase().includes('online') ? 'Virtual' : 'Presencial'}
                                        </span>
                                    </div>
                                    {evento.createdAt && (
                                        <div className="stat-item">
                                            <span className="stat-label">📅 Creado</span>
                                            <span className="stat-value">
                                                {new Date(evento.createdAt).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-outside">
                            {!esPasado && (
                                <button className="btn-participate-outside" onClick={() => {
                                    setMostrarDetalles(false);
                                    handleParticipar();
                                }}>
                                    👥 Participar en Evento
                                </button>
                            )}
                            <button className="btn-share-outside" onClick={handleCompartir}>
                                🔗 Compartir Evento
                            </button>
                            <button className="btn-participants-outside" onClick={() => {
                                setMostrarDetalles(false);
                                handleVerParticipantes();
                            }}>
                                👥 Ver Participantes
                            </button>
                            <button className="btn-cancel-outside" onClick={() => setMostrarDetalles(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default EventCard;

