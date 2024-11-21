import React from 'react';
import { TiWarning } from 'react-icons/ti';

type ModalBodyProps = {
    children: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
    return (
        <div className='flex flex-col gap-4 items-center justify-center'>
            <TiWarning className='text-amber-300 text-5xl' />
            <p className='text-center'>{children}</p>
        </div>
    );
};

export default ModalBody;