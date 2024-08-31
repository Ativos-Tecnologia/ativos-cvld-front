import React, { useContext, useEffect, useRef } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '../Tables/TableDefault'
import { AiOutlineUser } from 'react-icons/ai'
import { BiLoader, BiSolidDockLeft } from 'react-icons/bi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { LiaCoinsSolid } from 'react-icons/lia'
import { NotionPage } from '@/interfaces/INotion'
import { PiCursorClick } from 'react-icons/pi'
import { RiNotionFill } from 'react-icons/ri'
import statusOficio from '@/enums/statusOficio.enum'
import { Badge } from 'flowbite-react'
import tipoOficio from '@/enums/tipoOficio.enum'
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants'
import { ImCopy } from 'react-icons/im'
import numberFormat from '@/functions/formaters/numberFormat'
import { UserInfoAPIContext } from '@/context/UserInfoContext'
import CustomCheckbox from '../CrmUi/Checkbox'

export const OfficeTypeAndValue = ({ isPending, data, checkedList, editableLabel, setEditableLabel, statusSelectValue, oficioSelectValue, handleSelectRow, handleNotionDrawer,
    handleChangeCreditorName, handleEditInput, handleEditStatus, handleEditTipoOficio, handleCopyValue
}:
    {
        isPending: boolean,
        data: any,
        checkedList: NotionPage[],
        editableLabel: string | null;
        setEditableLabel: React.Dispatch<React.SetStateAction<string | null>>;
        statusSelectValue: statusOficio | null;
        oficioSelectValue: tipoOficio | null;
        handleNotionDrawer: (id: string) => void;
        numberFormat: (number: number) => string;
        handleSelectRow: (item: NotionPage) => void;
        handleChangeCreditorName: (value: string, index: number, page_id: string, refList: HTMLInputElement[] | null) => Promise<void>;
        handleEditInput: (index: number, refList: HTMLInputElement[] | null) => void;
        handleEditStatus: (page_id: string, status: statusOficio, currentValue: string) => Promise<void>;
        handleEditTipoOficio: (page_id: string, status: tipoOficio, currentValue: string | undefined) => Promise<void>;
        handleCopyValue: (index: number) => void;
    }
) => {

    /* ----> refs <----- */
    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);

    const { data: { role } } = useContext(UserInfoAPIContext);

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
        <div className='max-w-full overflow-x-scroll pb-5'>
            <Table>
                <TableHead>
                    <TableHeadCell className='w-[400px]'>
                        <div className='flex gap-2 items-center'>
                            <AiOutlineUser className='text-base' />
                            Nome do Credor
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="w-[216px]">
                        <div className="flex gap-2 items-center">
                            <BiLoader className='text-base' />
                            Status
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="w-[150px]">
                        <div className='flex gap-2 items-center'>
                            <IoDocumentTextOutline className='text-base' />
                            Oficio
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-[180px]">
                        <div className="flex gap-2 items-center">
                            <LiaCoinsSolid className='text-base' />
                            Valor Líquido (Com reserva dos honorários)
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
                                            <TableCell title={item.properties.Credor?.title[0].text.content || ''}
                                                className="h-full flex items-center gap-2 font-semibold text-[12px]"
                                            >
                                                <div className='relative w-full flex items-center gap-3'>

                                                    <CustomCheckbox
                                                        check={checkedList!.some(target => target.id === item.id)}
                                                        callbackFunction={() => handleSelectRow(item)}
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
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200'
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
                                                <Badge color="teal" size="sm" className="text-center text-[12px] w-full">
                                                    <select className="text-[12px] w-full text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => {
                                                        handleEditStatus(item.id, e.target.value as statusOficio, item.properties.Status.status!.name)
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
                                                </Badge>
                                            </TableCell>

                                            {/* Ofício tipo */}
                                            <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                                                    <select className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0" onChange={(e) => handleEditTipoOficio(item.id, e.target.value as tipoOficio, item.properties.Tipo.select?.name)}>
                                                        {item.properties.Tipo.select?.name && (
                                                            <option value={item.properties.Tipo.select?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {oficioSelectValue || item.properties.Tipo.select?.name}
                                                            </option>
                                                        )}
                                                        {ENUM_TIPO_OFICIOS_LIST.filter((status) => status !== item.properties.Tipo.select?.name).map((status) => (
                                                            <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Badge>
                                            </TableCell>

                                            {/* Valor líquido com reserva dos honorários */}
                                            <TableCell className="font-semibold text-[14px]">
                                                <div className="relative">
                                                    {numberFormat(item.properties['Valor Líquido (Com Reserva dos Honorários)'].formula?.number || 0)}
                                                    <ImCopy
                                                        title='Copiar valor'
                                                        onClick={() => handleCopyValue(index)}
                                                        className='absolute top-1/2 -translate-y-1/2 left-28 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                    />
                                                </div>
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
