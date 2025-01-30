import { SignUpInputs } from '@/app/auth/signup/page';
import { Input } from '@/components/ui/input';
import { CPFAndCNPJMask } from '@/functions/formaters/CPFAndCNPJInput';
import { CvldFormInputsProps } from '@/types/cvldform';
import { UseFormSetValue } from 'react-hook-form';

interface CPFAndCNPJInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: UseFormSetValue<Partial<SignUpInputs | CvldFormInputsProps>>;
}

export function CPFAndCNPJInput({ value, setValue, ...props }: CPFAndCNPJInputProps) {
    function handleChangeMask(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;

        setValue('cpf_cnpj', CPFAndCNPJMask(value));
    }

    return (
        <Input
            value={value}
            onChange={handleChangeMask}
            placeholder={'CPF ou CNPJ'}
            {...props}
            className={`focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${props.className}`}
        />
    );
}
