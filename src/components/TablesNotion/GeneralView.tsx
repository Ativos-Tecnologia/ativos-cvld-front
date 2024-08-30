import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '../Tables/TableDefault';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { AiOutlineCopy, AiOutlineUser } from 'react-icons/ai';
import { LiaCoinsSolid } from 'react-icons/lia';
import { BiLoader, BiSolidDockLeft } from 'react-icons/bi';
import { NotionPage } from '@/interfaces/INotion';
import { Badge } from 'flowbite-react';
import tipoOficio from '@/enums/tipoOficio.enum';
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { PiCursorClick, PiListBulletsBold } from 'react-icons/pi';
import { RiNotionFill } from 'react-icons/ri';
import { ImCopy } from 'react-icons/im';
import numberFormat from '@/functions/formaters/numberFormat';
import statusOficio from '@/enums/statusOficio.enum';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import CustomCheckbox from '../CrmUi/Checkbox';
import { CellerChartBar } from '../ui/barChart';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    createColumnHelper,
} from '@tanstack/react-table'

export type Item = {
    id: string
    properties: {
        Tipo: { select: { name: string } }
        Credor: { title: [{ text: { content: string } }] }
        'Valor Líquido': { formula: { number: number } }
        Status: { status: { name: string } }
        Usuário: { multi_select: Array<{ id: string; name: string; color: string }> }
    }
    url?: string
}

type Props = {
    data: NotionPage[]
    checkedList: NotionPage[]
    handleSelectRow: (item: NotionPage) => void
    handleEditTipoOficio: (id: string, value: tipoOficio) => void
    handleChangeCreditorName: (value: string, index: number, page_id: string, refList: HTMLInputElement[] | null) => void
    handleNotionDrawer: (id: string) => void
    handleCopyValue: (index: number) => void
    handleEditStatus: (id: string, value: statusOficio) => void
    handleEditInput: (index: number, refList: HTMLInputElement[] | null) => void
    role: string
    editableLabel: string | null
    setEditableLabel: React.Dispatch<React.SetStateAction<string | null>>
    fetchingValue: string | null
}

export const GeneralView: React.FC<Props> = ({ data, checkedList, handleSelectRow, handleNotionDrawer, handleEditStatus, handleCopyValue, handleChangeCreditorName, role, editableLabel, setEditableLabel, fetchingValue,handleEditInput, handleEditTipoOficio }
) => {

    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);
    const columnHelper = createColumnHelper<NotionPage>()


    const columns = useMemo(() => [
        columnHelper.accessor('properties.Tipo', {
            header: 'Tipo',
            cell: ({ row }) => (
                <div className='flex items-center justify-center gap-3'>
                    <CustomCheckbox
                        check={checkedList.some(target => target.id === row.original.id)}
                        callbackFunction={() => handleSelectRow(row.original as unknown as NotionPage)}
                    />
                    <Badge color="indigo" size="sm" className={`w-[139px] h-7 text-[12px]`}>
                        {fetchingValue === row.original.id ? (
                            <span className='w-[139px] pl-3 uppercase'>
                                Atualizando ...
                            </span>
                        ) : (
                            <select
                                className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0"
                                onChange={(e) => handleEditTipoOficio(row.original.id, e.target.value as tipoOficio)}
                                value={row.original.properties?.Tipo.select?.name}
                            >
                                {ENUM_TIPO_OFICIOS_LIST.map((status) => (
                                    <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                        {status}
                                    </option>
                                ))}
                            </select>
                        )}
                    </Badge>
                </div>
            ),
        }),
        columnHelper.accessor('properties.Credor', {
            header: 'Credor',
            cell: ({ row, cell }) => (
                <div className="relative h-full min-w-100 flex items-center gap-2 font-semibold text-[12px]">
                    <input
                        type="text"
                        ref={(input) => { if (input) inputCredorRefs.current![row.index] = input; }}

                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                handleChangeCreditorName(inputCredorRefs.current![row.index].value, row.index, row.original.id, inputCredorRefs.current);
                            }
                        }}
                        onBlur={(e) => handleChangeCreditorName(e.target.value, row.index, row.original.id, inputCredorRefs.current)}

                        className={`${editableLabel === row.original.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                    />
                    {editableLabel !== row.original.id && (
                        <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>
                            <React.Fragment>
                                {cell.getValue()?.title[0].plain_text?.length === 0 ? (
                                    <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-100 group-hover:opacity-100 transition-all duration-200'
                                        onClick={() => {
                                            setEditableLabel!(row.original.id)
                                            handleEditInput(row.index, inputCredorRefs.current);
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
                                            setEditableLabel!(row.original.id)
                                            handleEditInput(row.index, inputCredorRefs.current);
                                        }}>
                                        <span>
                                            {cell.getValue()?.title[0].text.content}
                                        </span>
                                    </div>
                                )}

                                <div
                                    title='Abrir'
                                    className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                    onClick={() => {
                                        handleNotionDrawer(row.original.id)
                                    }}>
                                    <BiSolidDockLeft className='text-lg'
                                    />
                                    <span className='text-xs'>Abrir</span>
                                </div>
                                {row.original.url && row.original.url.length > 0 && role === 'ativos' && (
                                    <a href={row.original.url} target='_blank' rel='referrer'
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
            ),
        }),
        columnHelper.accessor('properties.Valor Líquido', {
            header: 'Valor Líquido',
            cell: ({ cell, row }) => (
                <div className="flex items-center justify-center gap-3">
                    <span className="text-[12px] font-semibold">{numberFormat(cell.getValue()?.formula?.number || 0)}</span>
                    <button
                        onClick={() => handleCopyValue(row.index)}
                        className="flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-form-strokedark rounded-md transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <AiOutlineCopy className="w-4 h-4" />
                    </button>
                </div>
            ),
        }),
        columnHelper.accessor('properties.Status', {
            header: 'Status',
            cell: ({ cell, row }) => (
                <div className="flex items-center justify-center gap-3">
                    <Badge color="indigo" size="sm" className="w-[139px] h-7 text-[12px]">
                        <select
                            className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0"
                            onChange={(e) => handleEditStatus(row.original.id, e.target.value as statusOficio)}
                            value={cell.getValue()?.status?.name}
                        >
                            {ENUM_OFICIOS_LIST.map((status) => (
                                <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                    {status}
                                </option>
                            ))}
                        </select>
                    </Badge>
                </div>
            ),
        }),
    ], [checkedList, columnHelper, editableLabel, fetchingValue, handleChangeCreditorName, handleCopyValue, handleEditInput, handleEditStatus, handleEditTipoOficio, handleNotionDrawer, handleSelectRow, role, setEditableLabel])


    useEffect(() => {
        if (inputCredorRefs.current) {
            data?.map((item: NotionPage, index: number) => {
                const ref = inputCredorRefs.current![index];
                if (ref) {
                    ref.value = item.properties.Credor?.title[0]?.text.content || '';
                }
            })
        }
    }, [data])


    const usersListRef = useRef<HTMLDivElement[] | null>([]);

    // const { data: { role } } = useContext(UserInfoAPIContext);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })



    return (
        <div className='max-w-full overflow-x-scroll pb-5'>
            {/* <CellerChartBar /> */}
            <Table>
                <TableHead>
                    {table?.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHeadCell key={header.id}>
                                    <div className="flex gap-2 items-center">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </div>
                                </TableHeadCell>
                            ))}
                        </TableRow>
                    ))}

                </TableHead>
                <TableBody className=''>
                    {table?.getRowModel().rows.map(row => (

                        <TableRow key={row.id}>
                            {row?.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default GeneralView