import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode,
    className?: string
}


export const Button: React.FC<ButtonProps> = ({
    className,
    children,
    type = "button",
    ...props
}) => {


    return (
        <button type={type} className={className} {...props}>
            {children}
        </button>
    )
}

