import React from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LuChevronsUpDown } from 'react-icons/lu';
import { BiCheck } from 'react-icons/bi';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

type CelerComboboxProps<T extends FieldValues> = {
    list: Array<string | Record<string, string | number>>;
    size?: string;
    className?: string;
    onChangeValue: ((value: string) => void) | ((value: string) => Promise<void>);
    value: string;
    placeholder?: string;
    register?: ReturnType<UseFormRegister<T>>;
    name?: keyof T;
};

const CelerAppCombobox = <T extends FieldValues>({
    list,
    size,
    className,
    value,
    onChangeValue,
    placeholder,
    register,
    name,
}: CelerComboboxProps<T>) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`min-w-[${size}] ${className} justify-between border-stroke dark:border-strokedark`}
                    >
                        <p className="truncate">{value || 'Selecione...'}</p>
                        <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={`w-[${size}] p-0`}>
                    <Command>
                        <CommandInput placeholder={`${placeholder}`} />
                        <CommandList>
                            <CommandEmpty>Sem resultados</CommandEmpty>
                            <CommandGroup>
                                {list.map((item: string | Record<string, string | number>) => (
                                    <CommandItem
                                        key={
                                            typeof item === 'string'
                                                ? item
                                                : item[Object.keys(item)[1]]
                                        }
                                        value={
                                            typeof item === 'string'
                                                ? item
                                                : String(item[Object.keys(item)[1]])
                                        }
                                        onSelect={(currentValue) => {

                                            onChangeValue!(
                                                currentValue === value ? '' : currentValue,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <p
                                            title={
                                                typeof item === 'string'
                                                    ? item
                                                    : String(item[Object.keys(item)[0]])
                                            }
                                            className={`truncate`}
                                        >
                                            {typeof item === 'string'
                                                ? item
                                                : String(item[Object.keys(item)[1]])}
                                        </p>
                                        {typeof item === 'string' ? (
                                            <BiCheck
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value === item ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                        ) : (
                                            <BiCheck
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value === item[Object.keys(item)[1]]
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {register && (
                <input
                    type="hidden"
                    {...register} // Conecta o campo ao hookform
                    value={value} // Valor controlado
                />
            )}
        </>
    );
};

export default CelerAppCombobox;
