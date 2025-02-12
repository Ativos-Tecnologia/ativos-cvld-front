import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InputFieldVariant } from '@/enums/inputFieldVariants.enum';
import PhoneInput from 'react-phone-number-input';
import { Checkbox } from '@/components/ui/checkbox';
import ReactDatePicker from 'react-datepicker';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ICelerInputFormField from '@/interfaces/ICelerInputFormField';
import { AiOutlineLoading } from 'react-icons/ai';
import Cleave from 'cleave.js/react';

interface ICelerInputField extends ICelerInputFormField {
    onValueChange?: (name: string, value: any) => void;
    error?: string;
    isLoading?: boolean;
    onSubmit?: (name: string, value: any) => void;
    ref?: React.Ref<HTMLInputElement>;
}

export const CelerInputField = React.memo(
    React.forwardRef<HTMLInputElement, ICelerInputField>((props, ref) => {
        const [value, setValue] = useState(props.defaultValue ?? '');

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
            if (event.key === 'Enter') {
                event.preventDefault();
                if (props.onSubmit) {
                    props.onSubmit(props.name, value);
                }
            }
        };

        const commonProps = {
            value,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleChange(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: props.placeholder || 'Digite aqui',
            disabled: props.disabled || props.isLoading,
        };

        const renderInput = () => {
            switch (props.fieldType) {
                case InputFieldVariant.INPUT:
                    return (
                        <div className="mt-2 flex w-full gap-4 rounded-md">
                            {props.iconSrc && (
                                <div className="flex items-center">{props.iconSrc}</div>
                            )}
                            <Input
                                ref={ref}
                                className={cn(
                                    'shad-input border border-stroke dark:border-strokedark',
                                    props.className,
                                )}
                                {...commonProps}
                            />
                        </div>
                    );
                case InputFieldVariant.TEXTAREA:
                    return (
                        <Textarea
                            rows={props.rows}
                            cols={props.cols}
                            required={props.required}
                            className="shad-textArea"
                            {...commonProps}
                        />
                    );
                case InputFieldVariant.PHONE_INPUT:
                    return (
                        <PhoneInput
                            value={value}
                            onChange={handleChange}
                            defaultCountry="BR"
                            placeholder={props.placeholder || 'Digite o número'}
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
                                className="border-1 relative box-border block cursor-pointer appearance-none rounded-md border-[#d9d9d9] bg-slate-200 transition-all duration-300 before:absolute before:left-2/4 before:top-[42%] before:h-[10px] before:w-[6px] before:-translate-x-2/4 before:-translate-y-2/4 before:rotate-45 before:scale-0 before:border-b-2 before:border-r-2 before:border-solid before:border-b-white before:border-r-white before:opacity-0 before:transition-all before:delay-100 before:duration-100 before:ease-in before:content-[''] after:absolute after:inset-0 after:rounded-[7px] after:opacity-0 after:shadow-[0_0_0_calc(30px_/_2.5)_#1677ff] after:transition-all after:duration-500 after:ease-in after:content-[''] checked:border-transparent checked:bg-[#1677ff] checked:before:-translate-x-2/4 checked:before:-translate-y-2/4 checked:before:rotate-45 checked:before:scale-x-[1.4] checked:before:scale-y-[1.4] checked:before:opacity-100 checked:before:transition-all checked:before:delay-100 checked:before:duration-200 checked:before:ease-in hover:border-[#1677ff] focus:outline-[#1677ff] [&:active:not(:checked)]:after:opacity-100 [&:active:not(:checked)]:after:shadow-none [&:active:not(:checked)]:after:transition-none"
                            />
                            <label
                                htmlFor={props.name}
                                className={cn('shad-label', props.className)}
                            >
                                {props.label}{' '}
                                {props.required && (
                                    <sup className="text-red-500 dark:text-red-400">*</sup>
                                )}
                            </label>
                        </div>
                    );
                case InputFieldVariant.DATE:
                    return (
                        <div className="mt-2 flex w-full gap-4 rounded-md">
                            {props.iconSrc && (
                                <div className="flex items-center">{props.iconSrc}</div>
                            )}
                            <Cleave
                                {...commonProps}
                                defaultValue={props.defaultValue}
                                className={`h-11 w-full rounded-md border-stroke px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2 dark:text-bodydark`}
                                options={{
                                    date: true,
                                    datePattern: ['d', 'm', 'Y'],
                                    delimiter: '/',
                                }}
                            />
                        </div>
                    );
                case InputFieldVariant.SELECT:
                    return (
                        <div className={cn('mt-2 flex w-full gap-4 rounded-md', props.className)}>
                            {props.iconSrc && (
                                <div className="flex items-center">{props.iconSrc}</div>
                            )}
                            <Select
                                onValueChange={(selectedValue) => handleChange(selectedValue)}
                                value={value}
                                defaultValue={value}
                                disabled={props.disabled || props.isLoading}
                            >
                                <SelectTrigger className="shad-select-trigger">
                                    <SelectValue
                                        placeholder={props.placeholder || 'Selecione uma opção'}
                                    />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                    {props.children}
                                </SelectContent>
                            </Select>
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="col-span-1">
                {props.label && props.fieldType !== InputFieldVariant.CHECKBOX && (
                    <Label className="shad-input-label">
                        {props.label}{' '}
                        {props.required && <sup className="text-red-500 dark:text-red-400">*</sup>}
                    </Label>
                )}
                <div className="flex items-center gap-2">
                    {renderInput()}
                    {props.isLoading && <AiOutlineLoading className="h-5 w-5 animate-spin" />}
                </div>
                {props.error && <p className="mt-1 text-sm text-red-500">{props.error}</p>}
            </div>
        );
    }),
);

CelerInputField.displayName = 'CelerInputField';
