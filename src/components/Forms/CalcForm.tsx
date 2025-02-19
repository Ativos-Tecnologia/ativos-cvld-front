import { tribunais } from '@/constants/tribunais';
import tipoOficio from '@/enums/tipoOficio.enum';
import { CvldFormInputsProps } from '@/types/cvldform';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { UpdatePrecatorioButton } from '../Button/UpdatePrecatorioButton';
import Cleave from 'cleave.js/react';
import CustomCheckbox from '../CrmUi/Checkbox';
import { estados } from '@/constants/estados';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import { BiCheck, BiLogoUpwork, BiSolidCalculator } from 'react-icons/bi';
import { TableNotionContext } from '@/context/NotionTableContext';
import { AiOutlineLoading } from 'react-icons/ai';
import { NotionPage } from '@/interfaces/INotion';
import numberFormat from '@/functions/formaters/numberFormat';
import CelerAppCombobox from '../CrmUi/Combobox';
import { estadoRegimeEnteDevedor } from '@/constants/estado-regime-enteDevedor';
import { CPFAndCNPJInput } from '../CrmUi/CPFAndCNPFInput';
import {
    entesComTaxaPrevidenciariaPredefinida,
    regimeEspecialExceptions,
} from '@/constants/excecoes-regime-especial';
import { Fade, Slide } from 'react-awesome-reveal';

// interface
interface ICalcFormProps {
    data?: NotionPage | null;
    auxDataSetter?: React.Dispatch<React.SetStateAction<any>>;
    onSubmitForm: (data: any) => Promise<void>;
    formConfigs: UseFormReturn<Partial<CvldFormInputsProps>, any, undefined>;
    hasDropzone?: boolean;
    isLoading?: boolean;
    formMode?: 'create' | 'update';
}

