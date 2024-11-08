import { PasswordRequirements } from "@/hooks/usePassword";
import { FieldErrors, UseFormClearErrors, UseFormRegister } from "react-hook-form";

export type ChangePasswordProps = {
    password: string;
    confirm_password: string;
}

export type LabelProps = {
    title: string;
    errors: FieldErrors;
    register: UseFormRegister<ChangePasswordProps>;
    clearErrors?: UseFormClearErrors<ChangePasswordProps>;
    field: string;
    passwordInput?: string;
    confirmPasswordInput?: string;
    passwordsMatch?: boolean;
    strengthColor?: string;
    barWidth?: string;
    passwordStr?: string;
    passwordRequirements?: PasswordRequirements;
    htmlFor?: string;
}