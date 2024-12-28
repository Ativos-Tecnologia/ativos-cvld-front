import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import { Control } from "react-hook-form";

interface ReactHookFormInputFieldProps {
    control: Control<any>;
}

export default interface ICelerInputFormField {
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: React.ReactNode;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    rules?: any;
    currencyFormat?: string | null;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: InputFieldVariant;
    defaultValue?: any;
    className?: string;
    cols?: number;
    rows?: number;
    required?: boolean;
  }

export type CelerInputFormFieldProps = ICelerInputFormField & ReactHookFormInputFieldProps;