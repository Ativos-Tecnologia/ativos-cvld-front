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

    return (
        <span role="alert" className="absolute right-4 top-5 text-red pr-8 text-xs">
            {errors[field]?.message?.toString()}
        </span>
    );
};


