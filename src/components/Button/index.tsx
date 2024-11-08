import React from 'react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode,
    className?: string,
    variant?: keyof typeof variants,
}

const variants = {
    "default": "bg-blue-600 hover:bg-blue-700 text-white",
    "danger": "bg-red-400 hover:bg-red-500 text-white",
    "outlined": "bg-transparent border border-blue-700 text-blue-700 hover:border-blue-800 hover:text-blue-800 dark:border-snow dark:text-snow dark:hover:border-gray-200 dark:hover:text-gray-200",
    "ghost": "bg-transparent border-transparent"
}

export const Button: React.FC<SubmitButtonProps> = ({
    className, // = 'w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90',
    type = 'button',
    children,
    variant = "default",
    ...props
}) => {
    return (
        <button type={type} className={cn(`${variants[variant]} w-fit cursor-pointer rounded-lg px-4 py-2 transition hover:bg-opacity-90`, className)} {...props}>
            {children}
        </button>
    )
}
