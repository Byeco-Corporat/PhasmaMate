// src/components/NotificationContainer.tsx
import React, { useState, useCallback } from 'react';
import Notification from './Notification';

let notificationId = 0;

interface NotificationData {
    id: number;
    message: string;
    type: string;
}

const NotificationContainer: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const addNotification = useCallback((message: string, type: string) => {
        setNotifications((prev) => [
            ...prev,
            { id: notificationId++, message, type },
        ]);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <div id="notification-container">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    id={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onDismiss={removeNotification}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;

export const useNotification = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const showNotification = (message: string, type: string) => {
        setNotifications((prev) => [
            ...prev,
            { id: notificationId++, message, type },
        ]);
    };

    return { showNotification };
};
