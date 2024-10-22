import { usePathname } from 'next/navigation';
import React from 'react';
import { FieldErrors } from 'react-hook-form';

interface ErrorMessageProps {
    errors: FieldErrors;
    field: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, field }) => {
    if (!errors[field]) {
        return null;
    }

    const pathname = usePathname();

    return (
        <span role="alert" className={`absolute left-1 ${pathname.includes("sign") ? "top-11" : "top-14.5"} text-red dark:text-meta-1 font-medium pr-8 text-xs`}>
            {errors[field]?.message?.toString()}
        </span>
    );
};


