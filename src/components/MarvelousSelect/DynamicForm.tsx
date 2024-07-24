import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import { Flowbite, Popover } from 'flowbite-react'
import React, { use, useCallback, useState } from 'react'
import { BiCheck, BiPlus, BiX } from 'react-icons/bi'
import { PaginatedResponse, TaskRelatedItems } from '../TaskElements';
import api from '@/utils/api';
import { ImSpinner2 } from 'react-icons/im';

interface IFallbackMessageProps {
    trigger: boolean;
    type: string;
    message: string;
}

interface IResponseStatusProps {
    isLoading: boolean;
    passed: boolean | null;
}

const DynamicForm = ({ label, data, setData }: {
    label: string;
    data: PaginatedResponse<TaskRelatedItems>;
    setData: React.Dispatch<React.SetStateAction<PaginatedResponse<TaskRelatedItems>>>;
}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [newLabel, setNewLabel] = useState<string>('');
    const [responseStatus, setResponseStatus] = useState<IResponseStatusProps>({
        isLoading: false,
        passed: null,
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(e.target.value);
    }, []);


    const handleCreateNewLabel = async () => {

        if (newLabel.trim() !== '') {

            setResponseStatus({
                ...responseStatus,
                isLoading: true,
            });

            if (label.toLowerCase() === 'metas') {
                const response = await api.post('/api/task/goals/create/', {
                    goalName: newLabel
                }).then(res => {
                    return res
                });

                if (response.status === 201) {

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
                    setResponseStatus({
                        isLoading: false,
                        passed: true,
                    });
                    setTimeout(() => {
                        setNewLabel('');
                        setOpen(false)
                        setResponseStatus({
                            isLoading: false,
                            passed: null,
                        })
                    }, 1500);
                } else {
                    setResponseStatus({
                        isLoading: false,
                        passed: false,
                    });
                }


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
                setResponseStatus({
                    isLoading: false,
                    passed: true,
                });
                setTimeout(() => {
                    setNewLabel('');
                    setOpen(false)
                    setResponseStatus({
                        isLoading: false,
                        passed: null,
                    })
                }, 1500);
            }

        }

    }


    return (
        <Flowbite theme={{ theme: customFlowBiteTheme }}>
            <Popover
                aria-labelledby="area-popover"
                open={open}
                arrow={false}
                onOpenChange={setOpen}
                placement='top'
                content={
                    <div className={`flex w-50 flex-col gap-4 p-4 text-sm transition-all duration-200`}>
                        <div className='relative'>
                            <label htmlFor="new-label" className='font-medium'>
                                {label.toLowerCase() === 'status' ? 'Novo status' : 'Nova meta'}
                            </label>
                            <input
                                type="text"
                                required={true}
                                value={newLabel}
                                onChange={handleInputChange}
                                placeholder={label.toLowerCase() === 'status' ? 'Ex: em andamento' : 'Ex: primeiro contato'}
                                className='w-full mt-1 text-xs text-ellipsis overflow-hidden whitespace-nowrap rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white'
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type='button' className='flex flex-1 text-xs justify-center rounded border border-stroke px-3 py-1 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white dark:bg-white/20 dark:hover:bg-white/30 bg-gray-100 hover:bg-gray-300 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
                                onClick={() => { setNewLabel('') }}
                                disabled={newLabel.trim() === ''}>
                                Limpar
                            </button>

                            <button
                                type='button'
                                className={`${responseStatus.passed === null && 'bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-800 dark:bg-blue-700'} ${responseStatus.passed === false && 'bg-meta-1 hover:bg-red dark:hover:bg-red dark:bg-meta-1'} ${responseStatus.passed && 'bg-green-500 hover:bg-green-600 dark:hover:bg-green-600 dark:bg-green-500'} flex flex-1 gap-2 items-center justify-center rounded px-3 py-1 font-medium text-gray disabled:cursor-not-allowed disabled:opacity-50 disabled:!hover-blue-700 transition-all duration-300`}
                                onClick={handleCreateNewLabel}
                                disabled={newLabel.trim() === ''}>

                                {responseStatus.isLoading ?
                                    <>
                                        <ImSpinner2 className='w-5 h-5 animate-spin' />
                                    </>
                                    :
                                    <>
                                        {responseStatus.passed === null &&
                                        <span>Salvar</span>}
                                        {responseStatus.passed && 
                                        <BiCheck className='w-5 h-5' />}
                                        {responseStatus.passed === false && 
                                        <BiX className='w-5 h-5' />}
                                    </>
                                }
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
