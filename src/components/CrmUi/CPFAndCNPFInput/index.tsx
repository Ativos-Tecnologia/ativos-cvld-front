import { Input } from '@/components/ui/input';
import { CPFAndCNPJMask } from '@/functions/formaters/CPFAndCNPJInput';

interface CPFAndCNPJInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: (value: string) => void;
}

export function CPFAndCNPJInput({ value, setValue, ...props }: CPFAndCNPJInputProps) {
    function handleChangeMask(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;

        setValue(CPFAndCNPJMask(value));
    }

    return (
        <Input onChange={handleChangeMask} value={value} placeholder={'CPF ou CNPJ'} {...props} />
    );
}
