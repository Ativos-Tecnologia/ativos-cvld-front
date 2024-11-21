// Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className='absolute bg-black-2/50 flex flex-col items-center justify-center w-full h-full top-0 left-0 rounded-md border z-40'>
            <div className="relative h-fit w-3/5 rounded-lg border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark z-40">
                {children}
            </div>
        </div>
    );
};

export default Modal;
