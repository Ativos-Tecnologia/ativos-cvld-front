import React, { useContext, useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '../Tables/TableDefault'
import { AiOutlineUser } from 'react-icons/ai'
import { BiLoader, BiPencil, BiSolidDockLeft } from 'react-icons/bi'
import { IoArrowDownCircle, IoArrowUpCircle, IoDocumentTextOutline } from 'react-icons/io5'
import { LiaCoinsSolid } from 'react-icons/lia'
import { LuSigma } from "react-icons/lu";
import { NotionPage } from '@/interfaces/INotion'
import { PiCursorClick } from 'react-icons/pi'
import { RiNotionFill } from 'react-icons/ri'
import statusOficio from '@/enums/statusOficio.enum'
import { Badge } from 'flowbite-react'
import tipoOficio from '@/enums/tipoOficio.enum'
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants'
import { ImCopy } from 'react-icons/im'
import numberFormat from '@/functions/formaters/numberFormat'
import { BsCalendar3 } from 'react-icons/bs'
import dateFormater from '@/functions/formaters/dateFormater'
import ReactInputMask from 'react-input-mask'
import Cleave from 'cleave.js/react'
import { UserInfoAPIContext } from '@/context/UserInfoContext'

export const SendProposal = ({ isPending, data, checkedList, editableLabel, setEditableLabel, statusSelectValue, fetchingValue, handleNotionDrawer, handleSelectRow, handleChangeFupDate,
    handleChangeCreditorName, handleEditInput, handleEditStatus, handleCopyValue, handleChangeProposalPrice
}:
    {
        isPending: boolean,
        data: any,
        checkedList: NotionPage[],
        editableLabel: string | null;
        setEditableLabel: React.Dispatch<React.SetStateAction<string | null>>;
        statusSelectValue: statusOficio | null;
        fetchingValue: string | null;
        handleNotionDrawer: (id: string) => void;
        handleSelectRow: (item: NotionPage) => void;
        handleChangeCreditorName: (value: string, index: number, page_id: string, refList: HTMLInputElement[] | null) => Promise<void>;
        handleEditInput: (index: number, refList: HTMLInputElement[] | null) => void;
        handleEditStatus: (page_id: string, status: statusOficio) => Promise<void>;
        handleChangeProposalPrice: (page_id: string, value: string, index: number, refList: HTMLInputElement[] | null) => Promise<void>;
        handleCopyValue: (index: number) => void;
        handleChangeFupDate: (page_id: string, value: string, type: string, index: number) => Promise<void>;
    }
) => {

    /* ----> refs <----- */
    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);
    const inputProposalPriceRefs = useRef<HTMLInputElement[] | null>([]);
    const inputFirstFupDateRefs = useRef<HTMLInputElement[] | null>([]);
    const inputSecondFupDateRefs = useRef<HTMLInputElement[] | null>([]);
    const inputThirdFupDateRefs = useRef<HTMLInputElement[] | null>([]);
    const inputFourthFupDateRefs = useRef<HTMLInputElement[] | null>([]);
    const inputFifthFupDateRefs = useRef<HTMLInputElement[] | null>([]);

    const { data: { role } } = useContext(UserInfoAPIContext);

    /* ----> functions <---- */

    function fupDateConveter(date: string): string {
        const convertedDate = date.split("-").reverse().join("/");
        return convertedDate;
    }

    /* ----> effects <---- */

    useEffect(() => {
        if (inputCredorRefs.current) {
            data?.results.map((item: NotionPage, index: number) => {
                const ref = inputCredorRefs.current![index];
                if (ref) {
                    ref.value = item.properties.Credor?.title[0].text.content || '';
                }
            })
        }
    }, [data])

    return (
        <div
            style={{
                boxShadow: "inset -4px 0 4px rgba(0 0 0 / 0.1)"
            }}
            className='max-w-full overflow-x-scroll pb-5'>
            <Table>
                <TableHead>
                    <TableHeadCell className='min-w-[400px]'>
                        <div className='flex gap-2 items-center'>
                            <AiOutlineUser className='text-base' />
                            Nome do Credor
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-[216px]">
                        <div className="flex gap-2 items-center">
                            <BiLoader className='text-base' />
                            Status
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-[180px]">
                        <div className='flex gap-2 items-center'>
                            <BiPencil className='text-base' />
                            Preço Proposto
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className='min-w-[120px]'>
                        <div className="flex gap-2 items-center">
                            <LuSigma className='text-base' />
                            Comissão
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-50">
                        <div className="flex gap-2 items-center">
                            <IoArrowDownCircle className='text-base' />
                            (R$) Proposta Mínima
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-50">
                        <div className="flex gap-2 items-center">
                            <IoArrowUpCircle className='text-base' />
                            (R$) Proposta Máxima
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-32">
                        <div className="flex gap-2 items-center">
                            <BsCalendar3 className='text-base' />
                            1ª FUP
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-32">
                        <div className="flex gap-2 items-center">
                            <BsCalendar3 className='text-base' />
                            2ª FUP
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-32">
                        <div className="flex gap-2 items-center">
                            <BsCalendar3 className='text-base' />
                            3ª FUP
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-32">
                        <div className="flex gap-2 items-center">
                            <BsCalendar3 className='text-base' />
                            4ª FUP
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-32">
                        <div className="flex gap-2 items-center">
                            <BsCalendar3 className='text-base' />
                            5ª FUP
                        </div>
                    </TableHeadCell>
                </TableHead>

                <TableBody>
                    {isPending ? null : (
                        <React.Fragment>
                            {data?.results?.length > 0 && (
                                <>
                                    {data?.results.map((item: NotionPage, index: number) => (

                                        <TableRow key={item.id} className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group`}>

                                            {/* credor info */}
                                            <TableCell
                                                className="h-full flex items-center gap-2 font-semibold text-[12px]"
                                            >
                                                <div
                                                    title={item.properties.Credor?.title[0].text.content || ''}
                                                    className='relative w-full flex items-center gap-3'>

                                                    <input
                                                        type="checkbox"
                                                        checked={checkedList!.some(target => target.id === item.id)}
                                                        className={`opacity-50 w-[15px] group-hover:opacity-100 ${checkedList!.some(target => target.id === item.id) && '!opacity-100'} h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer`}
                                                        onChange={() => handleSelectRow(item)}
                                                    />

                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            ref={(input) => { if (input) inputCredorRefs.current![index] = input; }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                    handleChangeCreditorName(e.currentTarget.value, index, item.id, inputCredorRefs.current)
                                                                }
                                                            }}
                                                            onBlur={(e) => handleChangeCreditorName(e.currentTarget.value, index, item.id, inputCredorRefs.current)}
                                                            className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                        />
                                                        {/* absolute div that covers the entire cell */}
                                                        {editableLabel !== item.id && (
                                                            <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>

                                                                <React.Fragment>
                                                                    {item.properties.Credor?.title[0].plain_text?.length === 0 ? (
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-100 group-hover:opacity-100 transition-all duration-200'
                                                                            onClick={() => {
                                                                                setEditableLabel!(item.id)
                                                                                handleEditInput(index, inputCredorRefs.current);
                                                                            }}>
                                                                            <div className='flex gap-1 pl-4 text-slate-400'>
                                                                                <PiCursorClick className='text-base' />
                                                                                <span>Clique para adicionar nome</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 text-sm
                                                                    font-semibold pl-[21px]'
                                                                            onClick={() => {
                                                                                setEditableLabel!(item.id)
                                                                                handleEditInput(index, inputCredorRefs.current);
                                                                            }}>
                                                                            <span>
                                                                                {item.properties.Credor?.title[0].text.content}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    <div
                                                                        title='Abrir'
                                                                        className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                        onClick={() => {
                                                                            handleNotionDrawer(item.id)
                                                                        }}>
                                                                        <BiSolidDockLeft className='text-lg'
                                                                        />
                                                                        <span className='text-xs'>Abrir</span>
                                                                    </div>
                                                                    {(item.url && role === 'ativos') && (
                                                                        <a href={item.url} target='_blank' rel='referrer'
                                                                            title='Abrir no Notion'
                                                                            className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                        >
                                                                            <RiNotionFill className='text-lg'
                                                                            />
                                                                            <span className='text-xs'>Notion</span>
                                                                        </a>)}
                                                                </React.Fragment>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </TableCell>

                                            {/* status select */}
                                            <TableCell className="text-center items-center">
                                                <Badge color="teal" size="sm" className="text-center h-6 text-[12px] w-full">
                                                    {fetchingValue === item.id ? (
                                                        <span className='w-[167.6px] pl-3 pr-10 uppercase'>
                                                            Atualizando ...
                                                        </span>
                                                    ) : (
                                                        <select
                                                            title={statusSelectValue || item.properties.Status.status?.name}
                                                            className="text-[12px] w-full text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => {
                                                                handleEditStatus(item.id, e.target.value as statusOficio)
                                                            }}>
                                                            {item.properties.Status.status?.name && (
                                                                <option value={item.properties.Status.status?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                    {statusSelectValue || item.properties.Status.status?.name}
                                                                </option>
                                                            )}
                                                            {ENUM_OFICIOS_LIST.filter((status) => status !== item.properties.Status.status?.name).map((status) => (
                                                                <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </Badge>
                                            </TableCell>

                                            {/* preço proposto */}
                                            <TableCell className="relative font-semibold text-[14px]">
                                                <input
                                                    title={numberFormat(item.properties['Preço Proposto']?.number || 0)}
                                                    type="text"
                                                    ref={(input) => { if (input) inputProposalPriceRefs.current![index] = input; }}
                                                    defaultValue={numberFormat(item.properties['Preço Proposto']?.number || 0)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeProposalPrice(item.id, e.currentTarget.value, index, inputProposalPriceRefs.current)
                                                        }
                                                    }}
                                                    onBlur={(e) =>
                                                        handleChangeProposalPrice(item.id, e.currentTarget.value, index, inputProposalPriceRefs.current)
                                                    }
                                                    className={`text-right w-full px-0 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                                <ImCopy
                                                    title='Copiar valor'
                                                    onClick={() => handleCopyValue(index)}
                                                    className='absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                />
                                            </TableCell>

                                            {/* comissão */}
                                            <TableCell className="font-semibold max-w-[180px] text-[14px] text-right">
                                                {fetchingValue === item.id ? (
                                                    <div className='animate-pulse pt-2'>
                                                        <div className="w-[86px] h-[17px] bg-slate-200 mb-2 rounded-md dark:bg-slate-300"></div>
                                                    </div>
                                                ) : (
                                                    <div title={numberFormat(item.properties['Comissão'].formula?.number || 0)}
                                                        className='text-ellipsis overflow-hidden whitespace-nowrap'>
                                                        {
                                                            numberFormat(item.properties['Comissão'].formula?.number || 0)
                                                        }
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* proposta mínima */}
                                            <TableCell className="font-semibold min-w-50 text-[14px] text-right">
                                                <div title={numberFormat(item.properties['(R$) Proposta Mínima '].formula?.number || 0)}>
                                                    {
                                                        numberFormat(item.properties['(R$) Proposta Mínima '].formula?.number || 0)
                                                    }
                                                </div>
                                            </TableCell>

                                            {/* proposta máxima */}
                                            <TableCell className="font-semibold min-w-50 text-[14px] text-right">
                                                <div title={numberFormat(item.properties['(R$) Proposta Máxima'].formula?.number || 0)}>
                                                    {
                                                        numberFormat(item.properties['(R$) Proposta Máxima'].formula?.number || 0)
                                                    }
                                                </div>
                                            </TableCell>

                                            {/* 1ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <Cleave
                                                    type="text"
                                                    placeholder={fupDateConveter(item.properties['1ª FUP'].date?.start || '')}
                                                    options={{
                                                        date: true,
                                                        datePattern: ['d', 'm', 'Y'],
                                                        delimiter: '/',
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeFupDate(item.id, e.currentTarget.value, '1ª FUP', index)
                                                        }
                                                    }}
                                                    onBlur={(e) => handleChangeFupDate(item.id, e.currentTarget.value, '1ª FUP', index)}
                                                    className={`w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                            </TableCell>

                                            {/* 2ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <Cleave
                                                    type="text"
                                                    placeholder={fupDateConveter(item.properties['2ª FUP '].date?.start || '')}
                                                    options={{
                                                        date: true,
                                                        datePattern: ['d', 'm', 'Y'],
                                                        delimiter: '/',
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeFupDate(item.id, e.currentTarget.value, '2ª FUP ', index)
                                                        }
                                                    }}
                                                    onBlur={(e) => handleChangeFupDate(item.id, e.currentTarget.value, '2ª FUP ', index)}
                                                    className={`w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                            </TableCell>

                                            {/* 3ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <Cleave
                                                    type="text"
                                                    placeholder={fupDateConveter(item.properties['3ª FUP'].date?.start || '')}
                                                    options={{
                                                        date: true,
                                                        datePattern: ['d', 'm', 'Y'],
                                                        delimiter: '/',
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeFupDate(item.id, e.currentTarget.value, '3ª FUP', index)
                                                        }
                                                    }}
                                                    onBlur={(e) => handleChangeFupDate(item.id, e.currentTarget.value, '3ª FUP', index)}
                                                    className={`w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                            </TableCell>

                                            {/* 4ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <Cleave
                                                    type="text"
                                                    placeholder={fupDateConveter(item.properties['4ª FUP'].date?.start || '')}
                                                    options={{
                                                        date: true,
                                                        datePattern: ['d', 'm', 'Y'],
                                                        delimiter: '/',
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeFupDate(item.id, e.currentTarget.value, '4ª FUP', index)
                                                        }
                                                    }}
                                                    onBlur={(e) => handleChangeFupDate(item.id, e.currentTarget.value, '4ª FUP', index)}
                                                    className={`w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                            </TableCell>

                                            {/* 5ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <Cleave
                                                    type="text"
                                                    placeholder={fupDateConveter(item.properties['5ª FUP '].date?.start || '')}
                                                    options={{
                                                        date: true,
                                                        datePattern: ['d', 'm', 'Y'],
                                                        delimiter: '/',
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeFupDate(item.id, e.currentTarget.value, '5ª FUP ', index)
                                                        }
                                                    }}
                                                    onBlur={(e) => handleChangeFupDate(item.id, e.currentTarget.value, '5ª FUP ', index)}
                                                    className={`w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </>
                            )
                            }
                        </React.Fragment>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
