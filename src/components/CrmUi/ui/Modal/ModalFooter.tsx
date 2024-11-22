import { Button } from '@/components/Button';
import React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

interface ModalFooterProps {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onConfirm, onCancel, isLoading }) => {
    return (
        <div className='flex gap-4 items-center justify-center mt-8 mb-5'>
            <Button variant='outlined' className='outlined' onClick={onConfirm}>{
                isLoading ? <AiOutlineLoading className='animate-spin' /> : 'Confirmar'
                }</Button>
            <Button variant='danger' onClick={onCancel}>Cancelar</Button>
        </div>
    );
};

export default ModalFooter;
