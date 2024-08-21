import React, { useState } from 'react';
import './Tooltip.css';

interface TooltipProps {
    content: React.ReactNode;
    icon?: React.ReactNode;
    backgroundColor?: string;
    delay?: number;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, icon, backgroundColor, delay = 300, children }) => {
    const [visible, setVisible] = useState<boolean>(false);

    let timeout: ReturnType<typeof setTimeout>;

    const showTooltip = () => {
        timeout = setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        clearTimeout(timeout);
        setVisible(false);
    };

    return (
        <div
            className="tooltip-container"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {visible && (
                <div className="tooltip-content" style={{ backgroundColor }}>
                    {icon && <div className="tooltip-icon">{icon}</div>}
                    <div className="tooltip-text">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
