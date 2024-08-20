import React from 'react';
import './Toast.css';
import checkIcon from '../assets/check.png';

interface ToastProps {
    message: string;
    iconSrc?: string;
}

const Toast: React.FC<ToastProps> = ({ message, iconSrc = checkIcon }) => {
    return (
        <div className="toast-container">
            <img src={iconSrc} alt="Icon" />
            <span className="toast-message">{message}</span>
        </div>
    );
};

export default Toast;
