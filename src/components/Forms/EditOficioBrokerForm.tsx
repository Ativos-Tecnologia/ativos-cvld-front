'use client';
import { tribunais } from '@/constants/tribunais';
import { BrokersContext } from '@/context/BrokersContext';
import tipoOficio from '@/enums/tipoOficio.enum';
import { NotionNumberFormater } from '@/functions/formaters/notionNumberFormater';
import { NotionPage } from '@/interfaces/INotion';
import { CvldFormInputsProps } from '@/types/cvldform';
import Cleave from 'cleave.js/react';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BiCheck, BiX } from 'react-icons/bi';
import CustomCheckbox from '../CrmUi/Checkbox';
import { estados } from '@/constants/estados';
import { AiOutlineLoading } from 'react-icons/ai';
import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { useMutation } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { verifyUpdateFields } from '@/functions/verifiers/verifyValues';
import numberFormat from '@/functions/formaters/numberFormat';
import { CPFAndCNPJInput } from '../CrmUi/CPFAndCNPFInput';
import UseMySwal from '@/hooks/useMySwal';
import { isCPFOrCNPJValid } from '@/functions/verifiers/isCPFOrCNPJValid';

interface IFormBroker {
    mainData: NotionPage | null;
}

/**
 * Componente de formulário para edição do oficio (dashbrokers)
 *
 * @param {IFormBroker} props - Interface com propriedades do componente
 * @returns {React.JSX.Element} - O formulário renderizado
 *
 */

