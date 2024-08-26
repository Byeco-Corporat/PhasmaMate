import React, { useRef } from 'react';
import './CustomTitleBar.css';

const CustomTitleBar: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
    const titleBarRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const titleBar = titleBarRef.current;
        if (!titleBar) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const { offsetLeft, offsetTop } = titleBar;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            window.moveTo(offsetLeft + dx, offsetTop + dy);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="custom-title-bar"
            onMouseDown={handleMouseDown}
            ref={titleBarRef}
        >
            <span className="title">{title}</span>
            <button className="close-button" onClick={onClose}>X</button>
        </div>
    );
};

export default CustomTitleBar;
