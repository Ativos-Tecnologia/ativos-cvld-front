// Modal.tsx
import React from 'react';
import Backdrop from '../../Backdrop';

interface ModalProps {
    isOpen: boolean;
    size: keyof typeof sizes
    children: React.ReactNode;
}

const sizes = {
    "sm": 'w-1/2',
    "md": 'w-3/5',
    "lg": 'w-4/5',
}

const Modal: React.FC<ModalProps> = ({ isOpen, size, children }) => {
    if (!isOpen) return null;

    return (
        <Backdrop>
            <div className={`relative h-fit ${sizes[size]} rounded-lg border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark z-40`}>
                {children}
            </div>
        </Backdrop>
    );
};

export default Modal;