const EditOficioBrokerForm = ({ mainData }: IFormBroker): React.JSX.Element => {
    const MySwal = UseMySwal();

    /* ====> dados inicias do formulário */
    const [defaultFormValues, setDefaultFormValues] = useState<any>(null);
    const [CPFOrCNPJValue, setCPFOrCNPJValue] = useState<string>('');

    /* ====> form imports <==== */
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        control,
        watch,
    } = useForm<Partial<CvldFormInputsProps>>();
    const enumTipoOficiosList = Object.values(tipoOficio);

    const { editModalId, setEditModalId, setIsFetchAllowed, fetchDetailCardData } =
        useContext(BrokersContext);
    const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

    // mutation de alteração dos dados do oficio
    const updateOficio = useMutation({
        mutationFn: async (data) => {
            const req = await api.patch(`/api/lead-magnet/update/${mainData!.id}/`, data);
            return req.status;
        },
        onMutate: async () => {
            setIsSavingEdit(true);
            setIsFetchAllowed(false);
        },
        onError: () => {
            toast.error('Erro ao atualizar ofício', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiX className="fill-red-500 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });
        },
        onSuccess: async () => {
            await fetchDetailCardData(mainData!.id);
            setEditModalId(null);
            toast.success('Dados do ofício atualizados.', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiCheck className="fill-green-400 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });
        },
        onSettled: () => {
            setIsSavingEdit(false);
            setIsFetchAllowed(true);
        },
    });

    // função para alterar os dados do oficio (submit)
    async function onSubmit(data: any) {
        if (verifyUpdateFields(defaultFormValues, data)) {
            data.need_to_recalculate_proposal = true;
        } else {
            data.need_to_recalculate_proposal = false;
        }

        if (typeof data.percentual_a_ser_adquirido === 'string') {
            data.percentual_a_ser_adquirido = Number(
                (
                    data.percentual_a_ser_adquirido.replace(/[^0-9,]/g, '').replace(',', '.') / 100
                ).toFixed(4),
            );
        }

        if (!isCPFOrCNPJValid(CPFOrCNPJValue)) {
            MySwal.fire({
                title: 'Ok, Houston...Temos um problema!',
                text: 'O CPF ou CNPJ inserido é inválido. Por favor, tente novamente.',
                icon: 'error',
                showConfirmButton: true,
            });
            return;
        }

        data.percentual_de_honorarios /= 100;

        if (typeof data.valor_principal === 'string') {
            data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
            data.valor_principal = parseFloat(data.valor_principal);
        }

        if (typeof data.valor_juros === 'string') {
            data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
            data.valor_juros = parseFloat(data.valor_juros);
        }

        if (typeof data.valor_pss) {
            data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
            data.valor_pss = parseFloat(data.valor_pss);
        }

        if (!data.ir_incidente_rra) {
            data.numero_de_meses = 0;
        }

        if (!data.incidencia_pss) {
            data.valor_pss = 0;
        }

        if (!data.data_limite_de_atualizacao_check && data.data_limite_de_atualizacao) {
            delete data.data_limite_de_atualizacao;
        }

        await updateOficio.mutateAsync(data);
    }

    useEffect(() => {
        if (mainData) {
            const t = Number(
                (mainData.properties['Percentual a ser adquirido'].number! * 100).toFixed(2),
            );
            const tFormatado = t.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            setValue('tipo_do_oficio', mainData.properties['Tipo'].select?.name || 'PRECATÓRIO');
            setValue('natureza', mainData.properties['Natureza'].select?.name || 'NÃO TRIBUTÁRIA');
            setValue('esfera', mainData.properties['Esfera'].select?.name || 'FEDERAL');
            setValue('regime', mainData.properties['Regime'].select?.name || 'GERAL');
            setValue('tribunal', mainData.properties['Tribunal'].select?.name || 'STJ');
            setValue(
                'valor_principal',
                numberFormat(mainData.properties['Valor Principal'].number || 0),
            );
            setValue('valor_juros', numberFormat(mainData.properties['Valor Juros'].number || 0));
            setValue('data_base', mainData.properties['Data Base'].date?.start || '');
            setValue(
                'data_requisicao',
                mainData.properties['Data do Recebimento'].date?.start || '',
            );
            setValue(
                'valor_aquisicao_total',
                mainData.properties['Percentual a ser adquirido'].number! === 1,
            );
            // Exemplo: 30.819.999.999.999.997 --> 30.82
            setValue('percentual_a_ser_adquirido', tFormatado);
            setValue(
                'ja_possui_destacamento',
                mainData.properties['Honorários já destacados?'].checkbox,
            );
            setValue(
                'percentual_de_honorarios',
                mainData.properties['Percentual de Honorários Não destacados'].number! * 100 || 0,
            );
            setValue(
                'nao_incide_selic_no_periodo_db_ate_abril',
                mainData.properties['Incide Selic Somente Sobre Principal'].checkbox,
            );
            setValue('incidencia_rra_ir', mainData.properties['Incidencia RRA/IR'].checkbox);
            setValue('ir_incidente_rra', mainData.properties['IR Incidente sobre RRA'].checkbox);
            setValue('incidencia_pss', mainData.properties['PSS'].number! > 0);
            setValue('valor_pss', mainData.properties['PSS'].number || 0);
            setValue('numero_de_meses', mainData.properties['Meses RRA'].number || 0);
            setValue('credor', mainData.properties['Credor'].title[0]?.text.content || '');
            setValue(
                'cpf_cnpj',
                mainData.properties['CPF/CNPJ'].rich_text?.[0]?.text.content || '',
            );
            setValue('especie', mainData?.properties?.['Espécie'].select?.name || 'Principal');
            setValue(
                'npu',
                mainData.properties['NPU (Precatório)'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'npu_originario',
                mainData?.properties?.['NPU (Originário)'].rich_text?.[0]?.text.content || '',
            );
            setValue('ente_devedor', mainData.properties['Ente Devedor'].select?.name || '');
            setValue(
                'estado_ente_devedor',
                mainData.properties['Estado do Ente Devedor'].select?.name || '',
            );
            setValue('juizo_vara', mainData.properties['Juízo'].rich_text?.[0]?.text.content || '');
            setValue('status', mainData.properties['Status'].status?.name || '');
            setValue('upload_notion', true);

            if (mainData.properties['CPF/CNPJ'].rich_text?.[0]?.text.content) {
                setCPFOrCNPJValue(mainData.properties['CPF/CNPJ'].rich_text?.[0]?.text.content);
            }

            // setando valores iniciais no formulário
            setDefaultFormValues(watch());
        }
    }, [mainData]);

    return (
        <div
            className={`absolute left-0 top-0 z-3 w-full bg-white dark:bg-boxdark ${editModalId === mainData?.id ? 'max-h-full overflow-y-scroll rounded-md border border-snow' : 'max-h-0 overflow-hidden'} grid grid-cols-2 gap-2 transition-all duration-300`}
        >
            <div className="col-span-2 p-5">
                <h2 className="text-center text-xl font-medium">Edite as informações do ofício</h2>

                {/* ----> close button <---- */}
                <button
                    onClick={() => setEditModalId(null)}
                    className="absolute right-0 top-0 rounded-bl-sm p-1 transition-colors duration-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                    <BiX className="text-2xl" />
                </button>
                {/* ----> end close button <---- */}

                {/* TODO: possibilidade de implementar um componente para esse form */}
                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">
                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="tipo"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Tipo
                            </label>

                            <select
                                defaultValue={'PRECATÓRIO'}
                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                {...register('tipo_do_oficio')}
                            >
                                {enumTipoOficiosList.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            {/* <ShadSelect
                                            name="tipo_do_oficio"
                                            control={control}
                                            defaultValue={enumTipoOficiosList[0]}
                                        >
                                            {enumTipoOficiosList.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </ShadSelect> */}
                        </div>

                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="natureza"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Natureza
                            </label>

                            <select
                                defaultValue={'NÃO TRIBUTÁRIA'}
                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                {...register('natureza')}
                            >
                                <option value="NÃO TRIBUTÁRIA">não tributária</option>
                                <option value="TRIBUTÁRIA">tributária</option>
                            </select>

                            {/* <ShadSelect
                                            name="natureza"
                                            control={control}
                                            defaultValue={"NÃO TRIBUTÁRIA"}

                                        // className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-xs font-bold dark:border-strokedark dark:bg-boxdark uppercase"
                                        >
                                            <SelectItem
                                                defaultValue="NÃO TRIBUTÁRIA"
                                                value="NÃO TRIBUTÁRIA"
                                            >
                                                Não Tributária
                                            </SelectItem>
                                            <SelectItem value="TRIBUTÁRIA">Tributária</SelectItem>
                                        </ShadSelect> */}
                        </div>

                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="esfera"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Esfera
                            </label>

                            <select
                                defaultValue={'FEDERAl'}
                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                {...register('esfera')}
                            >
                                <option value="FEDERAL">Federal</option>
                                <option value="ESTADUAL">Estadual</option>
                                <option value="MUNICIPAL">Municipal</option>
                            </select>
                        </div>
                        {watch('esfera') !== 'FEDERAL' && watch('esfera') !== undefined && (
                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="regime"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Regime
                                </label>
                                <select
                                    defaultValue={''}
                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                    {...register('regime')}
                                >
                                    <option value="GERAL">geral</option>
                                    <option value="ESPECIAL">especial</option>
                                </select>
                                {/* <ShadSelect name="regime" control={control} defaultValue="GERAL">
                                                <SelectItem value="GERAL">GERAL</SelectItem>
                                                <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                                            </ShadSelect> */}
                            </div>
                        )}

                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="tribunal"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Tribunal
                            </label>

                            <select
                                defaultValue={''}
                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                {...register('tribunal')}
                            >
                                {tribunais.map((tribunal) => (
                                    <option key={tribunal.id} value={tribunal.id}>
                                        {tribunal.nome}
                                    </option>
                                ))}
                            </select>
                            {/* <ShadSelect
                                            name="tribunal"
                                            control={control}
                                            defaultValue={tribunais[0].nome}
                                        >
                                            {tribunais.map((tribunal) => (
                                                <SelectItem key={tribunal.id} value={tribunal.id}>
                                                    {tribunal.nome}
                                                </SelectItem>
                                            ))}
                                        </ShadSelect> */}
                        </div>

                        <div className="relative flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="valor_principal"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Valor Principal
                            </label>
                            <Controller
                                name="valor_principal"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    min: {
                                        value: 0.01,
                                        message: 'O valor deve ser maior que 0',
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Cleave
                                            {...field}
                                            className={`w-full rounded-md border-stroke ${error ? 'border-red' : 'dark:border-strokedark'} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
                                            options={{
                                                numeral: true,
                                                numeralThousandsGroupStyle: 'thousand',
                                                numeralDecimalScale: 2,
                                                numeralDecimalMark: ',',
                                                delimiter: '.',
                                                prefix: 'R$ ',
                                                rawValueTrimPrefix: true,
                                            }}
                                        />
                                        {error && (
                                            <span className="absolute right-2 top-8.5 text-xs font-medium text-red">
                                                {error.message}
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="relative flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="valor_juros"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Juros
                            </label>
                            <Controller
                                name="valor_juros"
                                control={control}
                                defaultValue={0}
                                rules={{
                                    min: {
                                        value: 0.01,
                                        message: 'O valor deve ser maior que 0',
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Cleave
                                            {...field}
                                            className={`w-full rounded-md border-stroke ${error ? 'border-red' : 'dark:border-strokedark'} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
                                            options={{
                                                numeral: true,
                                                numeralPositiveOnly: true,
                                                numeralThousandsGroupStyle: 'thousand',
                                                numeralDecimalScale: 2,
                                                numeralDecimalMark: ',',
                                                delimiter: '.',
                                                prefix: 'R$ ',
                                                rawValueTrimPrefix: true,
                                            }}
                                        />
                                        {error && (
                                            <span className="absolute right-2 top-8.5 text-xs font-medium text-red">
                                                {error.message}
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <div className="relative flex flex-col justify-between">
                                <label
                                    htmlFor="data_base"
                                    className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Data Base
                                </label>
                                <input
                                    type="date"
                                    id="data_base"
                                    className={`${errors.data_base && '!border-red !ring-0'} w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                    {...register('data_base', {
                                        required: 'Campo obrigatório',
                                    })}
                                    aria-invalid={errors.data_base ? 'true' : 'false'}
                                />
                                {errors.data_base && (
                                    <span className="absolute right-8.5 top-7.5 text-xs font-medium text-red">
                                        campo obrigatório
                                    </span>
                                )}
                            </div>
                        </div>

                        {watch('tipo_do_oficio') !== 'CREDITÓRIO' ? (
                            <div className="flex flex-col gap-2 2xsm:col-span-2 2xsm:mt-3 sm:col-span-1 sm:mt-0">
                                <div className="relative flex flex-col justify-between">
                                    <label
                                        htmlFor="data_requisicao"
                                        className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Data de Requisição / Recebimento
                                    </label>
                                    <input
                                        type="date"
                                        id="data_requisicao"
                                        className={`${errors.data_requisicao && '!border-red !ring-0'} w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                        {...register('data_requisicao', {
                                            required: 'Campo obrigatório',
                                        })}
                                    />
                                    {errors.data_requisicao && (
                                        <span className="absolute right-8.5 top-7.5 text-xs font-medium text-red">
                                            campo obrigatório
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="col-span-1 hidden sm:block"></div>
                        )}

                        {watch('esfera') !== 'FEDERAL' && watch('esfera') !== undefined && (
                            <div className="col-span-1"></div>
                        )}

                        <div className={`col-span-2 flex max-h-6 items-center gap-2 md:col-span-1`}>
                            <CustomCheckbox
                                check={watch('valor_aquisicao_total')}
                                id={'valor_aquisicao_total'}
                                defaultChecked
                                register={register('valor_aquisicao_total')}
                            />

                            <label
                                htmlFor="valor_aquisicao_total"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Aquisição total
                            </label>
                        </div>

                        {/* ====> label PERCENTUAL DE AQUISIÇÃO <==== */}
                        {watch('valor_aquisicao_total') === false ? (
                            <div className="mt-1 flex flex-col gap-2 overflow-hidden 2xsm:col-span-2 md:col-span-1">
                                <label
                                    htmlFor="percentual_a_ser_adquirido"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Percentual de aquisição (%)
                                </label>
                                {/* <input
                                    type="text"
                                    id="percentual_a_ser_adquirido"
                                    defaultValue={100}
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                    min={0}
                                    {...register("percentual_a_ser_adquirido", {
                                        required: "Campo obrigatório",
                                        setValueAs: (value) => {
                                            return parseInt(value);
                                        },
                                    })}
                                /> */}

                                <Controller
                                    name="percentual_a_ser_adquirido"
                                    control={control}
                                    defaultValue={100}
                                    rules={{
                                        min: {
                                            value: 1,
                                            message: 'O valor deve ser maior que 0',
                                        },
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                className={`w-full rounded-md border-stroke ${error ? 'border-red' : 'dark:border-strokedark'} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
                                                options={{
                                                    numeral: true,
                                                    numeralThousandsGroupStyle: 'none',
                                                    numeralDecimalMark: ',',
                                                    prefix: '%',
                                                    tailPrefix: true,
                                                    rawValueTrimPrefix: true,
                                                }}
                                            />
                                            {error && (
                                                <span className="absolute right-2 top-8.5 text-xs font-medium text-red">
                                                    {error.message}
                                                </span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="col-span-1 hidden md:block"></div>
                        )}
                        {/* ====> end label PERCENTUAL DE AQUISIÇÃO <==== */}

                        {(watch('especie') === 'Principal' || watch('especie') === undefined) && (
                            <div className="col-span-2 flex w-full flex-col justify-between gap-4 sm:flex-row">
                                <div
                                    className={`flex flex-row ${watch('ja_possui_destacamento') ? 'items-center' : 'items-start'} w-full gap-2 2xsm:col-span-2 sm:col-span-1`}
                                >
                                    <CustomCheckbox
                                        check={watch('ja_possui_destacamento')}
                                        id={'ja_possui_destacamento'}
                                        register={register('ja_possui_destacamento')}
                                        defaultChecked
                                    />

                                    <label
                                        htmlFor="ja_possui_destacamento"
                                        className={`${!watch('ja_possui_destacamento') && 'mt-1'} font-nexa text-xs font-semibold uppercase text-meta-5`}
                                    >
                                        Já possui destacamento de honorários?
                                    </label>
                                </div>
                                {watch('ja_possui_destacamento') === false && (
                                    <div className=" flex w-full flex-row justify-between gap-4 sm:col-span-2">
                                        <div className="flex w-full flex-col gap-2 sm:col-span-1">
                                            <label
                                                htmlFor="percentual_de_honorarios"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Percentual
                                            </label>
                                            <input
                                                type="number"
                                                id="percentual_de_honorarios"
                                                defaultValue={30}
                                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                {...register('percentual_de_honorarios', {})}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div
                            className={`col-span-2 flex items-center gap-2 md:col-span-1 ${watch('data_base')! < '2021-12-01' && watch('natureza') !== 'TRIBUTÁRIA' ? '' : 'hidden'}`}
                        >
                            <CustomCheckbox
                                check={watch('incidencia_juros_moratorios')}
                                id={'incidencia_juros_moratorios'}
                                defaultChecked
                                register={register('incidencia_juros_moratorios')}
                            />

                            {/* <input
                  type="checkbox"
                  id="incidencia_juros_moratorios"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  defaultChecked
                  {...register("incidencia_juros_moratorios")}
                /> */}
                            <label
                                htmlFor="incidencia_juros_moratorios"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Juros de Mora fixados em sentença
                            </label>
                        </div>
                        <div
                            className={`col-span-2 flex items-center gap-2 ${watch('data_base')! > '2021-12-01' && watch('natureza') !== 'TRIBUTÁRIA' ? '' : 'hidden'}`}
                        >
                            <CustomCheckbox
                                check={watch('nao_incide_selic_no_periodo_db_ate_abril')}
                                id={'nao_incide_selic_no_periodo_db_ate_abril'}
                                register={register('nao_incide_selic_no_periodo_db_ate_abril')}
                            />

                            {/* <input
                  type="checkbox"
                  id="nao_incide_selic_no_periodo_db_ate_abril"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  defaultChecked
                  {...register("nao_incide_selic_no_periodo_db_ate_abril")}
                /> */}
                            <label
                                htmlFor="nao_incide_selic_no_periodo_db_ate_abril"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                SELIC somente sobre o principal
                            </label>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <CustomCheckbox
                                check={watch('incidencia_rra_ir')}
                                id={'incidencia_rra_ir'}
                                defaultChecked
                                register={register('incidencia_rra_ir')}
                            />
                            {/* <input
                type="checkbox"
                id="incidencia_rra_ir"
                className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                defaultChecked
                {...register("incidencia_rra_ir")}
              /> */}
                            <label
                                htmlFor="incidencia_rra_ir"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Incidência de IR
                            </label>
                        </div>
                        {watch('natureza') === 'TRIBUTÁRIA' ||
                        watch('incidencia_rra_ir') === false ? null : (
                            <div className={`flex h-6 gap-2 2xsm:col-span-2 md:col-span-1`}>
                                <CustomCheckbox
                                    check={watch('ir_incidente_rra')}
                                    id={'ir_incidente_rra'}
                                    register={register('ir_incidente_rra')}
                                />

                                <label
                                    htmlFor="ir_incidente_rra"
                                    className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    IR incidente sobre RRA?
                                </label>
                            </div>
                        )}

                        {watch('ir_incidente_rra') &&
                        watch('incidencia_rra_ir') === true &&
                        watch('natureza') !== 'TRIBUTÁRIA' ? (
                            <div className="mt-1 flex flex-col gap-2 overflow-hidden 2xsm:col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="numero_de_meses"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Número de meses
                                </label>
                                <input
                                    type="number"
                                    id="numero_de_meses"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                    min={0}
                                    {...register('numero_de_meses', {
                                        required: 'Campo obrigatório',
                                        setValueAs: (value) => {
                                            return parseInt(value);
                                        },
                                    })}
                                />
                            </div>
                        ) : (
                            <>
                                {watch('esfera') === 'FEDERAL' &&
                                    watch('incidencia_rra_ir') === true && (
                                        <div className="col-span-1 hidden md:block"></div>
                                    )}
                            </>
                        )}
                        {watch('natureza') !== 'TRIBUTÁRIA' ? (
                            <div
                                className={`flex gap-2 ${watch('incidencia_pss') ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}
                            >
                                <CustomCheckbox
                                    check={watch('incidencia_pss')}
                                    id={'incidencia_pss'}
                                    register={register('incidencia_pss')}
                                />
                                {/* <input
                  type="checkbox"
                  id="incidencia_pss"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  {...register("incidencia_pss")}
                /> */}
                                <label
                                    htmlFor="incidencia_pss"
                                    className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Incide PSS?
                                </label>
                            </div>
                        ) : null}
                        {watch('incidencia_pss') && watch('natureza') !== 'TRIBUTÁRIA' ? (
                            <div className="mt-1 flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="valor_pss"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    PSS
                                </label>
                                <Controller
                                    name="valor_pss"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <Cleave
                                            {...field}
                                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                            options={{
                                                numeral: true,
                                                numeralThousandsGroupStyle: 'thousand',
                                                numeralDecimalScale: 2,
                                                numeralDecimalMark: ',',
                                                delimiter: '.',
                                                prefix: 'R$ ',
                                                rawValueTrimPrefix: true,
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        ) : (
                            <>
                                {watch('natureza') === 'TRIBUTÁRIA' ? null : (
                                    <div className="hidden items-center md:flex">&nbsp;</div>
                                )}
                            </>
                        )}
                        <div
                            className={`flex gap-2 ${watch('data_limite_de_atualizacao_check') ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}
                        >
                            <CustomCheckbox
                                check={watch('data_limite_de_atualizacao_check')}
                                id={'data_limite_de_atualizacao_check'}
                                register={register('data_limite_de_atualizacao_check')}
                            />
                            {/* <input
                type="checkbox"
                id="data_limite_de_atualizacao_check"
                className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                {...register("data_limite_de_atualizacao_check")}
              /> */}
                            <label
                                htmlFor="data_limite_de_atualizacao_check"
                                className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Atualizar para data passada?
                            </label>
                        </div>
                        {watch('data_limite_de_atualizacao_check') ? (
                            <div className="mt-1 flex flex-col justify-between gap-2 2xsm:col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="data_limite_de_atualizacao"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Atualizado até:
                                </label>
                                <input
                                    type="date"
                                    id="data_limite_de_atualizacao"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                    {...register('data_limite_de_atualizacao', {})}
                                    min={watch('data_requisicao')}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {watch('data_limite_de_atualizacao')! <
                                watch('data_requisicao')! ? (
                                    <span
                                        role="alert"
                                        className="absolute right-4 top-4 text-sm text-red-500"
                                    >
                                        Data de atualização deve ser maior que a data de requisição
                                    </span>
                                ) : null}
                            </div>
                        ) : null}

                        {/* CVLD */}
                        <div className="col-span-2 flex flex-col gap-2">
                            <div className="mt-8 flex flex-col gap-2">
                                <>
                                    <div className="mb-4 w-full">
                                        <span className="text-md w-full self-center font-semibold">
                                            Dados de Identificação
                                        </span>
                                    </div>

                                    <div className="mb-4 grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="credor"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Nome/Razão Social
                                            </label>
                                            <input
                                                type="text"
                                                id="credor"
                                                className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                {...register('credor', {})}
                                            />
                                        </div>

                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="cpf_cnpj"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                CPF/CNPJ
                                            </label>
                                            <CPFAndCNPJInput
                                                value={CPFOrCNPJValue}
                                                setValue={setCPFOrCNPJValue}
                                                className={`${CPFOrCNPJValue.length > 0 && !isCPFOrCNPJValid(CPFOrCNPJValue) && 'border-2 !border-rose-400 !ring-0'} h-9.5 w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium focus:ring-0 dark:border-strokedark dark:bg-boxdark-2`}
                                            />
                                        </div>

                                        <div className=" flex w-full flex-row justify-between gap-4 2xsm:col-span-2 sm:col-span-1">
                                            <div className="flex w-full flex-col gap-2 sm:col-span-1">
                                                <label
                                                    htmlFor="especie"
                                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                                >
                                                    Espécie
                                                </label>

                                                <select
                                                    defaultValue={''}
                                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                                    {...register('especie')}
                                                >
                                                    <option value="Principal">principal</option>
                                                    <option value="Honorários Contratuais">
                                                        honorários contratuais
                                                    </option>
                                                    <option value="Honorários Sucumbenciais">
                                                        honorários sucumbenciais
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="text-md mb-4 w-full self-center font-semibold">
                                        Dados do Processo
                                    </span>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="npu"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                NPU (requisitório)
                                            </label>
                                            <Controller
                                                name="npu"
                                                control={control}
                                                defaultValue=""
                                                render={({ field }) => (
                                                    <Cleave
                                                        {...field}
                                                        className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                        options={{
                                                            blocks: [7, 2, 4, 1, 2, 4],
                                                            delimiters: ['-', '.', '.', '.', '.'],
                                                            numericOnly: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="npu_originario"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                NPU (originario)
                                            </label>
                                            <Controller
                                                name="npu_originario"
                                                control={control}
                                                defaultValue=""
                                                render={({ field }) => (
                                                    <Cleave
                                                        {...field}
                                                        className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                        options={{
                                                            blocks: [7, 2, 4, 1, 2, 4],
                                                            delimiters: ['-', '.', '.', '.', '.'],
                                                            numericOnly: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="ente_devedor"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Ente Devedor
                                            </label>
                                            <input
                                                type="text"
                                                id="ente_devedor"
                                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                {...register('ente_devedor', {})}
                                            />
                                        </div>

                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="estado_ente_devedor"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Estado do Ente Devedor
                                            </label>

                                            <select
                                                defaultValue={''}
                                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                                {...register('estado_ente_devedor')}
                                            >
                                                {estados.map((estado) => (
                                                    <option key={estado.id} value={estado.id}>
                                                        {estado.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="juizo_vara"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Juízo/Vara
                                            </label>
                                            <input
                                                type="text"
                                                id="juizo_vara"
                                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                {...register('juizo_vara', {})}
                                            />
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                    <div className="my-8 flex justify-center">
                        <button
                            type="submit"
                            className="my-8 flex cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0"
                        >
                            <span className="text-[16px] font-medium" aria-disabled={isSavingEdit}>
                                {isSavingEdit ? 'Salvando alterações...' : 'Salvar'}
                            </span>
                            {!isSavingEdit ? (
                                <BiCheck className="ml-2 h-6 w-6" />
                            ) : (
                                <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOficioBrokerForm;
