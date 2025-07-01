import { useState, useEffect } from 'react';
import EventForm from '../components/EventForm';
import { createEvento, getEventos, deleteEvento, updateEvento } from '../services/eventService.ts';
import type { Evento } from '../services/eventService.ts';
import { dashboardData } from '../utils/dashboardData';

// Tipo para los datos del formulario (sin id)
type EventoFormData = {
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  maxParticipantes?: number;
};

// Componente para métricas
const MetricCard = ({ title, value, percentage, trend, icon, color }: {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}) => (
  <div className="metric-card">
    <div className="metric-header">
      <span className={`metric-icon metric-icon-${color.replace('#', '')}`}>{icon}</span>
      <span className={`metric-trend ${trend}`}>
        {trend === 'up' ? '↗' : '↘'} {percentage}
      </span>
    </div>
    <div className="metric-content">
      <h3 className="metric-value">{value}</h3>
      <p className="metric-title">{title}</p>
    </div>
  </div>
);

// Componente para gráfico circular simulado
const CircularChart = ({ percentage, label, color }: {
  percentage: number;
  label: string;
  color: string;
}) => (
  <div className="circular-chart">
    <div className="chart-container">
      <svg viewBox="0 0 36 36" className="circular-svg">
        <path
          className="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="circle"
          strokeDasharray={`${percentage}, 100`}
          stroke={color}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="chart-percentage">{percentage}%</div>
    </div>
    <p className="chart-label">{label}</p>
  </div>
);

