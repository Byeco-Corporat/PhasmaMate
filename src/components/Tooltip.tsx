import React from 'react';
import './Tooltip.css';

interface TooltipProps {
    message: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
    return (
        <div className="tooltip-container">
            {children}
            <span className="tooltip-text">{message}</span>
        </div>
    );
};

export default Tooltip;
