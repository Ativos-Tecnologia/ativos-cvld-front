import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import { Flowbite, Popover } from 'flowbite-react'
import React, { use, useCallback, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { PaginatedResponse, TaskRelatedItems } from '../TaskElements';
import api from '@/utils/api';

interface IFallbackMessageProps {
    trigger: boolean;
    type: string;
    message: string;
}

const DynamicForm = ({ label, data,  setData }: {
    label: string;
    data: PaginatedResponse<TaskRelatedItems>;
    setData: React.Dispatch<React.SetStateAction<PaginatedResponse<TaskRelatedItems>>>;
}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>('');
    const [message, setMessage] = useState<IFallbackMessageProps>();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(e.target.value);
    }, []);


    const handleCreateNewLabel = async () => {

        if (newLabel.trim() !== '') {

            if (label.toLowerCase() === 'metas') {
                const response = await api.post('/api/task/goals/create/', {
                    goalName: newLabel
                }).then(res => {
                    return res
                });
                
                setData({
                    ...data,
                    results: [
                        {
                            id: response.data.task_id,
                            title: newLabel,
                            goalName: newLabel,
                            nameRef: newLabel,
                            non_editable: false
                        },
                        ...data.results
                    ]
                })
                setNewLabel('');
                setMessage({
                    trigger: true,
                    type: 'success',
                    message: 'meta criada com sucesso.'
                })
                setTimeout(() => {
                    setOpen(false);
                    setMessage({
                        trigger: false,
                        type: '',
                        message: ''
                    })
                }, 1000);

            } else {
                const response = await api.post('/api/task/status/create/', {
                    statusName: newLabel
                }).then(res => {
                    return res
                });
                
                setData({
                    ...data,
                    results: [
                        {
                            id: response.data.task_id,
                            title: newLabel,
                            statusName: newLabel,
                            nameRef: newLabel,
                            non_editable: false
                        },
                        ...data.results
                    ]
                })
                setNewLabel('');
                setMessage({
                    trigger: true,
                    type: 'success',
                    message: 'status criado com sucesso.'
                })
                setTimeout(() => {
                    setOpen(false);
                    setMessage({
                        trigger: false,
                        type: '',
                        message: ''
                    })
                }, 1000);
            }

        } else {
            setMessage({
                trigger: true,
                type: 'error',
                message: 'campo obrigatório.'
            });
        }

    }


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
                arrow={false}
                onOpenChange={setOpen}
                placement='top'
                content={
                    <div className={`flex w-50 flex-col gap-4 p-4 text-sm transition-all duration-200`}>
                        <div className='relative mb-3'>
                            <label htmlFor="new-label" className='font-medium'>
                                {label.toLowerCase() === 'status' ? 'Novo status' : 'Nova meta'}
                            </label>
                            <input
                                type="text"
                                value={newLabel}
                                onChange={handleInputChange}
                                placeholder={label.toLowerCase() === 'status' ? 'Ex: em andamento' : 'Ex: primeiro contato'}
                                className='w-full mt-1 text-xs text-ellipsis overflow-hidden whitespace-nowrap rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                            />
                            {message?.trigger && (
                                <span className={`absolute -bottom-4 left-1 text-xs ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                    {message.message}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button type='button' className='flex flex-1 justify-center rounded border border-stroke px-3 py-1 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white dark:bg-white/20 dark:hover:bg-white/30 bg-gray-100 hover:bg-gray-300 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
                            onClick={() => {setNewLabel('')}}
                            disabled={newLabel.trim() === ''}>
                                Limpar
                            </button>
                            <button type='button' className="flex flex-1 justify-center rounded bg-blue-700 hover:!bg-blue-800 transition-all duration-300 px-3 py-1 font-medium text-gray dark:hover:!bg-blue-800 dark:bg-blue-700 dark:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:!hover-blue-700"
                            onClick={handleCreateNewLabel}
                            disabled={newLabel.trim() === ''}>
                                Salvar
                            </button>
                        </div>
                    </div>
                }
            >
                <button type='button' className={`${open && 'text-black dark:text-white'} flex items-center gap-1 p-1 rounded-full mb-1 cursor-pointer w-fit hover:text-black dark:hover:text-white transition-all duration-200`}>
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
