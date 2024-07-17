import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import { Flowbite, Popover } from 'flowbite-react'
import React, { useState } from 'react'
import { BiPlus } from 'react-icons/bi'

export const DynamicForm = ({ label }: { label: string }) => {

    const [open, setOpen] = useState<boolean>(false);

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
                        <div>
                            <label htmlFor="new-label" className='font-medium'>
                                {label.toLowerCase() === 'status' ? 'Novo status' : 'Nova meta'}
                            </label>
                            <input 
                            type="text" 
                            title={'teste'}
                            placeholder={`Digite o nome ${label.toLowerCase() === 'status' ? 'do novo status' : 'da nova meta'}`}
                            className='w-full mt-1 text-sm text-ellipsis overflow-hidden whitespace-nowrap rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white' />
                        </div>
                        <div className="flex gap-2">
                            <button color="gray">Reset</button>
                            <button color="success" onClick={() => setOpen(false)}>
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
