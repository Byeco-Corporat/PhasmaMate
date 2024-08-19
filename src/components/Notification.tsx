// src/components/Notification.tsx
import React, { useState, useEffect } from 'react';

interface NotificationProps {
    id: number;
    message: string;
    onDismiss: (id: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ id, message, onDismiss }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onDismiss(id), 300); // Allow time for fade-out
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <div className={`notification ${visible ? 'show' : 'hide'}`} onClick={() => onDismiss(id)}>
            {message}
        </div>
    );
};

export default Notification;
