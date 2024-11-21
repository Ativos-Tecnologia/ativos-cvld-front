import React from 'react';
import { BiX } from 'react-icons/bi';

interface ModalHeaderProps {
    onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
    return (
        <div className="flex justify-end items-center">
            {/* <h2 className="text-lg font-semibold">Confirmação</h2> */}
            <button className='group w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors duration-300 cursor-pointer' onClick={onClose}>
                <BiX className="group-hover:text-white transition-colors duration-300 text-2xl" />
            </button>
        </div>
    );
};

export default ModalHeader;