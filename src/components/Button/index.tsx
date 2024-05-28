import React from 'react'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode,
    className?: string
}


export const Button: React.FC<SubmitButtonProps> = ({
    className, // = 'w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90',
    type = 'button',
    children,
    ...props
}) => {
    return (
        <button type={type} className={className} {...props}>
            {children}
        </button>
    )
}

