import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import { Flowbite, Popover } from 'flowbite-react'
import React, { use, useCallback, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useForm } from 'react-hook-form'

const DynamicForm = ({ label }: { label: string }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>('');
    console.log('a')

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(e.target.value)
    }, [])


    return (
        // <div className="relative">
        //     <button type='button' className="flex items-center gap-1 p-1 rounded-full mb-1 cursor-pointer w-fit hover:text-black dark:hover:text-white transition-all duration-200">
        //         <BiPlus />
        //         <span className="text-xs">
        //             adicionar {label.toLowerCase() === 'status' ? 'novo status' : 'nova meta'}
        //         </span>
        //     </button>
        // </div>
        <Flowbite theme={{ theme: customFlowBiteTheme }}>
            <Popover
                aria-labelledby="area-popover"
                open={open}
                onOpenChange={setOpen}
                placement='top'
                content={
                    <div className="flex w-50 flex-col gap-4 p-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className='relative mb-4'>
                            <label htmlFor="new-label" className='font-medium'>
                                {label.toLowerCase() === 'status' ? 'Novo status' : 'Nova meta'}
                            </label>
                            <input
                                type="text"
                                value={newLabel}
                                onChange={handleInputChange}
                                placeholder={label.toLowerCase() === 'status' ? 'Ex: em andamento' : 'Ex: primeiro contato'}
                                className='w-full mt-1 text-sm text-ellipsis overflow-hidden whitespace-nowrap rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type='button'>Reset</button>
                            <button type='submit'>
                                Save
                            </button>
                        </div>
                    </div>
                }
            >
                <button type='button' className="flex items-center gap-1 p-1 rounded-full mb-1 cursor-pointer w-fit hover:text-black dark:hover:text-white transition-all duration-200">
                    <BiPlus />
                    <span className="text-xs">
                        adicionar {label.toLowerCase() === 'status' ? 'novo status' : 'nova meta'}
                    </span>
                </button>
            </Popover>
        </Flowbite>
    )
}

export default React.memo(DynamicForm)