// Componente para tabla de eventos recientes
const EventTable = ({ 
  eventos, 
  onEdit, 
  onView, 
  onDelete 
}: { 
  eventos: Evento[];
  onEdit: (evento: Evento) => void;
  onView: (evento: Evento) => void;
  onDelete: (evento: Evento) => void;
}) => (
  <div className="event-table-container">
    <h3>Eventos Recientes</h3>
    <div className="table-wrapper">
      <table className="event-table">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Fecha</th>
            <th>Participantes</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.slice(0, 5).map((evento) => (
            <tr key={evento.id}>
              <td>
                <div className="event-info">
                  <span className="event-name">{evento.title}</span>
                  <span className="event-location">{evento.location}</span>
                </div>
              </td>
              <td>{new Date(evento.date).toLocaleDateString()}</td>
              <td>
                <span className="participant-count">{evento.maxParticipants}</span>
              </td>
              <td>
                <span className={`status-badge ${evento.date > new Date().toISOString() ? 'active' : 'expired'}`}>
                  {evento.date > new Date().toISOString() ? 'Próximo' : 'Vencido'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  {evento.date > new Date().toISOString() ? (
                    <>
                      <button 
                        className="btn-action edit" 
                        onClick={() => onEdit(evento)}
                        title="Editar evento"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action view" 
                        onClick={() => onView(evento)}
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action delete" 
                        onClick={() => onDelete(evento)}
                        title="Eliminar evento"
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn-action view" 
                        onClick={() => onView(evento)}
                        title="Ver detalles del evento vencido"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-action delete expired" 
                        onClick={() => onDelete(evento)}
                        title="Eliminar evento vencido"
                      >
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Componente para notificaciones
const NotificationPanel = () => (
  <div className="notification-panel">
    <h3>Notificaciones Recientes</h3>
    <div className="notifications-list">
      {dashboardData.recentNotifications.map((notification) => (
        <div key={notification.id} className="notification-item">
          <span className="notification-icon">{notification.icon}</span>
          <div className="notification-content">
            <p className="notification-message">{notification.message}</p>
            <span className="notification-time">{notification.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Componente para eventos top
const TopEvents = () => (
  <div className="top-events">
    <h3>Eventos Más Populares</h3>
    <div className="events-list">
      {dashboardData.topEvents.map((event) => (
        <div key={event.id} className="event-item">
          <div className="event-details">
            <h4>{event.name}</h4>
            <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div className="event-progress">
            <div className="progress-info">
              <span>{event.participants}/{event.maxParticipants}</span>
              <span className={`event-status ${event.status}`}>
                {event.status === 'active' ? 'Disponible' : 
                 event.status === 'full' ? 'Lleno' : 'Completado'}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${event.status === 'full' ? 'full' : 'active'}`}
                data-width={((event.participants / event.maxParticipants) * 100)}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardOrganizador = () => {
  const [mensaje, setMensaje] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Evento | null>(null);

  const fetchEventos = async () => {
    try {
      const eventosData = await getEventos();
      
      // Separar eventos activos y vencidos
      const now = new Date();
      const eventosActivos: Evento[] = [];
      const eventosVencidos: Evento[] = [];
      
      eventosData.forEach(evento => {
        const fechaEvento = new Date(evento.date);
        if (fechaEvento < now) {
          eventosVencidos.push(evento);
        } else {
          eventosActivos.push(evento);
        }
      });
      
      // Si hay eventos vencidos, mostrar notificación y permitir eliminarlos
      if (eventosVencidos.length > 0) {
        const eventosVencidosNombres = eventosVencidos.map(e => e.title).join(', ');
        const confirmarEliminacion = window.confirm(
          `Se encontraron ${eventosVencidos.length} evento(s) que ya pasaron su fecha:\n\n${eventosVencidosNombres}\n\n¿Deseas eliminarlos automáticamente?`
        );
        
        if (confirmarEliminacion) {
          await eliminarEventosVencidos(eventosVencidos);
          // Solo mostrar eventos activos después de la eliminación
          setEventos(eventosActivos);
        } else {
          // Mostrar todos los eventos (incluyendo vencidos) si el usuario no quiere eliminarlos
          setEventos(eventosData);
        }
      } else {
        setEventos(eventosData);
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  // Función para eliminar eventos vencidos
  const eliminarEventosVencidos = async (eventosVencidos: Evento[]) => {
    try {
      console.log('🗑️ Dashboard: Eliminando eventos vencidos automáticamente...');
      setLoading(true);
      
      const promesasEliminacion = eventosVencidos.map(evento => 
        deleteEvento(evento.id).catch(error => {
          console.error(`Error al eliminar evento ${evento.title}:`, error);
          return null;
        })
      );
      
      await Promise.all(promesasEliminacion);
      
      const eventosEliminadosNombres = eventosVencidos.map(e => e.title).join(', ');
      setMensaje(`✅ Se eliminaron ${eventosVencidos.length} evento(s) vencido(s): ${eventosEliminadosNombres}`);
      
      // Disparar evento personalizado para actualizar otras páginas
      window.dispatchEvent(new CustomEvent('eventosVencidosEliminados', { 
        detail: { eventos: eventosVencidos, count: eventosVencidos.length }
      }));
      
      setTimeout(() => setMensaje(''), 5000);
      
    } catch (error) {
      console.error('❌ Dashboard: Error al eliminar eventos vencidos:', error);
      setMensaje('❌ Error al eliminar algunos eventos vencidos. Inténtalo manualmente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCrearEvento = async (datos: EventoFormData) => {
    console.log('🔄 Dashboard: Iniciando creación de evento con datos:', datos);
    setLoading(true);
    setMensaje('');
    
    try {
      console.log('📤 Dashboard: Enviando datos al servidor...');
      const nuevoEvento = await createEvento(datos);
      console.log('✅ Dashboard: Evento creado exitosamente:', nuevoEvento);
      
      setMensaje(`¡Evento "${nuevoEvento.title}" creado exitosamente! Ya está disponible en la lista de eventos.`);
      
      // Solo refrescar la lista desde el servidor (no agregar manualmente para evitar duplicados)
      console.log('🔄 Dashboard: Refrescando eventos desde el servidor...');
      await fetchEventos();
      
      // Disparar evento personalizado para que otras páginas se actualicen
      window.dispatchEvent(new CustomEvent('eventoCreado', { 
        detail: nuevoEvento 
      }));
      
      // Volver al dashboard después de 3 segundos
      setTimeout(() => {
        setShowEventForm(false);
        setMensaje('');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Dashboard: Error al crear evento:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMensaje(`Error al crear el evento: ${errorMessage}. Por favor, verifica que el servidor esté funcionando.`);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la edición de eventos
  const handleEditarEvento = async (evento: Evento) => {
    console.log('📝 Dashboard: Iniciando edición de evento:', evento.id);
    setEditingEvent(evento);
    setShowEventForm(true);
  };

  // Función para manejar la visualización de detalles
  const handleVerEvento = (evento: Evento) => {
    console.log('👁️ Dashboard: Viendo detalles del evento:', evento.id);
    setViewingEvent(evento);
  };

  // Función para manejar la eliminación de eventos
  const handleEliminarEvento = async (evento: Evento) => {
    console.log('🗑️ Dashboard: Iniciando eliminación de evento:', evento.id);
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el evento "${evento.title}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmed) {
      console.log('❌ Dashboard: Eliminación cancelada por el usuario');
      return;
    }

    setLoading(true);
    setMensaje('');
    
    try {
      console.log('🗑️ Dashboard: Eliminando evento del servidor...');
      await deleteEvento(evento.id);
      
      setMensaje(`Evento "${evento.title}" eliminado exitosamente.`);
      
      // Refrescar la lista de eventos
      console.log('🔄 Dashboard: Refrescando eventos después de eliminar...');
      await fetchEventos();
      
      // Disparar evento personalizado para que otras páginas se actualicen
      window.dispatchEvent(new CustomEvent('eventoEliminado', { 
        detail: { id: evento.id, title: evento.title }
      }));
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje('');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Dashboard: Error al eliminar evento:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMensaje(`Error al eliminar el evento: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar el modal
  const handleCerrarModal = () => {
    setViewingEvent(null);
  };

  // Función para manejar la actualización de eventos
  const handleActualizarEvento = async (datos: EventoFormData) => {
    if (!editingEvent) return;
    
    console.log('📝 Dashboard: Actualizando evento:', editingEvent.id, 'con datos:', datos);
    setLoading(true);
    setMensaje('');
    
    try {
      console.log('📤 Dashboard: Enviando actualización al servidor...');
      const eventoActualizado = await updateEvento(editingEvent.id, datos);
      console.log('✅ Dashboard: Evento actualizado exitosamente:', eventoActualizado);
      
      setMensaje(`¡Evento "${eventoActualizado.title}" actualizado exitosamente!`);
      
      // Refrescar la lista de eventos
      console.log('🔄 Dashboard: Refrescando eventos después de actualizar...');
      await fetchEventos();
      
      // Disparar evento personalizado para que otras páginas se actualicen
      window.dispatchEvent(new CustomEvent('eventoActualizado', { 
        detail: eventoActualizado 
      }));
      
      // Limpiar estado de edición y volver al dashboard
      setEditingEvent(null);
      setTimeout(() => {
        setShowEventForm(false);
        setMensaje('');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Dashboard: Error al actualizar evento:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMensaje(`Error al actualizar el evento: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar edición
  const handleCancelarEdicion = () => {
    setEditingEvent(null);
    setShowEventForm(false);
  };

  // Calcular métricas
  const totalEventos = eventos.length;
  const eventosActivos = eventos.filter(e => e.date > new Date().toISOString()).length;
  const eventosVencidos = eventos.filter(e => e.date <= new Date().toISOString()).length;
  const totalParticipantes = eventos.reduce((sum, e) => sum + (e.maxParticipants ?? 0), 0);
  const promedioParticipantes = totalEventos > 0 ? Math.round(totalParticipantes / totalEventos) : 0;

  // Función para limpiar todos los eventos vencidos manualmente
  const handleLimpiarEventosVencidos = async () => {
    const eventosVencidosArray = eventos.filter(e => e.date <= new Date().toISOString());
    
    if (eventosVencidosArray.length === 0) {
      alert('No hay eventos vencidos para eliminar.');
      return;
    }
    
    const confirmar = window.confirm(
      `¿Estás seguro de que quieres eliminar todos los ${eventosVencidosArray.length} eventos vencidos?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmar) {
      await eliminarEventosVencidos(eventosVencidosArray);
      await fetchEventos(); // Recargar eventos después de la eliminación
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Control</h1>
          <p>Gestiona tus eventos ecológicos y visualiza estadísticas en tiempo real</p>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowEventForm(!showEventForm)}
          >
            {showEventForm ? '← Volver al Dashboard' : '+ Nuevo Evento'}
          </button>
          {eventosVencidos > 0 && (
            <button 
              className="btn btn-warning"
              onClick={handleLimpiarEventosVencidos}
              title={`Eliminar ${eventosVencidos} evento(s) vencido(s)`}
            >
              🗑️ Limpiar Vencidos ({eventosVencidos})
            </button>
          )}
        </div>
      </div>

      {showEventForm ? (
        <div className="event-form-section">
          <div className="form-container">
            <h2>{editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
            <EventForm 
              onSubmit={editingEvent ? handleActualizarEvento : handleCrearEvento}
              initialEvent={editingEvent}
              isEditing={!!editingEvent}
              onCancel={handleCancelarEdicion}
            />
            {loading && <p className="loading-message">{editingEvent ? 'Actualizando evento...' : 'Creando evento...'}</p>}
            {mensaje && (
              <p className={mensaje.includes('Error') ? 'error-message' : 'success-message'}>
                {mensaje}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Métricas principales */}
          <div className="metrics-grid">
            <MetricCard
              title="Total Eventos"
              value={totalEventos.toString()}
              percentage="12%"
              trend="up"
              icon="📅"
              color="#4ade80"
            />
            <MetricCard
              title="Eventos Activos"
              value={eventosActivos.toString()}
              percentage="8%"
              trend="up"
              icon="🎯"
              color="#06b6d4"
            />
            <MetricCard
              title="Total Participantes"
              value={totalParticipantes.toString()}
              percentage="25%"
              trend="up"
              icon="👥"
              color="#8b5cf6"
            />
            <MetricCard
              title="Promedio por Evento"
              value={promedioParticipantes.toString()}
              percentage="5%"
              trend="down"
              icon="📊"
              color="#f59e0b"
            />
          </div>

          {/* Gráficos y estadísticas */}
          <div className="charts-section">
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Distribución de Eventos</h3>
                <div className="circular-charts">
                  <CircularChart
                    percentage={Math.round((eventosActivos / Math.max(totalEventos, 1)) * 100)}
                    label="Eventos Activos"
                    color="#4ade80"
                  />
                  <CircularChart
                    percentage={Math.round(((totalEventos - eventosActivos) / Math.max(totalEventos, 1)) * 100)}
                    label="Eventos Completados"
                    color="#06b6d4"
                  />
                  <CircularChart
                    percentage={75}
                    label="Participación"
                    color="#8b5cf6"
                  />
                </div>
              </div>

              <div className="chart-card">
                <h3>Actividad Reciente</h3>
                <div className="activity-chart">
                  <div className="activity-bars">
                    {[40, 60, 35, 80, 55, 70, 45].map((height, index) => (
                      <div key={index} className="activity-bar">
                        <div 
                          className="bar-fill"
                          style={{ '--bar-height': `${height}%` } as React.CSSProperties}
                        ></div>
                        <span className="bar-label">
                          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de eventos */}
          <div className="table-section">
            <EventTable 
              eventos={eventos} 
              onEdit={handleEditarEvento} 
              onView={handleVerEvento} 
              onDelete={handleEliminarEvento} 
            />
          </div>

          {/* Acciones rápidas */}
          <div className="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div className="actions-grid">
              <button className="action-card">
                <span className="action-icon">📧</span>
                <div className="action-content">
                  <h4>Enviar Notificaciones</h4>
                  <p>Notificar a participantes sobre próximos eventos</p>
                </div>
              </button>
              <button className="action-card">
                <span className="action-icon">📊</span>
                <div className="action-content">
                  <h4>Generar Reporte</h4>
                  <p>Crear reporte de actividades del mes</p>
                </div>
              </button>
              <button className="action-card">
                <span className="action-icon">🌱</span>
                <div className="action-content">
                  <h4>Impacto Ambiental</h4>
                  <p>Ver métricas de impacto ecológico</p>
                </div>
              </button>
            </div>
          </div>

          {/* Nueva sección de información adicional */}
          <div className="info-section">
            <div className="info-grid">
              <NotificationPanel />
              <TopEvents />
            </div>
          </div>
        </>
      )}

      {/* Modal para ver detalles del evento */}
      {viewingEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{viewingEvent.title}</h2>
              <button className="btn-close" onClick={handleCerrarModal}>✖️</button>
            </div>
            <div className="modal-body">
              <p><strong>Descripción:</strong> {viewingEvent.description}</p>
              <p><strong>Fecha:</strong> {new Date(viewingEvent.date).toLocaleString()}</p>
              <p><strong>Ubicación:</strong> {viewingEvent.location}</p>
              <p><strong>Participantes Máx:</strong> {viewingEvent.maxParticipants}</p>
              <p><strong>Estado:</strong> {viewingEvent.date > new Date().toISOString() ? 'Próximo' : 'Completado'}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => handleEditarEvento(viewingEvent)}>Editar Evento</button>
              <button className="btn btn-secondary" onClick={handleCerrarModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOrganizador;
