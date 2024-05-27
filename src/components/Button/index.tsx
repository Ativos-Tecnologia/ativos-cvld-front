import React from 'react'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLInputElement> {
    children?: React.ReactNode,
    className?: string
}


export const SubmitButton: React.FC<SubmitButtonProps> = ({
    className = 'w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90',
    children,
    ...props
}) => {
    return (
        <input type='submit' className={className} {...props}>
            {children}
        </input>
    )
}

