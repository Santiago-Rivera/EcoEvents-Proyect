// Componente de estado del sistema eliminado por solicitud del usuario

// Add this at the top of your component (or adjust as needed)
import React, { useState } from 'react';

type BackendStatus = 'online' | 'offline' | 'checking';

const SystemStatus: React.FC = () => {
    const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const getStatusColor = () => {
        switch (backendStatus) {
            case 'online': return '#28a745';
            case 'offline': return '#dc3545';
            case 'checking': return '#ffc107';
        }
    };

    // getStatusText function removed because it was never used

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <div 
                style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor()
                }}
            />
            {/* Status text removed because getStatusText() is not defined */}
            <span style={{ color: '#666', fontSize: '10px' }}>
                {lastCheck.toLocaleTimeString()}
            </span>
            {/* Removed getStatusText usage because the function is not used */}
            <button
                style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    cursor: 'pointer'
                }}
                onClick={() => {
                    setBackendStatus('checking');
                    setLastCheck(new Date());
                }}
                aria-label="Recheck system status"
            >
                🔄
            </button>
        </div>
    );
};

export default SystemStatus;
