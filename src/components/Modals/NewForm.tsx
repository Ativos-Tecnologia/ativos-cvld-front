import { DefaultLayoutContext } from '@/context/DefaultLayoutContext'
import { Slash } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { Controller, useForm } from 'react-hook-form';
import { BiDownload, BiLineChart, BiLogoUpwork, BiMinus, BiPlus, BiX } from 'react-icons/bi';
import { ShadSelect } from '../ShadSelect';
import { SelectItem } from '@radix-ui/react-select';
import Cleave from 'cleave.js/react';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import CustomCheckbox from '../CrmUi/Checkbox';
import { Avatar } from 'flowbite-react';
import { PaginatedResponse } from '../TaskElements';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import { AiOutlineLoading, AiOutlineReload, AiOutlineWarning } from 'react-icons/ai';
import UseMySwal from '@/hooks/useMySwal';
import api from '@/utils/api';
import { UpdatePrecatorioButton } from '../Button/UpdatePrecatorioButton';
import { CvldFormInputsProps } from '@/types/cvldform';
import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { toast } from 'sonner';
import numberFormat from '@/functions/formaters/numberFormat';
import NewFormResultSkeleton from '../Skeletons/NewFormResultSkeleton';
import { AxiosError } from 'axios';

const NewForm = () => {

    const { modalOpen, setModalOpen } = useContext(DefaultLayoutContext);
    const [oficioForm, setOficioForm] = useState<any>(null);
    const mySwal = UseMySwal();
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingUsersList, setFetchingUsersList] = useState<boolean>(false);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [fetchError, setFetchError] = useState<boolean>(false);
    const enumTipoOficiosList = Object.values(tipoOficio);
    const [proposalValue, setProposalValue] = useState({ min: 0, max: 0 });
    const [comissionValue, setComissionValue] = useState({ min: 0, max: 0 });
    const [calculationMemory, setCalculationMemory] = useState({ simple: "", rra: "" })
    const [showResults, setShowResults] = useState<boolean>(false);
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0,
    });
    const { data } = useContext<UserInfoContextType>(UserInfoAPIContext);
    const resultContainerRef = useRef<HTMLDivElement | null>(null);
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: {
            errors
        }
    } = useForm<Partial<CvldFormInputsProps>>({
        defaultValues: {
            numero_de_meses: 0
        }
    });

    const estados = [
        { id: "AC", nome: "Acre" },
        { id: "AL", nome: "Alagoas" },
        { id: "AP", nome: "Amapá" },
        { id: "AM", nome: "Amazonas" },
        { id: "BA", nome: "Bahia" },
        { id: "CE", nome: "Ceará" },
        { id: "DF", nome: "Distrito Federal" },
        { id: "ES", nome: "Espírito Santo" },
        { id: "GO", nome: "Goiás" },
        { id: "MA", nome: "Maranhão" },
        { id: "MT", nome: "Mato Grosso" },
        { id: "MS", nome: "Mato Grosso do Sul" },
        { id: "MG", nome: "Minas Gerais" },
        { id: "PA", nome: "Pará" },
        { id: "PB", nome: "Paraíba" },
        { id: "PR", nome: "Paraná" },
        { id: "PE", nome: "Pernambuco" },
        { id: "PI", nome: "Piauí" },
        { id: "RJ", nome: "Rio de Janeiro" },
        { id: "RN", nome: "Rio Grande do Norte" },
        { id: "RS", nome: "Rio Grande do Sul" },
        { id: "RO", nome: "Rondônia" },
        { id: "RR", nome: "Roraima" },
        { id: "SC", nome: "Santa Catarina" },
        { id: "SP", nome: "São Paulo" },
        { id: "SE", nome: "Sergipe" },
        { id: "TO", nome: "Tocantins" },
    ];

    const tribunais = [
        { id: "TRF1", nome: "Tribunal Regional Federal - 1ª Região" },
        { id: "TRF2", nome: "Tribunal Regional Federal - 2ª Região" },
        { id: "TRF3", nome: "Tribunal Regional Federal - 3ª Região" },
        { id: "TRF4", nome: "Tribunal Regional Federal - 4ª Região" },
        { id: "TRF5", nome: "Tribunal Regional Federal - 5ª Região" },
        { id: "TRF6", nome: "Tribunal Regional Federal - 6ª Região" },
        { id: "STF", nome: "Supremo Tribunal Federal" },
        { id: "STJ", nome: "Superior Tribunal de Justiça" },
        { id: "TST", nome: "Tribunal Superior do Trabalho" },
        { id: "TSE", nome: "Tribunal Superior Eleitoral" },
        { id: "STM", nome: "Superior Tribunal Militar" },
        { id: "TJAC", nome: "Tribunal de Justiça do Acre" },
        { id: "TJAL", nome: "Tribunal de Justiça de Alagoas" },
        { id: "TJAP", nome: "Tribunal de Justiça do Amapá" },
        { id: "TJAM", nome: "Tribunal de Justiça do Amazonas" },
        { id: "TJBA", nome: "Tribunal de Justiça da Bahia" },
        { id: "TJCE", nome: "Tribunal de Justiça do Ceará" },
        { id: "TJDFT", nome: "Tribunal de Justiça do Distrito Federal e dos Territórios" },
        { id: "TJES", nome: "Tribunal de Justiça do Espírito Santo" },
        { id: "TJGO", nome: "Tribunal de Justiça de Goiás" },
        { id: "TJMA", nome: "Tribunal de Justiça do Maranhão" },
        { id: "TJMT", nome: "Tribunal de Justiça do Mato Grosso" },
        { id: "TJMS", nome: "Tribunal de Justiça do Mato Grosso do Sul" },
        { id: "TJMG", nome: "Tribunal de Justiça de Minas Gerais" },
        { id: "TJPA", nome: "Tribunal de Justiça do Pará" },
        { id: "TJPB", nome: "Tribunal de Justiça da Paraíba" },
        { id: "TJPE", nome: "Tribunal de Justiça de Pernambuco" },
        { id: "TJPI", nome: "Tribunal de Justiça do Piauí" },
        { id: "TJPR", nome: "Tribunal de Justiça do Paraná" },
        { id: "TJRJ", nome: "Tribunal de Justiça do Rio de Janeiro" },
        { id: "TJRN", nome: "Tribunal de Justiça do Rio Grande do Norte" },
        { id: "TJRO", nome: "Tribunal de Justiça de Rondônia" },
        { id: "TJRR", nome: "Tribunal de Justiça de Roraima" },
        { id: "TJRS", nome: "Tribunal de Justiça do Rio Grande do Sul" },
        { id: "TJSC", nome: "Tribunal de Justiça de Santa Catarina" },
        { id: "TJSE", nome: "Tribunal de Justiça de Sergipe" },
        { id: "TJSP", nome: "Tribunal de Justiça de São Paulo" },
        { id: "TJTO", nome: "Tribunal de Justiça do Tocantins" },
        { id: "TRT1", nome: "Tribunal Regional do Trabalho da 1ª Região" },
        { id: "TRT2", nome: "Tribunal Regional do Trabalho da 2ª Região" },
        { id: "TRT3", nome: "Tribunal Regional do Trabalho da 3ª Região" },
        { id: "TRT4", nome: "Tribunal Regional do Trabalho da 4ª Região" },
        { id: "TRT5", nome: "Tribunal Regional do Trabalho da 5ª Região" },
        { id: "TRT6", nome: "Tribunal Regional do Trabalho da 6ª Região" },
        { id: "TRT7", nome: "Tribunal Regional do Trabalho da 7ª Região" },
        { id: "TRT8", nome: "Tribunal Regional do Trabalho da 8ª Região" },
        { id: "TRT9", nome: "Tribunal Regional do Trabalho da 9ª Região" },
        { id: "TRT10", nome: "Tribunal Regional do Trabalho da 10ª Região" },
        { id: "TRT11", nome: "Tribunal Regional do Trabalho da 11ª Região" },
        { id: "TRT12", nome: "Tribunal Regional do Trabalho da 12ª Região" },
        { id: "TRT13", nome: "Tribunal Regional do Trabalho da 13ª Região" },
        { id: "TRT14", nome: "Tribunal Regional do Trabalho da 14ª Região" },
        { id: "TRT15", nome: "Tribunal Regional do Trabalho da 15ª Região" },
        { id: "TRT16", nome: "Tribunal Regional do Trabalho da 16ª Região" },
        { id: "TRT17", nome: "Tribunal Regional do Trabalho da 17ª Região" },
        { id: "TRT18", nome: "Tribunal Regional do Trabalho da 18ª Região" },
        { id: "TRT19", nome: "Tribunal Regional do Trabalho da 19ª Região" },
        { id: "TRT20", nome: "Tribunal Regional do Trabalho da 20ª Região" },
        { id: "TRT21", nome: "Tribunal Regional do Trabalho da 21ª Região" },
        { id: "TRT22", nome: "Tribunal Regional do Trabalho da 22ª Região" },
        { id: "TRT23", nome: "Tribunal Regional do Trabalho da 23ª Região" },
        { id: "TRT24", nome: "Tribunal Regional do Trabalho da 24ª Região" },
    ].sort((a, b) => a.nome.localeCompare(b.nome));

    /* função que atualiza lista de usuários (somente na role ativos) */
    const updateUsersList = async () => {
        setFetchingUsersList(true);
        const [usersList] = await Promise.all([api.get("/api/notion-api/list/users/")]);
        if (usersList.status === 200) {
            setUsersList(usersList.data);
        }
        setFetchingUsersList(false);
    }

    // Função para atualizar a proposta e ajustar a comissão proporcionalmente
    const handleProposalSliderChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newProposalSliderValue = parseFloat(e.target.value);
        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });

        // Calcular a proporção em relação a proposta e ajustar a comissão
        const proportion =
            (newProposalSliderValue - proposalValue.min) /
            (proposalValue.max - proposalValue.min);
        const newComissionSliderValue =
            comissionValue.max -
            proportion * (comissionValue.max - comissionValue.min);
        setSliderValues((oldValues) => {
            return { ...oldValues, comission: newComissionSliderValue };
        });
    };

    // Função para atualizar a comissão e ajustar a proposta proporcionalmente
    const handleComissionSliderChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newComissionSliderValue = parseFloat(e.target.value);
        setSliderValues((oldValues) => {
            return { ...oldValues, comission: newComissionSliderValue };
        });

        // Calcular a proporção em relação a comissão e ajustar a proposta
        const proportion =
            (newComissionSliderValue - comissionValue.min) /
            (comissionValue.max - comissionValue.min);
        const newProposalSliderValue =
            proposalValue.max - proportion * (proposalValue.max - proposalValue.min);
        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });
    };

    const onSubmit = async (data: any) => {

        setLoading(true);

        if (resultContainerRef.current) {
            resultContainerRef.current.scrollIntoView({ behavior: "smooth" })
        }

        data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
        data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
        data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

        if (data.tipo_do_oficio === "CREDITÓRIO") {
            const dateInSaoPaulo = new Date().toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            const formattedDate = dateInSaoPaulo.split('/').reverse().join('-');
            data.data_requisicao = formattedDate;
        }

        if (data.valor_aquisicao_total) {
            data.percentual_a_ser_adquirido = 1;
        } else {
            data.percentual_a_ser_adquirido /= 100;
        }

        if (data.tribunal === "TRF1" || data.tribunal === "TRF6") {
            data.nao_incide_selic_no_periodo_db_ate_abril = true;
        }

        if (!data.regime) {
            data.regime = "GERAL";
        }

        if (data.data_base > "2021-12-01") {
            data.incidencia_juros_moratorios = false;
        }

        if (data.ja_possui_destacamento) {
            data.percentual_de_honorarios = 0;
        } else {
            data.percentual_de_honorarios /= 100;
        }

        if (data.gerar_cvld) {
            data.upload_notion = true;
        }

        if (!data.data_limite_de_atualizacao_check) {
            const dateInSaoPaulo = new Date().toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            const formattedDate = dateInSaoPaulo.split('/').reverse().join('-');
            data.data_limite_de_atualizacao = formattedDate;
        }

        try {
            const response = data.gerar_cvld
                ? await api.post("/api/lead-magnet/save/", data)
                : await api.post("/api/lead-magnet/", data)

            if (response.status === 200 || response.status === 201) {
                const results = response.data.result; // pega o resultado da requisição
                setProposalValue({
                    min: results.min_proposal,
                    max: results.max_proposal,
                });
                setComissionValue({
                    min: results.min_comission,
                    max: results.max_comission,
                });
                setCalculationMemory({
                    simple: results.memoria_de_calculo_simples,
                    rra: results.memoria_de_calculo_rra
                })
                setShowResults(true);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.error)
            } else {
                toast.error(String(error));
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setSliderValues({
            proposal: proposalValue.min,
            comission: comissionValue.max,
        });
    }, [proposalValue, comissionValue]);

    useEffect(() => {
        if (oficioForm) {
            setValue("natureza", oficioForm.result[0].natureza);
            setValue(
                "valor_principal",
                numberFormat(oficioForm.result[0].valor_principal).replace("R$", ""),
            );
            setValue(
                "valor_juros",
                numberFormat(oficioForm.result[0].valor_juros).replace("R$", ""),
            );
            setValue(
                "data_base",
                oficioForm.result[0].data_base.split("/").reverse().join("-"),
            );

            if (oficioForm.result[0].data_base < "2021-12-01") {
                setValue("incidencia_juros_moratorios", true);
            }

            setValue(
                "data_requisicao",
                oficioForm.result[0].data_requisicao.split("/").reverse().join("-"),
            );
            setValue("ir_incidente_rra", oficioForm.result[0].incidencia_rra_ir);

            if (oficioForm.result[0].incidencia_juros_moratorios) {
                setValue("incidencia_juros_moratorios", true);
            } else {
                setValue("incidencia_juros_moratorios", false);
            }
            setValue("numero_de_meses", oficioForm.result[0].numero_de_meses);
            setValue(
                "incidencia_pss",
                oficioForm.result[0].valor_pss > 0 ? true : false,
            );
            setValue(
                "valor_pss",
                numberFormat(oficioForm.result[0].valor_pss).replace("R$", ""),
            );
        }
    }, [oficioForm]);

    return (
        <div className={`absolute w-full h-full top-0 left-0 bg-black-2/50 z-20 flex items-center justify-center ${modalOpen ? "opacity-100 visible" : "opacity-0 hidden"}`}>
            <Fade className='2xsm:w-11/12 lg:w-10/12 2xsm:h-[90%] xl:h-4/5 overflow-hidden' damping={0.1}>
                <div className="w-full h-full rounded-sm border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark 2xsm:text-sm md:text-base">
                    <div className='flex gap-2 mb-10 max-h-[15%]'>
                        <div className="flex-col flex-wrap items-start justify-between gap-3 pb-0 sm:flex-nowrap flex-1">
                            <div className="flex w-full justify-center align-middle">
                                <h2 className="mt-1.5 flex select-none flex-col justify-center font-nexa text-3xl font-normal text-primary antialiased">
                                    Celer
                                </h2>
                                <p className="flex flex-col justify-center text-xs font-semibold text-primary">
                                    <Slash className="-mr-3 mt-1 h-5 w-5 -rotate-45 text-gray-200" />
                                </p>
                                <Image
                                    src="/images/logo/celer-ia-only-logo.svg"
                                    alt="Celler IA Engine"
                                    width={56}
                                    height={50}
                                    className="mt-[6.1px] select-none antialiased"
                                    aria-selected={false}
                                    draggable={false}
                                />
                            </div>
                            <p className="apexcharts-legend-text mt-0 text-center text-sm font-normal">
                                Nosso modelo de atualização de valores de precatórios e RPVs
                            </p>
                        </div>
                        <span
                            title='fechar'
                            onClick={() => setModalOpen(false)}
                            className='cursor-pointer flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 w-6 h-6 rounded-full transition-colors duration-200'
                        >
                            <BiX className='text-2xl' />
                        </span>
                    </div>

                    <div className='grid grid-cols-12 overflow-y-scroll gap-4 h-[83%]'>
                        {/* form */}
                        <div className='col-span-12 xl:col-span-7 p-3'>
                            <div className="flex 2xsm:w-full lg:w-1/2 mx-auto flex-col justify-center col-span-12">
                                <UpdatePrecatorioButton setStateFunction={setOficioForm} />
                            </div>
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
                                            defaultValue={"NÃO TRIBUTÁRIA"}
                                            className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                            {...register("tipo_do_oficio")}
                                        >
                                            {enumTipoOficiosList.map((status) => (
                                                <option key={status} value={status}>{status}</option>
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
                                            defaultValue={"NÃO TRIBUTÁRIA"}
                                            className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                            {...register("natureza")}
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
                                            defaultValue={"FEDERAl"}
                                            className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                            {...register("esfera")}
                                        >
                                            <option value="FEDERAL">Federal</option>
                                            <option value="ESTADUAL">Estadual</option>
                                            <option value="MUNICIPAL">Municipal</option>
                                        </select>
                                        {/* <ShadSelect defaultValue="FEDERAL" name="esfera" control={control}>
                                            <SelectItem value="FEDERAL">Federal</SelectItem>
                                            <SelectItem value="ESTADUAL">Estadual</SelectItem>
                                            <SelectItem value="MUNICIPAL">Municipal</SelectItem>
                                        </ShadSelect> */}
                                    </div>
                                    {watch("esfera") !== "FEDERAL" && watch("esfera") !== undefined &&
                                        (<div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                            <label
                                                htmlFor="regime"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Regime
                                            </label>
                                            <select
                                                defaultValue={""}
                                                className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                                {...register("regime")}
                                            >
                                                <option value="GERAL">geral</option>
                                                <option value="ESPECIAL">especial</option>
                                            </select>
                                            {/* <ShadSelect name="regime" control={control} defaultValue="GERAL">
                                                <SelectItem value="GERAL">GERAL</SelectItem>
                                                <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                                            </ShadSelect> */}
                                        </div>)
                                    }

                                    <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                        <label
                                            htmlFor="tribunal"
                                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                        >
                                            Tribunal
                                        </label>

                                        <select
                                            defaultValue={""}
                                            className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                            {...register("tribunal")}
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
                                            rules={{ min: { value: 0.01, message: "O valor deve ser maior que 0" } }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <Cleave
                                                        {...field}
                                                        className={`w-full rounded-md border ${error ? "border-red" : "border-strokedark"} bg-boxdark-2 px-3 py-2 text-sm font-medium text-bodydark`}
                                                        options={{
                                                            numeral: true,
                                                            numeralThousandsGroupStyle: "thousand",
                                                            numeralDecimalScale: 2,
                                                            numeralDecimalMark: ",",
                                                            delimiter: ".",
                                                            prefix: "R$ ",
                                                            rawValueTrimPrefix: true,
                                                        }}
                                                    />
                                                    {error && <span className="text-xs font-medium text-red absolute right-2 top-8.5">{error.message}</span>}
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
                                            rules={{ min: { value: 0.01, message: "O valor deve ser maior que 0" } }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <Cleave
                                                        {...field}
                                                        className={`w-full rounded-md border ${error ? "border-red" : "border-strokedark"} bg-boxdark-2 px-3 py-2 text-sm font-medium text-bodydark`}
                                                        options={{
                                                            numeral: true,
                                                            numeralPositiveOnly: true,
                                                            numeralThousandsGroupStyle: "thousand",
                                                            numeralDecimalScale: 2,
                                                            numeralDecimalMark: ",",
                                                            delimiter: ".",
                                                            prefix: "R$ ",
                                                            rawValueTrimPrefix: true,
                                                        }}
                                                    />
                                                    {error && <span className="text-xs font-medium text-red absolute right-2 top-8.5">{error.message}</span>}
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
                                                className={`${errors.data_base && "!border-red !ring-0"} w-full rounded-md border bg-white px-3 py-2 text-sm font-medium border-stroke dark:border-strokedark dark:bg-boxdark-2`}
                                                {...register("data_base", {
                                                    required: "Campo obrigatório",
                                                })}
                                                aria-invalid={errors.data_base ? "true" : "false"}
                                            />
                                            {errors.data_base && <span className='text-red font-medium absolute top-7.5 right-8.5 text-xs'>campo obrigatório</span>}
                                        </div>
                                    </div>

                                    {watch("tipo_do_oficio") !== "CREDITÓRIO" ? (
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
                                                    className={`${errors.data_requisicao && "!border-red !ring-0"} w-full rounded-md border bg-white px-3 py-2 text-sm font-medium border-stroke dark:border-strokedark dark:bg-boxdark-2`}
                                                    {...register("data_requisicao", {
                                                        required: "Campo obrigatório",
                                                    })}
                                                />
                                                {errors.data_requisicao && <span className='text-red font-medium absolute top-7.5 right-8.5 text-xs'>campo obrigatório</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='hidden sm:block col-span-1'></div>
                                    )}

                                    {(watch("esfera") !== "FEDERAL" && watch("esfera") !== undefined) && (
                                        <div className='col-span-1'></div>
                                    )}

                                    <div
                                        className={`flex items-center max-h-6 col-span-2 md:col-span-1 gap-2`}
                                    >

                                        <CustomCheckbox
                                            check={watch("valor_aquisicao_total")}
                                            id={'valor_aquisicao_total'}
                                            defaultChecked
                                            register={register("valor_aquisicao_total")}
                                        />

                                        <label
                                            htmlFor="valor_aquisicao_total"
                                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                        >
                                            Aquisição total
                                        </label>
                                    </div>

                                    {/* ====> label PERCENTUAL DE AQUISIÇÃO <==== */}
                                    {watch("valor_aquisicao_total") === false ? (
                                        <div className="mt-1 flex flex-col gap-2 2xsm:col-span-2 md:col-span-1 overflow-hidden">
                                            <label
                                                htmlFor="percentual_a_ser_adquirido"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Percentual de aquisição (%)
                                            </label>
                                            <input
                                                type="number"
                                                id="percentual_a_ser_adquirido"
                                                defaultValue={100}
                                                className="w-full rounded-md border bg-white px-3 py-2 text-sm font-medium border-stroke dark:border-strokedark dark:bg-boxdark-2"
                                                min={0}
                                                {...register("percentual_a_ser_adquirido", {
                                                    required: "Campo obrigatório",
                                                    setValueAs: (value) => {
                                                        return parseInt(value);
                                                    },
                                                })}
                                            />
                                        </div>
                                    ) : (
                                        <div className='hidden md:block col-span-1'></div>
                                    )}
                                    {/* ====> end label PERCENTUAL DE AQUISIÇÃO <==== */}

                                    {(watch("especie") === "PRINCIPAL" ||
                                        watch("especie") === undefined) && (
                                            <div className="flex w-full flex-col justify-between gap-4 sm:flex-row col-span-2">
                                                <div className={`flex flex-row ${watch('ja_possui_destacamento') ? 'items-center' : 'items-start'} w-full gap-2 2xsm:col-span-2 sm:col-span-1`}>
                                                    <CustomCheckbox
                                                        check={watch("ja_possui_destacamento")}
                                                        id={'ja_possui_destacamento'}
                                                        register={register("ja_possui_destacamento")}
                                                        defaultChecked
                                                    />

                                                    <label
                                                        htmlFor="ja_possui_destacamento"
                                                        className={`${!watch('ja_possui_destacamento') && 'mt-1'} font-nexa text-xs font-semibold uppercase text-meta-5`}
                                                    >
                                                        Já possui destacamento de honorários?
                                                    </label>
                                                </div>
                                                {watch('ja_possui_destacamento') === false && (<div className=" flex w-full flex-row justify-between gap-4 sm:col-span-2">
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
                                                            {...register("percentual_de_honorarios", {})}
                                                        />
                                                    </div>
                                                </div>)}
                                            </div>
                                        )}

                                    <div
                                        className={`flex items-center col-span-2 md:col-span-1 gap-2 ${watch("data_base")! < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                                    >

                                        <CustomCheckbox
                                            check={watch("incidencia_juros_moratorios")}
                                            id={'incidencia_juros_moratorios'}
                                            defaultChecked
                                            register={register("incidencia_juros_moratorios")}
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
                                        className={`flex items-center col-span-2 gap-2 ${watch("data_base")! > "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                                    >

                                        <CustomCheckbox
                                            check={watch("nao_incide_selic_no_periodo_db_ate_abril")}
                                            id={'nao_incide_selic_no_periodo_db_ate_abril'}
                                            register={register("nao_incide_selic_no_periodo_db_ate_abril")}
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
                                    <div className="flex items-center gap-2 col-span-2">
                                        <CustomCheckbox
                                            check={watch("incidencia_rra_ir")}
                                            id={'incidencia_rra_ir'}
                                            defaultChecked
                                            register={register("incidencia_rra_ir")}
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
                                    {watch("natureza") === "TRIBUTÁRIA" ||
                                        watch("incidencia_rra_ir") === false ? (
                                        <>
                                            {/* {watch("natureza") === "TRIBUTÁRIA" && watch("incidencia_rra_ir") === false ? null : (
                  <div className="flex items-center col-span-1">&nbsp;</div>
                )} */}
                                        </>
                                    ) : (
                                        <div className={`flex gap-2 h-6 2xsm:col-span-2 md:col-span-1`}>
                                            <CustomCheckbox
                                                check={watch("ir_incidente_rra")}
                                                id={'ir_incidente_rra'}
                                                register={register("ir_incidente_rra")}
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

                                    {(watch("ir_incidente_rra") && watch("incidencia_rra_ir") === true &&
                                        watch("natureza") !== "TRIBUTÁRIA") ? (
                                        <div className="mt-1 flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1 overflow-hidden">
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
                                                {...register("numero_de_meses", {
                                                    required: "Campo obrigatório",
                                                    setValueAs: (value) => {
                                                        return parseInt(value);
                                                    },
                                                })}
                                            />
                                        </div>
                                    ) : (
                                        <div className='hidden md:block col-span-1'></div>
                                    )}
                                    {watch("natureza") !== "TRIBUTÁRIA" ? (
                                        <div className={`flex gap-2 ${watch('incidencia_pss') ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}>
                                            <CustomCheckbox
                                                check={watch("incidencia_pss")}
                                                id={'incidencia_pss'}
                                                register={register("incidencia_pss")}
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
                                    {watch("incidencia_pss") && watch("natureza") !== "TRIBUTÁRIA" ? (
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
                                                            numeralThousandsGroupStyle: "thousand",
                                                            numeralDecimalScale: 2,
                                                            numeralDecimalMark: ",",
                                                            delimiter: ".",
                                                            prefix: "R$ ",
                                                            rawValueTrimPrefix: true,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {watch('natureza') === 'TRIBUTÁRIA' ? null : (
                                                <div className="items-center hidden md:flex">&nbsp;</div>
                                            )}
                                        </>
                                    )}
                                    <div className={`flex gap-2 ${watch("data_limite_de_atualizacao_check") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}>
                                        <CustomCheckbox
                                            check={watch("data_limite_de_atualizacao_check")}
                                            id={'data_limite_de_atualizacao_check'}
                                            register={register("data_limite_de_atualizacao_check")}
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
                                    {watch("data_limite_de_atualizacao_check") ? (
                                        <div className="mt-1 flex flex-col gap-2 justify-between 2xsm:col-span-2 sm:col-span-1">
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
                                                {...register("data_limite_de_atualizacao", {})}
                                                min={watch("data_requisicao")}
                                                max={new Date().toISOString().split("T")[0]}
                                            />
                                            {watch("data_limite_de_atualizacao")! <
                                                watch("data_requisicao")! ? (
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
                                    <div className="flex flex-col gap-2 col-span-2">
                                        <div className="flex gap-2 items-center ">
                                            <CustomCheckbox
                                                check={watch("gerar_cvld")}
                                                id={'gerar_cvld'}
                                                register={register("gerar_cvld")}
                                            />
                                            {/* <input
                  type="checkbox"
                  id="gerar_cvld"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  {...register("gerar_cvld")}
                /> */}
                                            {/* <label htmlFor="gerar_cvld" className="text-sm font-medium text-meta-5">
                    Emitir Certidão de Valor Líquido Disponível (CVLD)?
                  </label> */}
                                            <label
                                                htmlFor="gerar_cvld"
                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                            >
                                                Salvar informações de ofício e recálculo?
                                            </label>
                                        </div>
                                        <div className="mt-8 flex flex-col gap-2">
                                            {watch("gerar_cvld") ? (
                                                <>
                                                    <div className="mb-4 w-full">
                                                        <span className="text-md w-full self-center font-semibold">
                                                            Dados de Identificação
                                                        </span>
                                                    </div>

                                                    <div className='grid grid-cols-2 gap-4 mb-4'>

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
                                                                {...register("credor", {})}
                                                            />
                                                        </div>

                                                        <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                                            <label
                                                                htmlFor="cpf_cnpj"
                                                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                                            >
                                                                CPF/CNPJ
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="cpf_cnpj"
                                                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                                                {...register("cpf_cnpj", {})}
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
                                                                    defaultValue={""}
                                                                    className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                                                    {...register("especie")}
                                                                >
                                                                    <option value="Principal">principal</option>
                                                                    <option value="Honorários Contratuais">honorários contratuais</option>
                                                                    <option value="Honorários Sucumbenciais">honorários sucumbenciais</option>
                                                                </select>

                                                                {/* <ShadSelect
                                                                    name="especie"
                                                                    control={control}
                                                                    defaultValue="PRINCIPAL"
                                                                >
                                                                    <SelectItem value="PRINCIPAL">PRINCIPAL</SelectItem>
                                                                    <SelectItem value="HONORARIOS_CONTRATUAIS">
                                                                        HONORÁRIOS CONTRATUAIS
                                                                    </SelectItem>
                                                                    <SelectItem value="HONORARIOS_SUCUMBENCIAs">
                                                                        HONORÁRIOS SUCUMBENCIAIS
                                                                    </SelectItem>
                                                                </ShadSelect> */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <span className="text-md w-full self-center font-semibold mb-4">
                                                        Dados do Processo
                                                    </span>

                                                    <div className='grid grid-cols-2 gap-4'>
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
                                                                            delimiters: ["-", ".", ".", ".", "."],
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
                                                                            delimiters: ["-", ".", ".", ".", "."],
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
                                                                {...register("ente_devedor", {})}
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
                                                                defaultValue={""}
                                                                className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                                                {...register("estado_ente_devedor")}
                                                            >
                                                                {estados.map((estado) => (
                                                                    <option key={estado.id} value={estado.id}>
                                                                        {estado.nome}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {/* <ShadSelect
                                                                name="estado_ente_devedor"
                                                                control={control}
                                                            >
                                                                {estados.map((estado) => (
                                                                    <SelectItem key={estado.id} value={estado.id}>
                                                                        {estado.nome}
                                                                    </SelectItem>
                                                                ))}
                                                            </ShadSelect> */}
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
                                                                {...register("juizo_vara", {})}
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
                                                                defaultValue={""}
                                                                className="cursor-pointer flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-stroke dark:border-strokedark bg-background px-2 py-2 h-[37px] ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2 focus-visible:outline-none focus-visible:ring-0"
                                                                {...register("status")}
                                                            >
                                                                <option value="Negociação em Andamento">negociação em andamento</option>
                                                                <option value="Proposta aceita">proposta aceita</option>
                                                            </select>

                                                            {/* <ShadSelect
                                                                name="status"
                                                                control={control}
                                                                defaultValue={enumOficiosList[0]}
                                                            >
                                                                {enumOficiosList.map((status) => (
                                                                    <SelectItem key={status} value={status}>
                                                                        {status}
                                                                    </SelectItem>
                                                                ))}
                                                            </ShadSelect> */}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        {(data.role === "ativos" || data.role === "judit") &&
                                            watch("gerar_cvld") ? (
                                            <>
                                                <hr className="col-span-2 my-8 border border-stroke dark:border-strokedark" />
                                                <div className="flex flex-col gap-2">
                                                    {(data.role === "ativos" && watch("regime") !== "ESPECIAL" || watch('regime') === undefined) ? (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <div className="flex gap-2 items-center">
                                                                    <CustomCheckbox
                                                                        check={watch("vincular_usuario")}
                                                                        id={'vincular_usuario'}
                                                                        register={register("vincular_usuario")}
                                                                    />

                                                                    <label htmlFor="vincular_usuario" className="text-sm font-medium text-meta-5 flex flex-row align-self-baseline cursor-pointer">
                                                                        <BiLogoUpwork className="h-4 w-4 mt-0.5 mr-2" /> Vincular a outro usuário?
                                                                    </label>
                                                                </div>
                                                                {(watch("novo_usuario") === false || watch("novo_usuario") === undefined) && watch("vincular_usuario") === true && (
                                                                    <div className="flex gap-2 items-center">
                                                                        <button
                                                                            type="button"
                                                                            className="py-1 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                                                            onClick={updateUsersList}
                                                                        >
                                                                            {fetchingUsersList ? (
                                                                                <>
                                                                                    <AiOutlineReload className="animate-spin" />
                                                                                    <span className="text-xs">Atualizando...</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <AiOutlineReload />
                                                                                    <span className="text-xs">Atualizar</span>
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        {fetchError && (
                                                                            <div className='relative group/warning'>
                                                                                <AiOutlineWarning className="text-red-600 dark:text-red-400 cursor-pointer" />
                                                                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-60 p-4 bg-white border border-stroke dark:bg-boxdark dark:border-form-strokedark text-sm rounded-md opacity-0 group-hover/warning:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                                                    <span>
                                                                                        Erro ao atualizar os dados. Tente novamente mais tarde.
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {watch("vincular_usuario") === true ? (
                                                                <div className="flex flex-col gap-2">
                                                                    {
                                                                        (watch("novo_usuario") === false || watch("novo_usuario") === undefined) && watch("vincular_usuario") === true && (

                                                                            <select id="username" className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark" {...register("username")}>
                                                                                <option value={data.user}>{
                                                                                    data.user
                                                                                }</option>
                                                                                {
                                                                                    usersList.filter(user => user !== data.user).map((user) => (
                                                                                        <option key={user} value={user}>{user}</option>
                                                                                    ))
                                                                                }
                                                                            </select>

                                                                        )}
                                                                    <div className="flex flex-col gap-2">
                                                                        <div>
                                                                            <label htmlFor="novo_usuario" className="text-sm font-medium text-meta-5 cursor-pointer flex items-center gap-1">
                                                                                <CustomCheckbox
                                                                                    check={watch("novo_usuario")}
                                                                                    id={'novo_usuario'}
                                                                                    register={register("novo_usuario")}
                                                                                />
                                                                                <span>O nome não está na lista? Crie um novo usuário!</span>

                                                                            </label>
                                                                        </div>
                                                                        {watch('novo_usuario') === true &&
                                                                            <input
                                                                                type="text"
                                                                                id="username"
                                                                                className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                                                {...register("username")}
                                                                            />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </>

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
                                        <span className="text-[16px] font-medium" aria-disabled={loading}>
                                            {loading ? "Fazendo cálculo..." : "Calcular"}
                                        </span>
                                        {!loading ? (
                                            <BiLineChart className="ml-2 mt-[0.2rem] h-4 w-4" />
                                        ) : (
                                            <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* results */}
                        <div
                            ref={resultContainerRef}
                            className='col-span-12 xl:col-span-5 pt-3 pb-20 px-4 xl:border-l border-stroke dark:border-strokedark'>
                            {loading ? (
                                <NewFormResultSkeleton />
                            ) : (
                                <>
                                    {
                                        showResults ? (
                                            <div className='flex flex-col'>
                                                <div className='flex flex-col gap-2 mb-6'>
                                                    <h2 className="text-xl font-medium uppercase">
                                                        Tudo pronto!
                                                    </h2>
                                                    <p className="2xsm:text-center sm:text-left text-sm text-slate-400">
                                                        Abaixo foram gerados os valores mínimos e máximos de
                                                        proposta e comissão. Mova os sliders para alterar os valores
                                                        proporcionalmente.
                                                    </p>
                                                </div>
                                                <div className="flex items-center p-2 sm:mb-4 justify-between gap-5 2xsm:flex-col md:flex-row">
                                                    <div className="relative flex flex-col md:items-center">
                                                        <h4 className="">Proposta Mínima</h4>
                                                        <span>{numberFormat(proposalValue.min)}</span>
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center gap-1">
                                                        <span className="text-sm font-medium">
                                                            Proposta Atual: {numberFormat(sliderValues.proposal)}
                                                        </span>
                                                        <input
                                                            type="range"
                                                            step="0.01"
                                                            min={proposalValue.min}
                                                            max={proposalValue.max}
                                                            value={sliderValues.proposal}
                                                            onChange={handleProposalSliderChange}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="">Proposta Máxima</h4>
                                                        <span>{numberFormat(proposalValue.max)}</span>
                                                    </div>
                                                </div>

                                                <div className='w-full h-px bg-stroke dark:bg-strokedark sm:hidden my-4'></div>

                                                <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="">Comissão Mínima</h4>
                                                        <span>{numberFormat(comissionValue.min)}</span>
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center gap-1">
                                                        <span className="text-sm font-medium">
                                                            Comissão Atual: {numberFormat(sliderValues.comission)}
                                                        </span>
                                                        <input
                                                            type="range"
                                                            step="0.01"
                                                            min={comissionValue.min}
                                                            max={comissionValue.max}
                                                            value={sliderValues.comission}
                                                            onChange={handleComissionSliderChange}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="">Comissão Máxima</h4>
                                                        <span>{numberFormat(comissionValue.max)}</span>
                                                    </div>
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-2 md:gap-3 mt-6'>
                                                    {/* {
                                                        result.result[0].link_memoria_de_calculo_rra && (
                                                            <li className="text-sm flex  w-full py-1">
                                                                <a href={linkAdapter(result.result[0].link_memoria_de_calculo_rra)} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
                                                                    <span className="text-[16px] font-medium">
                                                                        Memória de Cálculo RRA
                                                                    </span>
                                                                    <BiDownload style={{
                                                                        width: "22px",
                                                                        height: "22px",
                                                                    }} className="ml-2" />
                                                                </a>
                                                            </li>
                                                        )
                                                    } */}
                                                    <li className="text-sm flex w-full">
                                                        <a href={calculationMemory.simple || ""} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold dark:text-white rounded-md bg-slate-200 dark:bg-boxdark-2/90 hover:bg-slate-300 dark:hover:bg-boxdark-2 border border-stroke dark:border-strokedark">
                                                            <span className="font-medium">
                                                                Memória de Cálculo Simples
                                                            </span>
                                                            <BiDownload style={{
                                                                width: "20px",
                                                                height: "20px",
                                                            }} className="ml-2 self-center" />
                                                        </a>
                                                    </li>
                                                    <li className="text-sm flex w-full">
                                                        <a href={calculationMemory.rra || ""} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold dark:text-white rounded-md bg-slate-200 dark:bg-boxdark-2/90 hover:bg-slate-300 dark:hover:bg-boxdark-2 border border-stroke dark:border-strokedark">
                                                            <span className="font-medium">
                                                                Memória de Cálculo RRA
                                                            </span>
                                                            <BiDownload style={{
                                                                width: "20px",
                                                                height: "20px",
                                                            }} className="ml-2 self-center" />
                                                        </a>
                                                    </li>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col justify-between w-fit mx-auto gap-5 items-center">
                                                <h4 className="text-xl font-semibold text-black dark:text-white">
                                                    Ainda sem resultados
                                                </h4>
                                                <Image
                                                    src="/images/search-results.svg"
                                                    alt="mulher procurando resultados"
                                                    width={200}
                                                    height={450}
                                                    aria-selected={false}
                                                    draggable={false}
                                                />
                                                <span
                                                    className="text-center select-none text-sm">
                                                    Opa! Parece que ainda não há resultados disponíveis.
                                                </span>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>
                </div >
            </Fade >
        </div >
    )
}

export default NewForm