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

type CelerComboboxProps = {
    list: Array<string>;
    size?: string | '250px';
    className?: string;
    onChangeValue: ((value: string) => void) | ((value: string) => Promise<void>);
    value: string;
};

const CelerAppCombobox = ({ list, size, className, value, onChangeValue }: CelerComboboxProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`min-w-[${size}] ${className} justify-between`}
                    >
                        {value
                            ? list.find((item: any) => item === value)
                            : 'Selecione para filtro...'}
                        <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={`w-[${size}] p-0`}>
                    <Command>
                        <CommandInput placeholder="Buscar broker..." />
                        <CommandList>
                            <CommandEmpty>Sem resultados</CommandEmpty>
                            <CommandGroup>
                                {list.map((item: any) => (
                                    <CommandItem
                                        key={item}
                                        value={item}
                                        onSelect={(currentValue) => {
                                            onChangeValue!(
                                                currentValue === value ? '' : currentValue,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <p title={item} className={` ${className} truncate`}>
                                            {item}
                                        </p>
                                        <BiCheck
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === item ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default CelerAppCombobox;
