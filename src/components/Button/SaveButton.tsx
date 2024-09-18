import React from 'react'
import { AiOutlineCheck, AiOutlineClose, AiOutlineLoading } from 'react-icons/ai'
import { BiSolidSave } from 'react-icons/bi'

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    status: string | null
}

const SaveButton: React.FC<SaveButtonProps> = ({ status, ...props }) => {
    return (
        <button
            {...props}
            title='salvar (clique ou pressione enter ou tab)'
            className='p-1 flex items-center justify-center gap-1 rounded-full bg-transparent hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 cursor-pointer'>
            {status === null && <BiSolidSave className='text-lg' />}
            {status === 'pending' && <AiOutlineLoading className='text-lg animate-spin' />}
            {status === 'success' && <AiOutlineCheck className='text-lg animate-jump text-green-500' />}
            {status === 'error' && <AiOutlineClose  className='text-lg animate-jump text-red-400' />}
        </button>
    )
}

export default SaveButton