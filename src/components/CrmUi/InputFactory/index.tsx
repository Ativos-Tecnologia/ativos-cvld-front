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
import ICelerInputFormField from "@/interfaces/ICelerInputFormField";
import { AiOutlineLoading } from "react-icons/ai";
import Cleave from "cleave.js/react";
import { IoCalendar } from "react-icons/io5";

interface ICelerInputField extends ICelerInputFormField {
    onValueChange?: (name: string, value: any) => void;
    error?: string;
    isLoading?: boolean;
    onSubmit?: (name: string, value: any) => void;
    ref?: React.Ref<HTMLInputElement>;
}

export const CelerInputField: React.FC<ICelerInputField> = React.memo((props) => {
    const [value, setValue] = useState(props.defaultValue ?? "");

    useEffect(() => {
        if (props.defaultValue !== undefined) {
            setValue(props.defaultValue);
        }
    }, [props.defaultValue]);

    const handleChange = (newValue: any) => {

        /**
         * Código abaixo comentado para evitar o não disparamento
         * das funções de set e valueChange quando ocorrer um erro
         * ao tentar mudar o estado do input
         */

        // if (newValue !== value) {
        //     setValue(newValue);
        //     props.onValueChange?.(props.name, newValue);
        // }

        setValue(newValue);
        props.onValueChange?.(props.name, newValue);
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
                    <div className="flex rounded-md gap-4 mt-2 w-full">
                        {props.iconSrc && <div className="flex items-center">{props.iconSrc}</div>}
                        <Input ref={props.ref} className={cn("shad-input border border-stroke dark:border-strokedark", props.className)} {...commonProps} />
                    </div>
                );
            case InputFieldVariant.TEXTAREA:
                return <Textarea rows={props.rows} cols={props.cols} required={props.required} className="shad-textArea" {...commonProps} />;
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
                            checked={props.checked}
                            onCheckedChange={(isChecked) => handleChange(isChecked)}
                            disabled={props.disabled || props.isLoading}
                            value={value}
                        />
                        <label htmlFor={props.name} className={cn("shad-label", props.className)}>
                            {props.label}
                        </label>
                    </div>
                );
            case InputFieldVariant.DATE:
                return (
                    <div className="flex gap-4 rounded-md w-full mt-2">
                        {props.iconSrc && <div className="flex items-center">{props.iconSrc}</div>}
                        <Cleave
                            {...commonProps}
                            defaultValue={props.defaultValue}
                            className={`w-full rounded-md border-stroke py-2 px-3 h-11 text-sm font-medium dark:bg-boxdark-2 dark:border-strokedark dark:text-bodydark`}
                            options={{
                                date: true,
                                datePattern: ["d", "m", "Y"],
                                delimiter: "/"
                            }}
                        />
                    </div>
                );
            case InputFieldVariant.SELECT:
                return (
                    <div className="flex rounded-md gap-4 mt-2 w-full">
                        {props.iconSrc && <div className="flex items-center">{props.iconSrc}</div>}
                        <Select onValueChange={(selectedValue) => handleChange(selectedValue)} value={value} defaultValue={value} disabled={props.disabled || props.isLoading}>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={props.placeholder || "Selecione uma opção"} />
                            </SelectTrigger>
                            <SelectContent className="shad-select-content">{props.children}</SelectContent>
                        </Select>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="col-span-1">
            {(props.label && props.fieldType !== InputFieldVariant.CHECKBOX) && <Label className="shad-input-label">{props.label}</Label>}
            <div className="flex items-center gap-2">
                {renderInput()}
                {props.isLoading && <AiOutlineLoading className="animate-spin w-5 h-5" />}
            </div>
            {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
        </div>
    );
});

CelerInputField.displayName = "CelerInputField";