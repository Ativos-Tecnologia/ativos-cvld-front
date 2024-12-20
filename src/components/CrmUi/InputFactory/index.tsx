import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import PhoneInput from "react-phone-number-input";
import { Checkbox } from "@/components/ui/checkbox";
import ReactDatePicker from "react-datepicker";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CustomProps {
    name: string;
    fieldType: InputFieldVariant;
    label?: string;
    placeholder?: string;
    iconSrc?: React.ReactNode;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    defaultValue?: any;
    className?: string;
    onValueChange?: (name: string, value: any) => void;
    error?: string;
    isLoading?: boolean;
    onSubmit?: (name: string, value: any) => void;
    ref?: React.Ref<HTMLInputElement>;
}

export const CelerInputField: React.FC<CustomProps> = React.memo((props) => {
    const [value, setValue] = useState(props.defaultValue ?? "");

    useEffect(() => {
        if (props.defaultValue !== undefined) {
            setValue(props.defaultValue);
        }
    }, [props.defaultValue]);

    const handleChange = (newValue: any) => {
        if (newValue !== value) { 
            setValue(newValue);
            props.onValueChange?.(props.name, newValue);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (props.onSubmit) {
                props.onSubmit(props.name, value);
            }
        }
    };

    const commonProps = {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: props.placeholder || "Digite aqui",
        disabled: props.disabled || props.isLoading,
    };

    const renderInput = () => {
        switch (props.fieldType) {
            case InputFieldVariant.INPUT:
                return (
                    <div className="flex rounded-md gap-4">
                        {props.iconSrc && <div className="flex items-center">{props.iconSrc}</div>}
                        <Input ref={props.ref} className={cn("shad-input border-0 bg-snow", props.className)} {...commonProps} />
                    </div>
                );
            case InputFieldVariant.TEXTAREA:
                return <Textarea className="shad-textArea" {...commonProps} />;
            case InputFieldVariant.PHONE_INPUT:
                return (
                    <PhoneInput
                        value={value}
                        onChange={handleChange}
                        defaultCountry="BR"
                        placeholder={props.placeholder || "Digite o número"}
                        international
                        withCountryCallingCode
                        disabled={props.disabled}
                        className="input-phone"
                    />
                );
            case InputFieldVariant.CHECKBOX:
                return (
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={props.name}
                            checked={!!value}
                            onCheckedChange={(isChecked) => handleChange(isChecked)}
                            disabled={props.disabled || props.isLoading}
                        />
                        <label htmlFor={props.name} className="checkbox-label">
                            {props.label}
                        </label>
                    </div>
                );
            case InputFieldVariant.DATE_PICKER:
                return (
                    <div className="flex rounded-md border border-dark-500 bg-dark-400">
                        <Image
                            src="/assets/icons/calendar.svg"
                            height={24}
                            width={24}
                            alt="Calendar"
                            className="ml-2"
                        />
                        <ReactDatePicker
                            selected={value}
                            onChange={(date: Date | null) => handleChange(date)}
                            showTimeSelect={props.showTimeSelect}
                            dateFormat={props.dateFormat || "MM/dd/yyyy"}
                            disabled={props.disabled || props.isLoading}
                            wrapperClassName="date-picker"
                        />
                    </div>
                );
            case InputFieldVariant.SELECT:
                return (
                    <Select onValueChange={(selectedValue) => handleChange(selectedValue)} value={value} defaultValue={value}>
                        <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder={props.placeholder || "Selecione uma opção"} />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">{props.children}</SelectContent>
                    </Select>
                );
            default:
                return null;
        }
    };

    return (
        <div className="form-inputs-container">
            {props.label && <Label className="shad-input-label">{props.label}</Label>}
            {renderInput()}
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    );
});
