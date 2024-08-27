import React, { useContext } from 'react'
import { BiMinus, BiTrash } from 'react-icons/bi';
import { MdOutlineArchive, MdOutlineUnarchive } from 'react-icons/md';
import { ExtratosTableContext } from '@/context/ExtratosTableContext';
import { NotionPage } from '@/interfaces/INotion';
import { AiOutlineLoading } from 'react-icons/ai';

export const MiniMenu = ({ count, checkedList, setCheckedList, handleSelectAllRows, handleArchiveExtrato, archiveStatus }:
    {
        count: number,
        checkedList: NotionPage[],
        setCheckedList: React.Dispatch<React.SetStateAction<NotionPage[]>>,
        handleSelectAllRows: () => void,
        handleArchiveExtrato: () => Promise<void>,
        archiveStatus: boolean
    }
) => {

    const {
        currentPage,
        handleDeleteExtrato
    } = useContext(ExtratosTableContext);

    return (
        <div className="flex max-h-6 items-center justify-between my-3">
            <div className='flex items-center'>
                <div className='flex items-center'>
                    <div className={`w-10 flex items-center justify-center border-r border-transparent`}>
                        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 cursor-pointer">

                            {checkedList!.length === 0 ? (
                                <div
                                    className={`relative z-3 w-[15px] h-[15px] flex items-center justify-center duration-100 border-2 border-body dark:border-bodydark rounded-[3px]`}
                                    onClick={handleSelectAllRows}
                                >

                                </div>
                            ) : (
                                <div
                                    className={`relative z-3 w-[15px] h-[15px] flex items-center justify-center duration-100 border-2 border-body dark:border-bodydark rounded-[3px]`}
                                    onClick={() => setCheckedList!([])}
                                >
                                    <BiMinus />
                                </div>
                            )}

                        </div>
                    </div>
                    {checkedList!.length === 0 && <span className='text-xs'>Selecionar todos</span>}
                </div>
                <div className={`flex items-center w-0 overflow-hidden ${checkedList!.length > 0 && 'w-fit'} transition-width duration-300`}>

                    {/* separator */}
                    <div className="w-px mx-1 h-5 mr-3 bg-zinc-300 dark:bg-form-strokedark"></div>
                    {/* separator */}

                    <div className='text-xs py-1 px-3 h-6 bg-blue-50 dark:bg-form-strokedark rounded-md font-medium mr-2'>
                        <span>{checkedList!.length} {checkedList!.length === 1 ? ' item selecionado' : '    itens selecionados'}</span>
                    </div>

                    {/* <div
                        title='Excluir selecionado(s)'
                        className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 cursor-pointer'
                        onClick={handleDeleteExtrato}
                    >
                        <BiTrash className='text-lg' />
                    </div> */}

                    <div
                        title='Arquivar selecionado(s)'
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleArchiveExtrato()}
                    >
                        {archiveStatus ? (
                            <AiOutlineLoading className='animate-spin text-lg' />
                        ): (
                            <MdOutlineArchive className='text-lg' />
                        )}
                    </div>

                </div>
            </div>
            <div className='text-sm font-medium'>
                <span>
                    {`${currentPage * 20 - 20 + 1}-${currentPage * 20 > count
                        ? count
                        : currentPage * 20} de ${count}`}
                </span>
            </div>
        </div>
    )
}
