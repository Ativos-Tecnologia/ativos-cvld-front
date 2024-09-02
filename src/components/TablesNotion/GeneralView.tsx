import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '../Tables/TableDefault';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
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
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const GeneralView = ({ isPending, data, checkedList, fetchingValue, handleSelectRow, handleEditTipoOficio, handleChangeCreditorName, editableLabel, setEditableLabel, handleEditInput, handleNotionDrawer, handleCopyValue, handleEditStatus, statusSelectValue }:
    {
        isPending: boolean,
        data: any,
        checkedList: NotionPage[],
        fetchingValue: Record<string, any> | null,
        handleSelectRow: (item: NotionPage) => void,
        handleEditTipoOficio: (page_id: string, oficio: tipoOficio, currentValue: string |undefined) => Promise<void>,
        handleChangeCreditorName: (value: string, index: number, page_id: string, refList: HTMLInputElement[] | null) => Promise<void>,
        editableLabel: string | null;
        setEditableLabel: React.Dispatch<React.SetStateAction<string | null>>;
        handleEditInput: (index: number, refList: HTMLInputElement[] | null) => void;
        handleNotionDrawer: (id: string) => void;
        handleCopyValue: (index: number) => void;
        handleEditStatus: (page_id: string, status: statusOficio, currentValue: string) => Promise<void>;
        statusSelectValue: statusOficio | null;
    }
) => {

    const queryClient = useQueryClient();

    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);
    const usersListRef = useRef<HTMLDivElement[] | null>([]);

    const { data: { role } } = useContext(UserInfoAPIContext);

    const [filters, setFilters] = useState({ credor: ''});
    const [sort, setSort] = useState({ field: null, direction: 'asc' });

    const processedData = React.useMemo(() => {
        let result = data?.results?.filter((item: NotionPage) =>
          item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(filters.credor.toLowerCase())
        );

        if (sort.field) {
            if (sort.field === 'Credor') {
                result = result?.sort((a: any, b: any) => {
                    if (sort.direction === 'asc') {
                        return a.properties.Credor?.title[0]?.text.content.localeCompare(b.properties.Credor?.title[0]?.text.content);
                    } else {
                        return b.properties.Credor?.title[0]?.text.content.localeCompare(a.properties.Credor?.title[0]?.text.content);
                    }
                });
            }
          }
        return result;
      }, [data, filters, sort]);


      const handleSort = (field: any) => {
        setSort(prev => ({
          field,
          direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
      };

        useEffect(() => {
            if (inputCredorRefs.current) {
                processedData?.map((item: NotionPage, index: number) => {
                    const ref = inputCredorRefs.current![index];
                    if (ref) {
                        ref.value = item.properties.Credor?.title[0]?.text.content || '';
                    }
                })
            }
        }, [processedData])

      const handleFilterChange = useCallback((field: any, value: any) => {
        setFilters((prev) => ({
          ...prev,
          [field]: value,
        }));
      }, []);



      useEffect(() => {
        if (filters.credor) {
          queryClient.cancelQueries({ queryKey: ['notion_list'] });
        }

        const timer = setTimeout(() => {
          if (filters.credor) {
            queryClient.invalidateQueries({ queryKey: ['notion_list'] });
          }
        }, 5000);

        return () => clearTimeout(timer);
      }, [filters, queryClient]);


    return (
        <div className='max-w-full overflow-x-scroll pb-5'>
            <div className="flex mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filters.credor}
          onChange={(e) => handleFilterChange('credor', e.target.value)}
          className="max-w-md rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
        />

      </div>
            <Table>
                <TableHead>

                    <TableHeadCell className="w-[120px]">
                        <div className='flex gap-2 items-center'>
                            <IoDocumentTextOutline className='text-base' />
                            Oficio
                        </div>
                    </TableHeadCell>
                    <TableHeadCell>
                    <div className='flex gap-2 items-center'>

                    <Button className='flex gap-2 items-center' variant="ghost" onClick={() => handleSort('Credor')}>
                    <AiOutlineUser className='text-base' /> Nome do Credor
                        {sort.field === 'Credor' ? (
                        sort.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                        ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                    </div>
            </TableHeadCell>
                    {role === 'ativos' && (
                        <TableHeadCell className="">
                            <div className="flex gap-2 items-center">
                                <PiListBulletsBold className='text-base' />
                                Usuários
                            </div>
                        </TableHeadCell>
                    )}
                    <TableHeadCell className="min-w-[150px]">
                        <div className="flex gap-2 items-center">
                            <LiaCoinsSolid className='text-base' />
                            Valor Líquido
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="">
                        <div className="flex gap-2 items-center">
                            <BiLoader className='text-base' />
                            Status
                        </div>
                    </TableHeadCell>

                </TableHead>
                <TableBody className=''>
                    {isPending ? (
                        null
                    ) : (
                        <React.Fragment>
                            {data?.results?.length > 0 && (
                                <>
                                    {processedData?.map((item: NotionPage, index: number) => (

                                        <TableRow key={item.id} className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group`}>

                                            <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                <div className='flex items-center justify-center gap-3'>
                                                    <CustomCheckbox
                                                        check={checkedList!.some(target => target.id === item.id)}
                                                        callbackFunction={() => handleSelectRow(item)}
                                                    />
                                                    <Badge color="indigo" size="sm" className={`w-[139px] h-7 text-[12px]`}>
                                                        {(fetchingValue?.page_id === item?.id && fetchingValue.tipo === 'tipo_oficio') ? (
                                                            <span className='w-[139px] pl-3 uppercase'>
                                                                Atualizando ...
                                                            </span>
                                                        ) : (
                                                            <select className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0" onChange={(e) => handleEditTipoOficio(item.id, e.target.value as tipoOficio, (item.properties.Tipo.select?.name))}>
                                                                {item?.properties?.Tipo.select?.name && (
                                                                    <option value={item.properties.Tipo.select?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                        {item.properties.Tipo.select?.name}
                                                                    </option>
                                                                )}
                                                                {ENUM_TIPO_OFICIOS_LIST.filter((status) => status !== item.properties?.Tipo.select?.name).map((status) => (
                                                                    <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell title={item?.properties?.Credor?.title[0]?.text.content || ''}
                                                className="relative h-full min-w-100 flex items-center gap-2 font-semibold text-[12px]"
                                            >
                                                <input
                                                    type="text"
                                                    ref={(input) => { if (input) inputCredorRefs.current![index] = input; }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                            handleChangeCreditorName(e.currentTarget.value, index, item.id, inputCredorRefs.current)
                                                        }
                                                    }}
                                                    className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                />
                                                {/* absolute div that covers the entire cell */}
                                                {editableLabel !== item.id && (
                                                    <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>

                                                        <React.Fragment>
                                                            {item.properties.Credor?.title[0]?.plain_text?.length === 0 ? (
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
                                                                        {item.properties.Credor?.title[0]?.text.content}
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

                                            </TableCell>
                                            {role === 'ativos' && (
                                                <TableCell className=" font-semibold text-[14px] min-w-[170px] max-w-[170px] overflow-hidden">
                                                    <div
                                                        ref={(input) => { if (input) usersListRef.current![index] = input; }}
                                                        className='flex items-center gap-1 overflow-x-scroll custom-scrollbar pb-0.5'>
                                                        {item.properties["Usuário"].multi_select?.map((user: any) => (
                                                            <span
                                                                key={user.id}
                                                                style={{
                                                                    backgroundColor: notionColorResolver(user.color)
                                                                }}
                                                                className='px-2 py-0 text-white rounded'>
                                                                {user.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell className="relative font-semibold text-[14px] text-right">
                                                <div>
                                                    {numberFormat(item.properties['Valor Líquido'].formula?.number || 0)}
                                                    <ImCopy
                                                        title='Copiar valor'
                                                        onClick={() => handleCopyValue(index)}
                                                        className='absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center items-center ">
                                                <Badge color="teal" size="sm" className="text-center h-7 text-[12px] w-48">
                                                    {(fetchingValue?.page_id === item?.id && fetchingValue.tipo === 'status_oficio') ? (
                                                        <span className='w-[192px] pl-3 pr-10 uppercase'>
                                                            Atualizando ...
                                                        </span>
                                                    ) : (
                                                        <select className="text-[12px] w-44 text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => {
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
                                                    )}
                                                </Badge>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </React.Fragment>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default GeneralView