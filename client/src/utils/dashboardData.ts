// Datos simulados para el dashboard
export const dashboardData = {
  events: {
    total: 24,
    active: 8,
    completed: 16,
    thisMonth: 6
  },
  participants: {
    total: 1250,
    average: 52,
    growth: 15.2
  },
  categories: [
    { name: 'Limpieza Ambiental', count: 8, color: '#4ade80' },
    { name: 'Reforestación', count: 6, color: '#06b6d4' },
    { name: 'Talleres Ecológicos', count: 5, color: '#8b5cf6' },
    { name: 'Turismo Sostenible', count: 3, color: '#f59e0b' },
    { name: 'Agricultura Urbana', count: 2, color: '#ef4444' }
  ],
  weeklyActivity: [
    { day: 'Lun', events: 4, participants: 120 },
    { day: 'Mar', events: 6, participants: 180 },
    { day: 'Mié', events: 3, participants: 90 },
    { day: 'Jue', events: 8, participants: 240 },
    { day: 'Vie', events: 5, participants: 150 },
    { day: 'Sáb', events: 7, participants: 210 },
    { day: 'Dom', events: 4, participants: 120 }
  ],
  recentNotifications: [
    {
      id: 1,
      type: 'event',
      message: 'Nuevo participante en "Limpieza de Playa"',
      time: '2 min ago',
      icon: '👥'
    },
    {
      id: 2,
      type: 'alert',
      message: 'Evento "Reforestación" alcanzó capacidad máxima',
      time: '15 min ago',
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'success',
      message: 'Evento "Taller de Compostaje" completado exitosamente',
      time: '1 hora ago',
      icon: '✅'
    }
  ],
  topEvents: [
    {
      id: 1,
      name: 'Limpieza de Río',
      participants: 45,
      maxParticipants: 50,
      date: '2025-06-28',
      status: 'active'
    },
    {
      id: 2,
      name: 'Taller de Reciclaje',
      participants: 30,
      maxParticipants: 35,
      date: '2025-06-30',
      status: 'active'
    },
    {
      id: 3,
      name: 'Reforestación Urbana',
      participants: 60,
      maxParticipants: 60,
      date: '2025-07-02',
      status: 'full'
    }
  ]
};

export const getEventStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#4ade80';
    case 'full': return '#f59e0b';
    case 'completed': return '#9ca3af';
    default: return '#4ade80';
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const calculatePercentage = (current: number, total: number) => {
  return total > 0 ? Math.round((current / total) * 100) : 0;
};
