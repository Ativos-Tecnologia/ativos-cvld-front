import React from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { LuChevronsUpDown } from 'react-icons/lu'
import { BiCheck } from 'react-icons/bi'
import { cn } from "@/lib/utils"

type CelerComboboxProps = {
    list: Array<string>;
    size?: string
    onChangeValue?: (() => void) | (() => Promise<void>);
}

const CelerAppCombobox = ({ list, size="250px" }: CelerComboboxProps) => {

    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>("")

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`min-w-[${size}] justify-between`}
                    >
                        {value
                            ? list.find((item: any) => item === value)
                            : "Select framework..."}
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
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <p title={item} className='truncate'>{item}</p>
                                        <BiCheck
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item ? "opacity-100" : "opacity-0"
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
    )
}

export default CelerAppCombobox