import { useState, useEffect } from 'react';
import { createEvento, type EventoFormData, type Evento } from '../services/eventService';

interface EventFormProps {
    onSubmit?: (formData: EventoFormData) => void;
    onEventCreated?: () => void;
    initialEvent?: Evento | null;
    isEditing?: boolean;
    onCancel?: () => void;
}

const EventForm = ({ onSubmit, onEventCreated, initialEvent, isEditing = false, onCancel }: EventFormProps) => {
    const [formData, setFormData] = useState<EventoFormData>({
        nombre: '',
        descripcion: '',
        fecha: '',
        ubicacion: '',
        maxParticipantes: 50
    });

    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos del evento cuando estamos editando
    useEffect(() => {
        if (initialEvent && isEditing) {
            // Convertir del formato del evento al formato del formulario
            setFormData({
                nombre: initialEvent.title,
                descripcion: initialEvent.description || '',
                fecha: new Date(initialEvent.date).toISOString().slice(0, 16),
                ubicacion: initialEvent.location || '',
                maxParticipantes: initialEvent.maxParticipants || 50
            });
        }
    }, [initialEvent, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'maxParticipantes' ? parseInt(value) || 0 : value 
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validar que todos los campos estén llenos
        if (!formData.nombre.trim() || !formData.descripcion.trim() || 
            !formData.fecha || !formData.ubicacion.trim() || (formData.maxParticipantes && formData.maxParticipantes <= 0)) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        console.log(`📋 EventForm: Datos del formulario validados para ${isEditing ? 'edición' : 'creación'}:`, formData);

        // Si hay una función onSubmit, delegamos la creación/edición al componente padre (Dashboard)
        if (onSubmit) {
            console.log(`📤 EventForm: Enviando datos al Dashboard para ${isEditing ? 'actualización' : 'creación'}...`);
            try {
                await onSubmit(formData);
                
                // Limpiar formulario después de enviar exitosamente (solo si no estamos editando)
                if (!isEditing) {
                    setFormData({
                        nombre: '',
                        descripcion: '',
                        fecha: '',
                        ubicacion: '',
                        maxParticipantes: 50
                    });
                }
                
                if (onEventCreated) {
                    onEventCreated();
                }
            } catch (error) {
                console.error('❌ EventForm: Error recibido del Dashboard:', error);
                // El Dashboard ya maneja el error y muestra el mensaje
                // No necesitamos mostrar otro alert aquí
            }
        } else {
            // Si no hay onSubmit, manejar la creación directamente (fallback)
            try {
                setIsLoading(true);
                
                console.log('📤 EventForm: Creando evento directamente...');
                const eventoCreado = await createEvento(formData);
                
                console.log('✅ EventForm: Evento creado exitosamente:', eventoCreado);
                
                // Limpiar formulario después de enviar
                setFormData({
                    nombre: '',
                    descripcion: '',
                    fecha: '',
                    ubicacion: '',
                    maxParticipantes: 50
                });

                alert('¡Evento creado exitosamente!');
                
                if (onEventCreated) {
                    onEventCreated();
                }
                
            } catch (error) {
                console.error('❌ EventForm: Error completo al crear evento:', error);
                console.error('Tipo de error:', typeof error);
                
                let errorMessage = 'Error al crear el evento. Por favor, inténtalo de nuevo.';
                if (error instanceof Error) {
                    console.error('Stack del error:', error.stack);
                    errorMessage = `Error: ${error.message}`;
                }
                
                alert(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="event-form-wrapper">
            <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Evento *</label>
                    <input 
                        type="text" 
                        id="nombre"
                        name="nombre" 
                        placeholder="Ej: Limpieza de Playa Sostenible" 
                        value={formData.nombre}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción *</label>
                    <textarea 
                        id="descripcion"
                        name="descripcion" 
                        placeholder="Describe el evento, objetivos y actividades..."
                        value={formData.descripcion}
                        onChange={handleChange} 
                        required
                        rows={4}
                    ></textarea>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha del Evento *</label>
                        <input 
                            type="datetime-local" 
                            id="fecha"
                            name="fecha" 
                            value={formData.fecha}
                            onChange={handleChange} 
                            required 
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxParticipantes">Máximo Participantes *</label>
                        <input 
                            type="number" 
                            id="maxParticipantes"
                            name="maxParticipantes" 
                            placeholder="50"
                            value={formData.maxParticipantes}
                            onChange={handleChange} 
                            required 
                            min="1"
                            max="1000"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="ubicacion">Ubicación *</label>
                    <input 
                        type="text" 
                        id="ubicacion"
                        name="ubicacion" 
                        placeholder="Ej: Parque Central, Ciudad de México" 
                        value={formData.ubicacion}
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-save" disabled={isLoading}>
                        <span className="btn-icon">💾</span>
                        {isLoading ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar Evento' : 'Guardar Evento')}
                    </button>
                    {isEditing && onCancel && (
                        <button type="button" className="btn btn-cancel" onClick={onCancel}>
                            <span className="btn-icon">❌</span>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EventForm;