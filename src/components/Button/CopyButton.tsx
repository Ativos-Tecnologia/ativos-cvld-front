import React, { HTMLAttributes } from 'react'
import { ImCopy } from 'react-icons/im'

const CopyButton: React.FC<HTMLAttributes<HTMLButtonElement>> = ({...props}) => {
    return (
        <button
            {...props}
            className='absolute top-1/2 -translate-y-1/2 left-2 opacity-0 p-1 w-7 h-7 hover:bg-slate-700 rounded-full flex items-center justify-center group-hover:opacity-100 transition-all duration-200 cursor-pointer'
        >
            <ImCopy />
        </button>
    )
}

export default CopyButton