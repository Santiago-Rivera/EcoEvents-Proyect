import { useState, useEffect } from 'react';
import { getEventos } from '../services/eventService.ts';
import type { Evento } from '../services/eventService.ts';
import EventCard from '../components/EventCard';

const Eventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filtro, setFiltro] = useState<string>('');

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const data = await getEventos();
                setEventos(data);
                console.log('Eventos cargados:', data); // Para debugging
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();

        // Escuchar cuando se crea un nuevo evento
        const handleEventoCreado = (event: CustomEvent) => {
            console.log('Nuevo evento detectado:', event.detail);
            fetchEventos(); // Recargar la lista
        };

        // Escuchar cuando se actualiza un evento
        const handleEventoActualizado = (event: CustomEvent) => {
            console.log('Evento actualizado detectado:', event.detail);
            fetchEventos(); // Recargar la lista
        };

        // Escuchar cuando se elimina un evento
        const handleEventoEliminado = (event: CustomEvent) => {
            console.log('Evento eliminado detectado:', event.detail);
            fetchEventos(); // Recargar la lista
        };

        // Escuchar eventos de storage para actualizaciones en tiempo real
        const handleStorageChange = () => {
            fetchEventos();
        };
        
        window.addEventListener('eventoCreado', handleEventoCreado as EventListener);
        window.addEventListener('eventoActualizado', handleEventoActualizado as EventListener);
        window.addEventListener('eventoEliminado', handleEventoEliminado as EventListener);
        window.addEventListener('storage', handleStorageChange);
        
        // Cleanup
        return () => {
            window.removeEventListener('eventoCreado', handleEventoCreado as EventListener);
            window.removeEventListener('eventoActualizado', handleEventoActualizado as EventListener);
            window.removeEventListener('eventoEliminado', handleEventoEliminado as EventListener);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Función para refrescar la lista de eventos
    const refreshEventos = async () => {
        setLoading(true);
        try {
            const data = await getEventos();
            setEventos(data);
        } catch (error) {
            console.error('Error al refrescar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar eventos basado en el texto de búsqueda
    const eventosFiltrados = eventos.filter(evento =>
        evento.title?.toLowerCase().includes(filtro.toLowerCase()) ||
        evento.description?.toLowerCase().includes(filtro.toLowerCase()) ||
        evento.location?.toLowerCase().includes(filtro.toLowerCase())
    );

    if (loading) {
        return (
            <div className="eventos-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando eventos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="eventos-container">
            <div className="eventos-header">
                <div className="header-content">
                    <h1>🌱 Eventos Ecológicos</h1>
                    <p>Descubre y participa en eventos que hacen la diferencia para nuestro planeta</p>
                </div>
                <button 
                    className="btn btn-refresh"
                    onClick={refreshEventos}
                    title="Refrescar lista de eventos"
                >
                    🔄 Actualizar
                </button>
            </div>

            {eventos.length === 0 ? (
                <div className="no-events">
                    <div className="no-events-icon">🌿</div>
                    <h3>No hay eventos disponibles</h3>
                    <p>¡Pronto habrá nuevos eventos ecológicos! Mientras tanto, considera crear uno desde el dashboard.</p>
                </div>
            ) : (
                <>
                    <div className="eventos-controls">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar eventos por nombre, descripción o ubicación..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>
                        <div className="eventos-count">
                            <span>{eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} encontrado{eventosFiltrados.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <div className="eventos-grid">
                        {eventosFiltrados.map(evento => (
                            <EventCard key={evento.id} evento={evento} />
                        ))}
                    </div>

                    {eventosFiltrados.length === 0 && filtro && (
                        <div className="no-results">
                            <p>No se encontraron eventos que coincidan con "{filtro}"</p>
                            <button 
                                className="btn btn-clear"
                                onClick={() => setFiltro('')}
                            >
                                Mostrar todos los eventos
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Eventos;
