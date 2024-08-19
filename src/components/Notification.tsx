// src/components/Notification.tsx
import React, { useState, useEffect } from 'react';

interface NotificationProps {
    id: number;
    message: string;
    type: string;
    onDismiss: (id: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ id, message, type, onDismiss }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onDismiss(id), 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'info':
                return 'ℹ️'; // Use appropriate icon for your setup
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'neutral':
                return 'ℹ️';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`notification ${type} ${visible ? 'show' : 'hide'}`} onClick={() => onDismiss(id)}>
            <span className="notification-icon">{getIcon(type)}</span>
            <span className="notification-text">{message}</span>
        </div>
    );
};

export default Notification;