const CalcForm = ({
    data,
    auxDataSetter,
    onSubmitForm,
    formConfigs,
    hasDropzone = true,
    isLoading = false,
    formMode = 'create',
}: ICalcFormProps) => {
    // hook form imports
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        clearErrors,
        formState: { errors },
    } = formConfigs;

    // constants
    const ENUM_TIPO_OFICIO_LIST = Object.values(tipoOficio);

    //states
    const [oficioForm, setOficioForm] = React.useState<any>(null);

    // context imports
    const { data: userData } = React.useContext<UserInfoContextType>(UserInfoAPIContext);
    const { usersList } = React.useContext(TableNotionContext);

    // others constants
    const esfera = watch('esfera');
    const estadoSelecionado =
        esfera === 'FEDERAL' || esfera === undefined ? 'FEDERAL' : watch('estado_ente_devedor');

    const enteDevedorSelecionado = watch('ente_devedor');

    const opcoesEntesDevedores = estadoSelecionado
        ? [
            ...(estadoRegimeEnteDevedor[estadoSelecionado]?.GERAL || []),
            ...(estadoRegimeEnteDevedor[estadoSelecionado]?.ESPECIAL || []),
        ]
        : [];

    const regime_por_ente =
        estadoSelecionado &&
            enteDevedorSelecionado &&
            estadoRegimeEnteDevedor[estadoSelecionado]?.GERAL?.includes(enteDevedorSelecionado)
            ? 'GERAL'
            : 'ESPECIAL';

    // effects
    React.useEffect(() => {
        if (enteDevedorSelecionado && estadoSelecionado) {
            const regime = estadoRegimeEnteDevedor[estadoSelecionado]?.GERAL?.includes(
                enteDevedorSelecionado,
            )
                ? 'GERAL'
                : 'ESPECIAL';
            setValue('regime', regime);
        }
    }, [enteDevedorSelecionado, estadoSelecionado]);

    React.useEffect(() => {
        if (data && formMode === 'update') {
            setValue('tipo_do_oficio', data.properties['Tipo'].select?.name || 'PRECATÓRIO');
            setValue('natureza', data.properties['Natureza'].select?.name || 'NÃO TRIBUTÁRIA');
            setValue('esfera', data.properties['Esfera'].select?.name || 'FEDERAL');
            setValue('regime', data.properties['Regime'].select?.name || 'GERAL');
            setValue('tribunal', data.properties['Tribunal'].select?.name || 'STJ');
            setValue(
                'valor_principal',
                numberFormat(data.properties['Valor Principal'].number || 0),
            );
            setValue('valor_juros', numberFormat(data.properties['Valor Juros'].number || 0));
            setValue('data_base', data.properties['Data Base'].date?.start || '');
            setValue('data_requisicao', data.properties['Data do Recebimento'].date?.start || '');
            setValue(
                'incide_contribuicao_previdenciaria',
                data.properties['Incide Contribuição Previdenciária'].checkbox,
            );
            setValue(
                'percentual_de_contribuicao_previdenciaria',
                (data.properties['Percentual de Contribuição Previdenciária'].number! * 100)
                    .toFixed(2)
                    .replace('.', ','),
            );

            setValue(
                'valor_aquisicao_total',
                data.properties['Percentual a ser adquirido'].number! === 1,
            );
            setValue(
                'percentual_a_ser_adquirido',
                (data.properties['Percentual a ser adquirido'].number! * 100)
                    .toFixed(2)
                    .replace('.', ','),
            );
            setValue(
                'ja_possui_destacamento',
                data.properties['Honorários já destacados?'].checkbox,
            );
            setValue(
                'percentual_de_honorarios',
                (data.properties['Percentual de Honorários Não destacados'].number! * 100 || 0)
                    .toFixed(2)
                    .replace('.', ','),
            );
            setValue(
                'nao_incide_selic_no_periodo_db_ate_abril',
                data.properties['Incide Selic Somente Sobre Principal'].checkbox,
            );
            setValue('incidencia_rra_ir', data.properties['Incidencia RRA/IR'].checkbox);
            setValue('ir_incidente_rra', data.properties['IR Incidente sobre RRA'].checkbox);
            setValue('incidencia_pss', data.properties['PSS'].number! > 0);
            setValue('valor_pss', numberFormat(data.properties['PSS'].number || 0));
            setValue('numero_de_meses', data.properties['Meses RRA'].number || 0);
            setValue('credor', data.properties['Credor'].title[0]?.text.content || '');
            setValue('cpf_cnpj', data.properties['CPF/CNPJ'].rich_text?.[0]?.text.content || '');
            setValue('especie', data?.properties?.['Espécie'].select?.name || 'Principal');
            setValue('npu', data.properties['NPU (Precatório)'].rich_text?.[0]?.text.content || '');
            setValue(
                'npu_originario',
                data?.properties?.['NPU (Originário)'].rich_text?.[0]?.text.content || '',
            );
            setValue('ente_devedor', data.properties['Ente Devedor'].select?.name || '');
            setValue(
                'estado_ente_devedor',
                data.properties['Estado do Ente Devedor'].select?.name || '',
            );
            setValue('juizo_vara', data.properties['Juízo'].rich_text?.[0]?.text.content || '');
            setValue('status', data.properties['Status'].status?.name || '');
            setValue('upload_notion', true);

            // update auxDataSetter if exists
            auxDataSetter && auxDataSetter(watch());
        }
    }, [data]);

    React.useEffect(() => {
        if (oficioForm) {
            setValue('natureza', oficioForm.data.process.nature);
            setValue(
                'valor_principal',
                numberFormat(oficioForm.data.financial_data.principal_value).replace('R$', ''),
            );
            setValue(
                'valor_juros',
                numberFormat(oficioForm.data.financial_data.interest_value).replace('R$', ''),
            );
            // setValue('incide_contribuicao_previdenciaria', oficioForm.result[0].properties['Incide Contribuição Previdenciária'].checkbox);
            setValue('data_base', oficioForm.data.dates.base_date.split('T')[0]);

            if (oficioForm.data.dates.base_date.split('T')[0] < '2021-12-01') {
                setValue('incidencia_juros_moratorios', true);
            }

            setValue(
                'data_requisicao',
                oficioForm.data.dates.request_date
                    ? oficioForm.data.dates.request_date.split('T')[0]
                    : '',
            );
            // setValue('ir_incidente_rra', oficioForm.result[0].incidencia_rra_ir);

            // if (oficioForm.result[0].incidencia_juros_moratorios) {
            //     setValue('incidencia_juros_moratorios', true);
            // } else {
            //     setValue('incidencia_juros_moratorios', false);
            // }
            setValue('numero_de_meses', oficioForm.data.rra_data.number_of_months || 0);
            setValue('incidencia_pss', oficioForm.data.financial_data.pss_value > 0);
            setValue(
                'valor_pss',
                numberFormat(oficioForm.data.financial_data.pss_value).replace('R$', ''),
            );
            setValue('tribunal', oficioForm.data.court_info.tribunal);
            setValue('juizo_vara', oficioForm.data.court_info.court_division);
            setValue('cpf_cnpj', oficioForm.data.beneficiary.document_number);
            setValue('credor', oficioForm.data.beneficiary.name);
            // setValue('estado_ente_devedor', oficioForm.result[0].estado_ente_devedor);
            // setValue('npu', oficioForm.result[0].npu);
            // setValue('npu_originario', oficioForm.result[0].npu_originario);
            // setValue('status', oficioForm.result[0].status);
            // setValue('percentual_de_honorarios', oficioForm.result[0].percentual_de_honorarios);

            if (oficioForm.data.rra_data.present) {
                setValue('ir_incidente_rra', true);
                setValue('numero_de_meses', oficioForm.data.rra_data.number_of_months);
            } else {
                setValue('ir_incidente_rra', false);
            }

            // if (oficioForm.result[0].incidencia_pss) {
            //     setValue('incidencia_pss', true);
            //     setValue(
            //         'valor_pss',
            //         numberFormat(oficioForm.result[0].valor_pss).replace('R$', ''),
            //     );
            // }
            setValue('especie', oficioForm.data.process.type_of_requester);
            setValue('tipo_do_oficio', oficioForm.data.process.proceding_type);
            // if (oficioForm.result[0].ja_possui_destacamento) {
            //     setValue('ja_possui_destacamento', true);
            //     setValue('percentual_de_honorarios', oficioForm.result[0].percentual_de_honorarios);
            // }
            setValue('esfera', oficioForm.data.court_info.sphere);
            setValue('ente_devedor', oficioForm.data.court_info.ente_devedor);

            setValue('regime', oficioForm.data.court_info.regime);
        }
    }, [oficioForm]);

    console.log(watch('tipo_valor_contribuicao_previdenciaria'))

    return (
        <React.Fragment>
            {hasDropzone && (
                <div className="mb-8 flex w-full flex-col items-center">
                    <UpdatePrecatorioButton setStateFunction={setOficioForm} />
                </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmitForm)}>
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
                            {...register('tipo_do_oficio')}
                        >
                            {ENUM_TIPO_OFICIO_LIST.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
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
                            <option defaultChecked value="FEDERAL">
                                Federal
                            </option>
                            <option value="ESTADUAL">Estadual</option>
                            <option value="MUNICIPAL">Municipal</option>
                        </select>
                    </div>

                    <input
                        type="hidden"
                        {...register('regime')}
                        onChange={() => {
                            setValue('regime', regime_por_ente);
                        }}
                    />

                    <div className="relative flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                        <label
                            htmlFor="tribunal"
                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                            Tribunal
                        </label>

                        <CelerAppCombobox
                            list={tribunais}
                            onChangeValue={(value) => {
                                const tribunal = tribunais.filter(
                                    (tribunal) => tribunal.nome === value,
                                )[0];
                                setValue('tribunal', tribunal.id);
                                clearErrors('tribunal');
                            }}
                            value={
                                tribunais.filter((estado) => estado.id === watch('tribunal'))[0]
                                    ?.nome || ''
                            }
                            register={register('tribunal', {
                                required: {
                                    value: true,
                                    message: "Campo obrigatório"
                                }
                            })}
                            name="tribunal"
                            placeholder="BUSQUE POR TRIBUNAL"
                            className={`${errors.tribunal ? '!border-red !ring-0' : 'border-stroke dark:border-strokedark'} h-[37px] text-sm uppercase`}
                        />

                        {errors.tribunal && (
                            <span className="absolute right-8.5 top-8.5 text-xs font-medium text-red">
                                {errors.tribunal.message}
                            </span>
                        )}

                        {/* <select
                            defaultValue={''}
                            className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                            {...register('tribunal')}
                        >
                            {tribunais.map((tribunal) => (
                                <option key={tribunal.id} value={tribunal.id}>
                                    {tribunal.nome}
                                </option>
                            ))}
                        </select> */}
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
                                        className={`w-full rounded-md border-stroke ${error ? '!border-red' : 'dark:border-strokedark'} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
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
                                    value: 0,
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

                    <div className="relative flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                        <label
                            htmlFor="outros_descontos"
                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                            Outros Descontos
                        </label>
                        <Controller
                            name="outros_descontos"
                            control={control}
                            defaultValue={0}
                            rules={{
                                min: {
                                    value: 0,
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

                    <div className="col-span-1 hidden sm:block" />

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
                                    className="mb-1 truncate font-nexa text-xs font-semibold uppercase text-meta-5"
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

                    {watch('esfera') && watch('esfera') !== 'FEDERAL' && (
                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                            <label
                                htmlFor="estado_ente_devedor"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Estado do Ente Devedor
                            </label>

                            <CelerAppCombobox
                                list={estados}
                                onChangeValue={(value) => {
                                    const estado = estados.filter(
                                        (estado) => estado.nome === value,
                                    )[0];
                                    setValue('estado_ente_devedor', estado.id);
                                }}
                                value={
                                    estados.filter(
                                        (estado) => estado.id === watch('estado_ente_devedor'),
                                    )[0]?.nome || ''
                                }
                                register={register('estado_ente_devedor')}
                                name="estado_ente_devedor"
                                placeholder="BUSQUE POR ESTADO"
                                className="text-sm uppercase"
                            />

                            {/* <select
                                                        defaultValue={""}
                                                        className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                                        {...register("estado_ente_devedor")}
                                                    >
                                                        {estados.map((estado) => (
                                                            <option key={estado.id} value={estado.id}>
                                                                {estado.nome}
                                                            </option>
                                                        ))}
                                                    </select> */}
                        </div>
                    )}

                    <div className="relative flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                        <label
                            htmlFor="ente_devedor"
                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                            Ente Devedor
                        </label>
                        <CelerAppCombobox
                            list={opcoesEntesDevedores}
                            onChangeValue={(value) => {
                                setValue('ente_devedor', value);
                                clearErrors('ente_devedor')
                            }}
                            value={
                                opcoesEntesDevedores.filter(
                                    (estado) => estado === watch('ente_devedor'),
                                )[0] || ''
                            }
                            register={register('ente_devedor', {
                                required: {
                                    value: true,
                                    message: 'Esse campo é obrigatório',
                                },
                            })}
                            name="ente_devedor"
                            placeholder="BUSQUE PELO ENTE DEVEDOR"
                            className={`${errors.ente_devedor ? '!border-red' : 'border-stroke dark:border-strokedark'} text-sm uppercase`}
                        />
                        {errors.ente_devedor && (
                            <span className="absolute right-8.5 top-8.5 text-xs font-medium text-red">
                                campo obrigatório
                            </span>
                        )}
                    </div>

                    {watch('esfera') && watch('esfera') === 'FEDERAL' && (
                        <div className="col-span-1 hidden sm:block" />
                    )}

                    {watch('natureza') === 'NÃO TRIBUTÁRIA' && watch("ente_devedor") && (
                        <div className={`col-span-2 flex max-h-6 items-center gap-2`}>
                            <CustomCheckbox
                                check={watch('incide_contribuicao_previdenciaria')}
                                id={'incide_contribuicao_previdenciaria'}
                                register={register('incide_contribuicao_previdenciaria')}
                            />

                            <label
                                htmlFor="incide_contribuicao_previdenciaria"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Incide Contribuição Previdenciária?
                            </label>
                        </div>
                    )}


                    {((watch('natureza') === 'NÃO TRIBUTÁRIA' || watch('natureza') === undefined) &&
                        watch('incide_contribuicao_previdenciaria') && !entesComTaxaPrevidenciariaPredefinida.includes(watch("ente_devedor") || "")) && (
                            <div className="col-span-2 grid gap-5 p-2 pl-4 ml-2 rounded-md border border-l-6 border-stroke dark:border-form-strokedark !border-l-meta-5 sm:grid-cols-2">
                                <div className='flex flex-col cols-span-2 sm:col-span-1'>
                                    <label
                                        htmlFor="tipo_valor_contribuicao_previdenciaria"
                                        className="font-nexa text-xs font-semibold uppercase text-meta-5 mb-5"
                                    >
                                        tipo do valor (Contribuição Previdenciária)
                                    </label>
                                    <div className='flex items-center gap-3'>
                                        <input
                                            type="radio"
                                            id='tipo_valor_contribuicao_previdenciaria'
                                            value='absoluto'
                                            {...register('tipo_valor_contribuicao_previdenciaria')}
                                        />
                                        <span className='font-nexa text-xs font-semibold uppercase text-meta-5'>Valor Absoluto</span>
                                    </div>
                                    <div className='flex items-center gap-3 mt-2'>
                                        <input
                                            type="radio"
                                            id='tipo_valor_contribuicao_previdenciaria'
                                            value='porcentagem'
                                            {...register('tipo_valor_contribuicao_previdenciaria')}
                                        />
                                        <span className='font-nexa text-xs font-semibold uppercase text-meta-5'>Porcentagem</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5 col-span-2 sm:col-span-1">

                                    {watch("tipo_valor_contribuicao_previdenciaria") !== undefined && (
                                        <label
                                            title='Percentual de Contribuição Previdenciária (%)'
                                            htmlFor="percentual_de_contribuicao_previdenciaria"
                                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                        >
                                            {watch('tipo_valor_contribuicao_previdenciaria') === 'absoluto' ? 'Valor de Contribuição Previdenciária (R$)' : 'Percentual de Contribuição Previdenciária (%)'}
                                        </label>
                                    )}

                                    {watch('tipo_valor_contribuicao_previdenciaria') === 'porcentagem' && (
                                        <Controller
                                            name="percentual_de_contribuicao_previdenciaria"
                                            control={control}
                                            defaultValue={0}
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
                                    )}

                                    {watch('tipo_valor_contribuicao_previdenciaria') === 'absoluto' && (
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
                                    )}
                                </div>
                            </div>
                        )}

                    {/* {watch("ente_devedor") && ((!watch("incide_contribuicao_previdenciaria") && watch("ente_devedor")) ||
                        (!watch("incide_contribuicao_previdenciaria") && !entesComTaxaPrevidenciariaPredefinida.includes(watch("ente_devedor") || "")) || entesComTaxaPrevidenciariaPredefinida.includes(watch("ente_devedor") || "")) && watch('natureza') === "NÃO TRIBUTÁRIA" && (
                            <div className="col-span-1 hidden sm:block"></div>
                        )
                    } */}

                    {watch("estado_ente_devedor") === "PE" && (
                        <>
                            <div className={`col-span-2 flex max-h-6 items-center gap-2`}>
                                <CustomCheckbox
                                    check={watch('parcela_preferencial_inclusa')}
                                    id={'parcela_preferencial_inclusa'}
                                    register={register('parcela_preferencial_inclusa')}
                                />

                                <label
                                    htmlFor="parcela_preferencial_inclusa"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Há parcela Preferencial?
                                </label>
                            </div>

                            {watch("parcela_preferencial_inclusa") && (
                                <>
                                    <div className={`col-span-2 flex max-h-6 items-center gap-2 md:col-span-1`}>
                                        <CustomCheckbox
                                            check={watch('parcela_preferencial_paga')}
                                            id={'parcela_preferencial_paga'}
                                            register={register('parcela_preferencial_paga')}
                                        />

                                        <label
                                            htmlFor="parcela_preferencial_paga"
                                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                        >
                                            A parcela preferencial foi paga?
                                        </label>
                                    </div>

                                    {watch("parcela_preferencial_paga") ? (
                                        <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <div className="relative flex flex-col justify-between">
                                                <label
                                                    htmlFor="parcela_preferencial_paga_em"
                                                    className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                                >
                                                    Data de pagamento da parcela
                                                </label>
                                                <input
                                                    type="date"
                                                    id="parcela_preferencial_paga_em"
                                                    className={`w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                                    {...register('parcela_preferencial_paga_em')}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-span-1 hidden sm:block"></div>
                                    )}
                                </>
                            )}
                        </>
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
                                    <Controller
                                        name="percentual_de_honorarios"
                                        control={control}
                                        defaultValue={30}
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
                            </div>
                        )}
                    </div>

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
                    {watch('natureza') === 'TRIBUTÁRIA' || watch('incidencia_rra_ir') === false ? (
                        <>
                            {/* {watch("natureza") === "TRIBUTÁRIA" && watch("incidencia_rra_ir") === false ? null : (
                  <div className="flex items-center col-span-1">&nbsp;</div>
                )} */}
                        </>
                    ) : (
                        <div className={`flex h-6 gap-2 2xsm:col-span-2 md:col-span-1`}>
                            <CustomCheckbox
                                check={watch('ir_incidente_rra')}
                                id={'ir_incidente_rra'}
                                register={register('ir_incidente_rra')}
                            />
                            {/* <input
                  type="checkbox"
                  id="ir_incidente_rra"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  {...register("ir_incidente_rra")}
                /> */}
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
                            {!watch('ir_incidente_rra') &&
                                watch('incidencia_rra_ir') &&
                                watch('natureza') === 'NÃO TRIBUTÁRIA' ? (
                                <div className="col-span-1 hidden md:block"></div>
                            ) : null}
                        </>
                    )}
                    {watch('natureza') === 'NÃO TRIBUTÁRIA' &&
                        !watch('incide_contribuicao_previdenciaria') ? (
                        <div
                            className={`flex gap-2 ${watch('incidencia_pss') ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}
                        >
                            <CustomCheckbox
                                check={watch('incidencia_pss')}
                                id={'incidencia_pss'}
                                register={register('incidencia_pss')}
                            />

                            <label
                                htmlFor="incidencia_pss"
                                className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                                Incide PSS?
                            </label>
                        </div>
                    ) : null}

                    {(watch('incidencia_pss') && watch('natureza') !== 'TRIBUTÁRIA' && !watch("incide_contribuicao_previdenciaria")) ? (
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
                            {watch('natureza') === 'TRIBUTÁRIA' ||
                                watch('incide_contribuicao_previdenciaria') ? null : (
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
                            {watch('data_limite_de_atualizacao')! < watch('data_requisicao')! ? (
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
                        {formMode === 'create' && (
                            <div className="flex items-center gap-2 ">
                                <CustomCheckbox
                                    check={watch('gerar_cvld')}
                                    id={'gerar_cvld'}
                                    register={register('gerar_cvld')}
                                />
                                <label
                                    htmlFor="gerar_cvld"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Salvar informações de ofício e recálculo?
                                </label>
                            </div>
                        )}
                        <div className="mt-8 flex flex-col gap-2">
                            {(watch('gerar_cvld') && formMode === 'create') ||
                                formMode === 'update' ? (
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
                                                value={watch('cpf_cnpj') || ''}
                                                setValue={setValue}
                                                className={`h-9.5 w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                            />
                                            {/* <Controller
                                                name='cpf_cnpj'
                                                control={control}
                                                render={({ field }) => (
                                                    <CPFAndCNPJInput
                                                        {...field}
                                                        value={watch("cpf_cnpj") || ""}
                                                        setValue={setValue}
                                                    // className={`${CPFOrCNPJValue && !isCPFOrCNPJValid(CPFOrCNPJValue) && 'focus-visible:ring-meta-1'} h-9.5 w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                                    />
                                                )}
                                            /> */}
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

                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="status"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Status
                                            </label>

                                            <select
                                                defaultValue={''}
                                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                                {...register('status')}
                                            >
                                                <option value="Negociação em Andamento">
                                                    negociação em andamento
                                                </option>
                                                <option value="Proposta aceita">
                                                    proposta aceita
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                        {(userData.role === 'ativos' || userData.role === 'judit') &&
                            watch('gerar_cvld') &&
                            formMode === 'create' ? (
                            <>
                                <hr className="col-span-2 my-8 border border-stroke dark:border-strokedark" />
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="vincular_usuario"
                                                className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                                                {...register('vincular_usuario')}
                                            />

                                            <label
                                                htmlFor="vincular_usuario"
                                                className="align-self-baseline flex cursor-pointer flex-row text-sm font-medium text-meta-5"
                                            >
                                                <BiLogoUpwork className="mr-2 mt-0.5 h-4 w-4" />{' '}
                                                Vincular a outro usuário?
                                            </label>
                                        </div>
                                    </div>
                                    {watch('vincular_usuario') === true ? (
                                        <div className="flex flex-col gap-2">
                                            {(watch('novo_usuario') === false ||
                                                watch('novo_usuario') === undefined) &&
                                                watch('vincular_usuario') === true && (
                                                    <CelerAppCombobox
                                                        list={usersList.filter(
                                                            (user) => user !== userData.user,
                                                        )}
                                                        onChangeValue={(value) => {
                                                            setValue('username', value);
                                                        }}
                                                        value={
                                                            usersList.filter(
                                                                (user) =>
                                                                    user !== watch('username'),
                                                            )[0] || ''
                                                        }
                                                        register={register('username')}
                                                        name="username"
                                                        placeholder="BUSQUE POR USUÁRIO"
                                                        className="text-sm uppercase"
                                                        size={'400px'}
                                                    />
                                                    // <select
                                                    //     id="username"
                                                    //     className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                    //     {...register('username')}
                                                    // >
                                                    //     <option value={userData.user}>
                                                    //         {userData.user}
                                                    //     </option>
                                                    //     {usersList
                                                    //         .filter(
                                                    //             (user) =>
                                                    //                 user !== userData.user,
                                                    //         )
                                                    //         .map((user) => (
                                                    //             <option
                                                    //                 key={user}
                                                    //                 value={user}
                                                    //             >
                                                    //                 {user}
                                                    //             </option>
                                                    //         ))}
                                                    // </select>
                                                )}
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    <label
                                                        htmlFor="novo_usuario"
                                                        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-meta-5"
                                                    >
                                                        <CustomCheckbox
                                                            check={watch('novo_usuario')}
                                                            id={'novo_usuario'}
                                                            register={register('novo_usuario')}
                                                        />
                                                        <span>
                                                            O nome não está na lista? Crie um novo
                                                            usuário!
                                                        </span>
                                                    </label>
                                                </div>
                                                {watch('novo_usuario') === true && (
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                        {...register('username')}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
                <div className="my-8 flex justify-center">
                    <button
                        type="submit"
                        className="my-8 flex cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0"
                    >
                        {formMode === 'create' ? (
                            <>
                                <span className="text-[16px] font-medium" aria-disabled={isLoading}>
                                    {isLoading ? 'Fazendo cálculo...' : 'Calcular'}
                                </span>
                                {!isLoading ? (
                                    <BiSolidCalculator className="ml-2 mt-[0.2rem] h-4 w-4" />
                                ) : (
                                    <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                                )}
                            </>
                        ) : (
                            <>
                                <span className="text-[16px] font-medium" aria-disabled={isLoading}>
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </span>
                                {!isLoading ? (
                                    <BiCheck className="ml-2 mt-[0.2rem] h-4 w-4" />
                                ) : (
                                    <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                                )}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default CalcForm;
