import React, { useEffect, useState } from 'react';
import './Toast.css';

type ToastProps = {
  message: string;
  duration?: number;
  iconSrc: string;
};

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, iconSrc }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="toast-container">
      <img src={iconSrc} alt="Icon" className="toast-icon" />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
