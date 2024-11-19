import numberFormat from '@/functions/formaters/numberFormat'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import CustomCheckbox from '../CrmUi/Checkbox';
import { BiCheck, BiSave, BiX } from 'react-icons/bi';
import { BsCheckCircleFill, BsPencilSquare } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa';
import { Button } from '../Button';
import { NotionPage, NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import { toast } from 'sonner';
import { formatCurrency } from '@/functions/formaters/formatCurrency';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { Controller, useForm } from 'react-hook-form';
import { CvldFormInputsProps } from '@/types/cvldform';
import tipoOficio from '@/enums/tipoOficio.enum';
import { tribunais } from '@/constants/tribunais';
import Cleave from 'cleave.js/react';
import { estados } from '@/constants/estados';
import { AiOutlineLoading } from 'react-icons/ai';
import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { useMutation } from '@tanstack/react-query';
import { IoCloseCircle } from 'react-icons/io5';
import { MdOutlineCircle } from 'react-icons/md';
import CRMTooltip from '../CrmUi/Tooltip';
import { GrDocumentUser } from 'react-icons/gr';
import { BrokersContext } from '@/context/BrokersContext';
import { RiErrorWarningFill } from 'react-icons/ri';
import { applyMaskCpfCnpj } from '@/functions/formaters/maskCpfCnpj';
import { IdentificationType } from '../Modals/BrokersCedente';
import { NotionNumberFormater } from '@/functions/formaters/notionNumberFormater';

export type ChecksProps = {
    is_precatorio_complete: boolean | null;
    is_cedente_complete: boolean | null;
    are_docs_complete: boolean | null;
    isFetching: boolean;
}

const DashbrokersCard = ({ oficio, editModalId, setEditModalId }:
    {
        oficio: NotionPage,
        editModalId: string | null,
        setEditModalId: React.Dispatch<React.SetStateAction<string | null>>
    }
) => {

    /* ====> context imports <==== */
    const { setCardsData,
        cardsData, setCedenteModal,
        isFetchAllowed, setIsFetchAllowed,
        setDocModalInfo, fetchDetailCardData, specificCardData, selectedUser
    } = useContext(BrokersContext);

    /* ====> form imports <==== */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch
    } = useForm<Partial<CvldFormInputsProps>>({
        defaultValues: {
            tipo_do_oficio: oficio.properties["Tipo"].select?.name || "PRECATÓRIO",
            natureza: oficio.properties["Natureza"].select?.name || "NÃO TRIBUTÁRIA",
            esfera: oficio.properties["Esfera"].select?.name || "FEDERAL",
            regime: oficio.properties["Regime"].select?.name || "GERAL",
            tribunal: oficio.properties["Tribunal"].select?.name || "STJ",
            valor_principal: NotionNumberFormater(oficio.properties["Valor Principal"].number || 0),
            valor_juros: NotionNumberFormater(oficio.properties["Valor Juros"].number || 0),
            data_base: oficio.properties["Data Base"].date?.start || "",
            data_requisicao: oficio.properties["Data do Recebimento"].date?.start || "",
            valor_aquisicao_total: oficio.properties["Percentual a ser adquirido"].number === 1,
            percentual_a_ser_adquirido: oficio.properties["Percentual a ser adquirido"].number! * 100 || 0,
            ja_possui_destacamento: oficio.properties["Honorários já destacados?"].checkbox,
            percentual_de_honorarios: oficio.properties["Percentual de Honorários Não destacados"].number! * 100 || 0,
            incidencia_rra_ir: oficio.properties["Incidencia RRA/IR"].checkbox,
            ir_incidente_rra: oficio.properties["IR Incidente sobre RRA"].checkbox,
            incidencia_pss: oficio.properties["PSS"].number! > 0,
            valor_pss: oficio.properties["PSS"].number || 0,
            numero_de_meses: oficio.properties["Meses RRA"].number || 0,
            credor: oficio.properties["Credor"].title[0]?.text.content || "",
            cpf_cnpj: oficio.properties["CPF/CNPJ"].rich_text?.[0]?.text.content || "",
            especie: oficio?.properties?.["Espécie"].select?.name || "Principal",
            npu: oficio.properties["NPU (Precatório)"].rich_text?.[0]?.text.content || "",
            npu_originario: oficio?.properties?.["NPU (Originário)"].rich_text?.[0]?.text.content || "",
            ente_devedor: oficio.properties["Ente Devedor"].select?.name || "",
            estado_ente_devedor: oficio.properties["Estado do Ente Devedor"].select?.name || "",
            juizo_vara: oficio.properties["Juízo"].rich_text?.[0]?.text.content || "",
            status: oficio.properties["Status"].status?.name || "",
            upload_notion: true,
        }
    })
    const enumTipoOficiosList = Object.values(tipoOficio);

    /* ====> value states <==== */
    const [auxProposalValue, setAuxProposalValue] = useState<number>(0);
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
    const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
    const [savingObservation, setSavingObservation] = useState<boolean>(false);
    const [isProposalButtonDisabled, setIsProposalButtonDisabled] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const [credorIdentificationType, setCredorIdentificationType] = useState<IdentificationType>(null);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [checks, setChecks] = useState<ChecksProps>({
        is_precatorio_complete: false,
        is_cedente_complete: false,
        are_docs_complete: false,
        isFetching: false
    });

    /* ====> refs <==== */
    const proposalRef = useRef<HTMLInputElement | null>(null);
    const comissionRef = useRef<HTMLInputElement | null>(null);
    const observationRef = useRef<HTMLTextAreaElement | null>(null);

    //* ====> Principal Data <==== */
    const [mainData, setMainData] = useState<NotionPage>(oficio);

    // Função responsável por fazer fetch em todos os estados dos checks
    const fetchAllChecks = async () => {

        setChecks((old) => (
            {
                ...old,
                isFetching: true
            }
        ));

        const cedenteType = credorIdentificationType === "CPF" ? "Cedente PF" : "Cedente PJ";

        const idCedente = mainData.properties[cedenteType].relation?.[0] ?
            mainData.properties[cedenteType].relation?.[0].id :
            null;

        try {

            const req = credorIdentificationType === "CPF" ?
                await api.get(`/api/checker/pf/complete/precatorio/${mainData.id}/cedente/${idCedente}/`) :
                await api.get(`/api/checker/pj/complete/precatorio/${mainData.id}/cedente/${idCedente}/`);

            if (req.status === 200) {
                setChecks((old) => ({
                    ...old,
                    is_precatorio_complete: req.data.is_precatorio_complete,
                    is_cedente_complete: req.data.is_cedente_complete,
                    are_docs_complete: req.data.are_docs_complete
                }))
            }

        } catch (error) {
            toast.error('Erro ao buscar info dos checks', {
                classNames: {
                    toast: "bg-white dark:bg-boxdark",
                    title: "text-black-2 dark:text-white",
                    actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                },
                icon: <BiX className="text-lg fill-red-500" />,
                action: {
                    label: "OK",
                    onClick() {
                        toast.dismiss();
                    },
                }
            });
        } finally {
            setChecks((old) => (
                {
                    ...old,
                    isFetching: false
                }
            ));
        }

    };

    // Função para atualizar a proposta e ajustar a comissão proporcionalmente
    const handleProposalSliderChange = (
        value: string,
        sliderChange: boolean
    ) => {

        const newProposalSliderValue = parseFloat(value);

        if (newProposalSliderValue !== auxProposalValue) {
            setIsProposalButtonDisabled(false);
        } else {
            setIsProposalButtonDisabled(true);
        }

        // seta o valor do slide como o valor atual
        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });

        // Calcular a proporção em relação a proposta e ajustar a comissão
        const proportion =
            (newProposalSliderValue - (oficio.properties["(R$) Proposta Mínima - Celer"].number || 0)) /
            ((oficio.properties["(R$) Proposta Máxima - Celer"].number || 0) - (oficio.properties["(R$) Proposta Mínima - Celer"].number || 0));

        // define o novo valor da comissão em relação a proporção
        const newComissionSliderValue =
            (oficio.properties["(R$) Comissão Máxima - Celer"].number || 0) -
            proportion * ((oficio.properties["(R$) Comissão Máxima - Celer"].number || 0) - (oficio.properties["(R$) Comissão Mínima - Celer"].number || 0));

        setSliderValues((oldValues) => {
            return { ...oldValues, comission: newComissionSliderValue };
        });

        if (comissionRef.current && proposalRef.current) {
            comissionRef.current.value = numberFormat(newComissionSliderValue)
            if (sliderChange) {
                proposalRef.current.value = numberFormat(newProposalSliderValue)
            }
        }
    };

    // Função para atualizar a comissão e ajustar a proposta proporcionalmente
    const handleComissionSliderChange = (
        value: string,
        sliderChange: boolean
    ) => {

        // seta o valor da slider como o atual
        const newComissionSliderValue = parseFloat(value);
        setSliderValues((oldValues) => {
            return { ...oldValues, comission: newComissionSliderValue };
        });

        // Calcular a proporção em relação a comissão e ajustar a proposta
        const proportion =
            (newComissionSliderValue - (oficio.properties["(R$) Comissão Mínima - Celer"].number || 0)) /
            ((oficio.properties["(R$) Comissão Máxima - Celer"].number || 0) - (oficio.properties["(R$) Comissão Mínima - Celer"].number || 0));

        //  define o novo valor da proposta em relação a proporção
        const newProposalSliderValue =
            (oficio.properties["(R$) Proposta Máxima - Celer"].number || 0) - proportion * ((oficio.properties["(R$) Proposta Máxima - Celer"].number || 0) - (oficio.properties["(R$) Proposta Mínima - Celer"].number || 0));

        if (newProposalSliderValue !== auxProposalValue) {
            setIsProposalButtonDisabled(false);
        } else {
            setIsProposalButtonDisabled(true);
        }

        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });

        if (proposalRef.current && comissionRef.current) {
            proposalRef.current.value = numberFormat(newProposalSliderValue)
            if (sliderChange) {
                comissionRef.current.value = numberFormat(newComissionSliderValue)
            }
        }
    };

    // Função para atualizar proposta/comissão com os dados dos inputs
    const changeInputValues = (inputField: string, value: string) => {
        const rawValue = value.replace(/R\$\s*/g, "").replaceAll(".", "").replaceAll(",", ".");
        const numericalValue = parseFloat(rawValue);

        if (
            numericalValue >= (oficio.properties["(R$) Proposta Mínima - Celer"].number || 0) &&
            numericalValue <= (oficio.properties["(R$) Proposta Máxima - Celer"].number || 0) &&
            !isNaN(numericalValue) &&
            numericalValue !== auxProposalValue
        ) {
            setIsProposalButtonDisabled(false);
        } else {
            setIsProposalButtonDisabled(true);
        }

        switch (inputField) {
            case "proposal":

                if (
                    numericalValue < (oficio.properties["(R$) Proposta Mínima - Celer"].number || 0) ||
                    numericalValue > (oficio.properties["(R$) Proposta Máxima - Celer"].number || 0) ||
                    isNaN(numericalValue)
                ) {
                    setErrorMessage(true);
                    return;
                } else {
                    setErrorMessage(false);
                }

                setSliderValues(old => {
                    return {
                        ...old,
                        proposal: parseFloat(rawValue)
                    }
                });
                handleProposalSliderChange(rawValue, false);
                break;
            case "comission":

                if (
                    numericalValue < (oficio.properties["(R$) Comissão Mínima - Celer"].number || 0) ||
                    numericalValue > (oficio.properties["(R$) Comissão Máxima - Celer"].number || 0) ||
                    isNaN(numericalValue)
                ) {
                    setErrorMessage(true);
                    return;
                } else {
                    setErrorMessage(false);
                }
                setSliderValues(old => {
                    return {
                        ...old,
                        comission: parseFloat(rawValue)
                    }
                });
                handleComissionSliderChange(rawValue, false);
                break;
            default:
                break;
        }

    }

    const saveProposalAndComission = async () => {
        setSavingProposalAndComission(true);
        const req = await api.patch(`/api/notion-api/broker/negotiation/${oficio.id}/`,
            {
                proposal: sliderValues.proposal,
                commission: sliderValues.comission
            }
        )

        if (req.status === 202) {
            toast.success('Proposta e comissão salvas com sucesso!', {
                icon: <BiCheck className="text-lg fill-green-400" />
            });
        }

        if (req.status === 400) {
            toast.error('Erro ao salvar proposta e comissão!', {
                icon: <BiX className="text-lg fill-red-500" />
            });
        }
        setSavingProposalAndComission(false);
    };

    const updateOficio = useMutation({
        mutationFn: async (data) => {
            const req = await api.patch(`/api/lead-magnet/update/${mainData.id}/`, data);
            return req.status;
        },
        onMutate: async () => {
            setIsSavingEdit(true);
            setIsFetchAllowed(false);
        },
        onError: () => {
            toast.error('Erro ao atualizar ofício', {
                classNames: {
                    toast: "bg-white dark:bg-boxdark",
                    title: "text-black-2 dark:text-white",
                    actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                },
                icon: <BiX className="text-lg fill-red-500" />,
                action: {
                    label: "OK",
                    onClick() {
                        toast.dismiss();
                    },
                }
            });
        },
        onSuccess: async () => {
            await fetchDetailCardData(mainData.id);
            setEditModalId(null);
            toast.success("Dados do ofício atualizados.", {
                classNames: {
                    toast: "bg-white dark:bg-boxdark",
                    title: "text-black-2 dark:text-white",
                    actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                },
                icon: <BiCheck className="text-lg fill-green-400" />,
                action: {
                    label: "OK",
                    onClick() {
                        toast.dismiss();
                    },
                }
            });
        },
        onSettled: () => {
            setIsSavingEdit(false);
            setIsFetchAllowed(true);
        }
    });

    const updateObservation = useMutation({
        mutationFn: async (message: string) => {
            const req = await api.patch(`api/notion-api/update/${mainData.id}/`, {
                "Observação": {
                    "rich_text": [
                        {
                            text: {
                                content: message
                            }
                        }
                    ]
                }
            });
            return req.status
        },
        onMutate: async (message: string) => {
            setSavingObservation(true);
            setIsFetchAllowed(false);
            const previousData = mainData;
            return { previousData }
        },
        onError: (error, message, context) => {
            setMainData(context?.previousData as NotionPage);
            toast.error('Erro ao atualizar a observação!', {
                classNames: {
                    toast: "bg-white dark:bg-boxdark",
                    title: "text-black-2 dark:text-white",
                    actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                },
                icon: <BiX className="text-lg fill-red-500" />,
                action: {
                    label: "OK",
                    onClick() {
                        toast.dismiss();
                    },
                }
            });
        },
        onSuccess: () => {
            toast.success("Campo atualizado!", {
                classNames: {
                    toast: "bg-white dark:bg-boxdark",
                    title: "text-black-2 dark:text-white",
                    actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                },
                icon: <BiCheck className="text-lg fill-green-400" />,
                action: {
                    label: "OK",
                    onClick() {
                        toast.dismiss();
                    },
                }
            });
        },
        onSettled: () => {
            setSavingObservation(false);
            setIsFetchAllowed(true);
        }
    });

    const proposalTrigger = useMutation({
        mutationFn: async (status: string) => {
            const req = status === "Proposta aceita" ? 
                await api.patch(`api/notion-api/broker/accept-proposal/${mainData.id}/`) : 
                await api.patch(`api/notion-api/broker/decline-proposal/${mainData.id}/`);
            return req.status
        },
        onMutate: async (status: string) => {
            setIsFetchAllowed(false);
            const previousData = mainData
            setMainData((old: any) => {
                return {
                    ...old,
                    properties: {
                        ...old.properties,
                        Status: {
                            ...old.properties.Status,
                            status: {
                                ...old.properties.Status.status,
                                name: status
                            }
                        }
                    }
                }
            })
            return { previousData }
        },
        onError: async (error, message, context) => {
            setIsFetchAllowed(true);
            setMainData(context?.previousData as NotionPage);
            toast.error('Erro ao aceitar proposta! Contate a Ativos para verificar o motivo.', {
                icon: <BiX className="text-lg fill-red-500" />
            });
        },
        onSuccess: async () => {
            setIsFetchAllowed(true);
            await fetchDetailCardData(mainData.id);
            if (mainData.properties["Status"].status?.name === "Proposta aceita") {
                toast.success('Proposta aceita. Verifique o status da diligência para mais informações!', {
                    icon: <BiCheck className="text-lg fill-green-400" />
                });
            } else {
                toast.success('Proposta cancelada! Você pode registrar o motivo no campo de observação.', {
                    icon: <BiCheck className="text-lg fill-green-400" />
                });

            }
        }
    });

    const handleUpdateObservation = async (message: string) => {
        await updateObservation.mutateAsync(message)
    };

    const handleUpdateStatus = async () => {
        const status = mainData.properties["Status"].status?.name === "Proposta aceita" ? "Negociação em Andamento" : "Proposta aceita";
        await proposalTrigger.mutateAsync(status);
    }

    const onSubmit = async (data: any) => {

        data.percentual_a_ser_adquirido /= 100;
        data.percentual_de_honorarios /= 100;

        if (typeof data.valor_principal === "string") {
            data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
            data.valor_principal = parseFloat(data.valor_principal);
        }

        if (typeof data.valor_juros === "string") {
            data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
            data.valor_juros = parseFloat(data.valor_juros);
        }

        if (typeof data.valor_pss) {
            data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
            data.valor_pss = parseFloat(data.valor_pss);
        }

        await updateOficio.mutateAsync(data);
    }

    useEffect(() => {

        if (specificCardData !== null && specificCardData.id === mainData.id) {
            setMainData(specificCardData);
        }

    }, [specificCardData])

    useEffect(() => {
        if (credorIdentificationType === null || !isFetchAllowed) return;

        async function refetchChecks() {
            await Promise.allSettled([
                fetchAllChecks()
            ])
            setIsFirstLoad(false);
        }

        refetchChecks();

    }, [credorIdentificationType, mainData]);

    useEffect(() => {

        setSliderValues({
            proposal: oficio.properties["Proposta Escolhida - Celer"].number || oficio.properties["(R$) Proposta Mínima - Celer"].number || 0,
            comission: oficio.properties["Comissão - Celer"].number || oficio.properties["(R$) Comissão Máxima - Celer"].number || 0
        });

        setAuxProposalValue(oficio.properties["Proposta Escolhida - Celer"].number || oficio.properties["(R$) Proposta Mínima - Celer"].number || 0)

        if (proposalRef.current && comissionRef.current && observationRef.current) {

            proposalRef.current.value = numberFormat(oficio.properties["Proposta Escolhida - Celer"].number || oficio.properties["(R$) Proposta Mínima - Celer"].number || 0)

            comissionRef.current.value = numberFormat(oficio.properties["Comissão - Celer"].number || oficio.properties["(R$) Comissão Máxima - Celer"].number || 0);

            observationRef.current.value = oficio?.properties?.["Observação"]?.rich_text!.length > 0 ? oficio.properties["Observação"].rich_text![0].text.content : "";

        }

    }, [oficio, isSavingEdit]);

    useEffect(() => {
        if (oficio === null) return;

        // verifica o tipo de identificação do credor e formata para só obter números na string
        const credorIdent = oficio.properties["CPF/CNPJ"].rich_text![0].text.content.replace(/\D/g, '');

        setCredorIdentificationType(credorIdent.length === 11 ? "CPF" : credorIdent.length === 14 ? "CNPJ" : null);
    }, [oficio]);

    return (
        <div className="relative col-span-1 gap-5 bg-white dark:bg-boxdark p-5 rounded-md border border-stroke dark:border-strokedark">
            {/* ----> info <----- */}
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5 grid gap-3">
                    <div className='text-sm'>
                        <p className='text-black dark:text-snow uppercase font-medium'>Nome do Credor:</p>
                        <CRMTooltip
                            text={mainData.properties["Credor"].title[0]?.text.content || "Não informado"}
                            arrow={false}
                        >
                            <p className='max-w-[220px] text-ellipsis overflow-hidden whitespace-nowrap uppercase text-xs font-semibold'>
                                {mainData.properties["Credor"].title[0]?.text.content || "Não informado"}
                            </p>
                        </CRMTooltip>
                    </div>

                    <div className='text-sm'>
                        <p className='text-black dark:text-snow uppercase font-medium'>CPF/CNPJ:</p>
                        <p className='uppercase text-xs font-semibold'>{applyMaskCpfCnpj(mainData.properties["CPF/CNPJ"].rich_text![0].text.content || "") || "Não informado"}</p>
                    </div>

                    <div className='text-sm'>
                        <p className='text-black dark:text-snow uppercase font-medium'>TRIBUNAL</p>
                        <p className='max-w-[220px] text-ellipsis overflow-hidden whitespace-nowrap uppercase text-xs font-semibold'>
                            {mainData.properties["Tribunal"].select?.name || "Não informado"}
                        </p>
                    </div>

                    <div className='text-sm'>
                        <p className='text-black dark:text-snow uppercase font-medium'>esfera:</p>
                        <p className='uppercase text-xs font-semibold'>{mainData.properties["Esfera"].select?.name || "Não informado"}</p>
                    </div>
                    <div className='text-sm'>
                        <p className='text-black dark:text-snow uppercase font-medium'>status:</p>
                        <p className='uppercase text-xs font-semibold'>{mainData.properties["Status"].status?.name || "Não informado"}</p>
                    </div>
                    <div className='text-sm'>
                        <p className='text-black dark:text-snow uppercase font-medium'>status diligência:</p>
                        <p className='uppercase text-xs font-semibold'>{mainData.properties["Status Diligência"].select?.name || "Não informado"}</p>
                    </div>

                    <div className='flex flex-col'>

                        <button
                            onClick={() => setEditModalId(mainData.id)}
                            className='flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm'>
                            <BsPencilSquare />
                            Editar Precatório
                        </button>

                        <button
                            onClick={() => setDocModalInfo(mainData)}
                            className={`${checks.is_cedente_complete !== null ? "opacity-100" : "opacity-50 cursor-not-allowed pointer-events-none"} flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm`}>
                            <FaRegFilePdf />
                            Cadastrar Documentos
                        </button>

                        <button
                            onClick={() => setCedenteModal(mainData)}
                            className='flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm'>
                            {(checks.is_cedente_complete !== null) ? (
                                <>
                                    <BsPencilSquare />
                                    Editar Cedente
                                </>
                            ) : (
                                <>
                                    <GrDocumentUser />
                                    Cadastrar Cedente
                                </>
                            )}
                        </button>

                    </div>


                    <div className="flex items-center gap-4 justify-between">
                        <div className='flex items-center gap-2'>

                            {(checks.isFetching && isFirstLoad) ? (
                                <AiOutlineLoading className='w-4 h-4 animate-spin' />
                            ) : (
                                <>
                                    {(checks.is_precatorio_complete) ? (
                                        <CRMTooltip text="Precatório Completo">
                                            <BsCheckCircleFill className='text-green-400' />
                                        </CRMTooltip>
                                    ) : (
                                        <CRMTooltip text="Precatório Incompleto">
                                            <IoCloseCircle className="text-red w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                </>
                            )}

                            {(checks.isFetching && isFirstLoad) ? (
                                <AiOutlineLoading className='w-4 h-4 animate-spin' />
                            ) : (
                                <>
                                    {(checks.is_cedente_complete === true) && (
                                        <CRMTooltip text="Cedente preenchido">
                                            <BsCheckCircleFill className='text-green-400' />
                                        </CRMTooltip>
                                    )}
                                    {(checks.is_cedente_complete === false) && (
                                        <CRMTooltip text="Cedente incompleto">
                                            <RiErrorWarningFill className="text-amber-300 w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                    {(checks.is_cedente_complete === null) && (
                                        <CRMTooltip text="Cedente não vinculado">
                                            <IoCloseCircle className="text-red w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                </>
                            )}

                            {(checks.isFetching && isFirstLoad) ? (
                                <AiOutlineLoading className='w-4 h-4 animate-spin' />
                            ) : (
                                <>
                                    {(checks.are_docs_complete === true) && (
                                        <CRMTooltip text="Dcumentos preenchidos">
                                            <BsCheckCircleFill className='text-green-400' />
                                        </CRMTooltip>
                                    )}
                                    {(checks.are_docs_complete === null) && (
                                        <CRMTooltip text="Documentos não vinculados">
                                            <IoCloseCircle className="text-red w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                    {(checks.are_docs_complete === false) && (
                                        <CRMTooltip text="Documentos incompletos">
                                            <RiErrorWarningFill className="text-amber-300 w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                </>
                            )}

                            <MdOutlineCircle className='w-4 h-4' />
                        </div>

                        <div
                            style={{
                                background: `${notionColorResolver(mainData.properties["Tipo"].select?.color || "")}`
                            }}
                            className='py-1 px-2 uppercase rounded-md text-black-2 font-medium text-xs'>
                            {mainData.properties["Tipo"].select?.name || "Não informado"}
                        </div>
                    </div>

                </div>

                {/* ----> divider <---- */}
                <div className='col-span-1 max-h-full w-[1px] bg-stroke dark:bg-strokedark ml-6'></div>
                {/* ----> end divider <---- */}

                <div className="col-span-6 grid gap-5">
                    <div className='flex justify-between'>
                        
                            <div className='flex gap-1 items-center justify-center w-fit disabled:cursor-not-allowed' >
                                <CustomCheckbox
                                    check={mainData.properties["Status"].status?.name === "Proposta aceita"}
                                    callbackFunction={handleUpdateStatus}
                                    disabled={checks.is_cedente_complete === null}
                                    className={
                                        checks.is_cedente_complete === null ?
                                            "cursor-not-allowed opacity-50" :
                                            "cursor-pointer"
                                    }
                                />
                                <span className='text-sm font-medium'>Proposta Aceita</span>
                            </div>

                    </div>
                    <div className='relative flex flex-col gap-5 max-h-fit'>
                        <div className="flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                            <div className="flex flex-1 flex-col items-center gap-1">
                                <div className="text-sm font-medium flex items-center">
                                    <p className="w-full text-sm">Proposta Atual:</p>
                                    <input
                                        ref={proposalRef}
                                        type="text"
                                        onBlur={e => {
                                            e.target.value = formatCurrency(e.target.value)
                                        }}
                                        onChange={e => changeInputValues("proposal", e.target.value)}
                                        className="max-w-35 text-center rounded-md border-none pr-2 pl-1 ml-2 py-2 text-sm font-medium text-body focus-visible:ring-body dark:focus-visible:ring-snow dark:bg-boxdark-2/50 dark:text-bodydark bg-gray-100"
                                    />
                                </div>
                                <input
                                    type="range"
                                    step="0.01"
                                    min={mainData.properties["(R$) Proposta Mínima - Celer"].number || 0}
                                    max={mainData.properties["(R$) Proposta Máxima - Celer"].number || 0}
                                    value={sliderValues.proposal}
                                    onChange={e => handleProposalSliderChange(e.target.value, true)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                            <div className="flex flex-1 flex-col items-center gap-1">
                                <div className="text-sm font-medium flex items-center">
                                    <p className="text-sm">Comissão Atual:</p>
                                    <input
                                        ref={comissionRef}
                                        type="text"
                                        onBlur={e => {
                                            e.target.value = formatCurrency(e.target.value)
                                        }}
                                        onChange={e => changeInputValues("comission", e.target.value)}
                                        className="max-w-35 text-center rounded-md border-none pr-2 pl-1 ml-2 py-2 text-sm font-medium text-body focus-visible:ring-body dark:focus-visible:ring-snow dark:bg-boxdark-2/50 dark:text-bodydark bg-gray-100"
                                    />
                                </div>
                                <input
                                    type="range"
                                    step="0.01"
                                    min={mainData.properties["(R$) Comissão Mínima - Celer"].number || 0}
                                    max={mainData.properties["(R$) Comissão Máxima - Celer"].number || 0}
                                    value={sliderValues.comission}
                                    onChange={e => handleComissionSliderChange(e.target.value, true)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className='absolute -bottom-4 w-full text-red text-xs text-center'>Valor&#40;res&#41; fora do escopo definido</div>
                        )}
                    </div>

                    <Button
                        disabled={isProposalButtonDisabled}
                        onClick={saveProposalAndComission}
                        className='disabled:opacity-50 disabled:cursor-not-allowed py-1 px-2 h-fit text-sm font-medium w-full transition-all duration-300'>
                        {savingProposalAndComission ? "Salvando..." : "Salvar Proposta/Comissão"}
                    </Button>

                    {/* separator */}
                    <div className="h-px w-full bg-stroke dark:bg-strokedark"></div>
                    {/* end separator */}

                    {/* ----> observations field <----- */}
                    <div className='w-full h-full'>
                        <p className='mb-2'>Observações:</p>
                        <div className='relative'>
                            <textarea
                                ref={observationRef}
                                className='w-full rounded-md placeholder:text-sm border-stroke dark:border-strokedark dark:bg-boxdark-2/50 resize-none'
                                rows={4}
                                placeholder='Insira uma observação'
                            />
                            <Button
                                onClick={() => handleUpdateObservation(observationRef.current?.value || "")}
                                className='absolute z-2 bottom-3 right-2 py-1 text-sm px-2'>
                                {
                                    savingObservation ? (
                                        <AiOutlineLoading className="text-lg animate-spin" />
                                    ) : (
                                        <BiSave className="text-lg" />
                                    )
                                }
                            </Button>
                        </div>
                    </div>
                    {/* ----> end observations field <----- */}
                </div>
            </div>
            {/* ----> end info <----- */}

            {/* ----> edit info modal <---- */}
            <div className={`absolute top-0 left-0 z-3 bg-white dark:bg-boxdark w-full ${editModalId === mainData.id ? "max-h-full overflow-y-scroll border border-snow rounded-md" : "max-h-0 overflow-hidden"} grid grid-cols-2 gap-2 transition-all duration-300`}>
                <div className='p-5 col-span-2'>

                    <h2 className='text-xl font-medium text-center'>Edite as informações do ofício</h2>

                    {/* ----> close button <---- */}
                    <button
                        onClick={() => setEditModalId(null)}
                        className='absolute right-0 top-0 p-1 rounded-bl-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-300'
                    >
                        <BiX className="text-2xl" />
                    </button>
                    {/* ----> end close button <---- */}

                    {/* TODO: possibilidade de implementar um componente para esse form */}
                    <form
                        className="mt-8 space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
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
                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                    {...register("tipo_do_oficio")}
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
                                    defaultValue={"NÃO TRIBUTÁRIA"}
                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
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
                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                    {...register("esfera")}
                                >
                                    <option value="FEDERAL">Federal</option>
                                    <option value="ESTADUAL">Estadual</option>
                                    <option value="MUNICIPAL">Municipal</option>
                                </select>
                            </div>
                            {watch("esfera") !== "FEDERAL" &&
                                watch("esfera") !== undefined && (
                                    <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                        <label
                                            htmlFor="regime"
                                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                        >
                                            Regime
                                        </label>
                                        <select
                                            defaultValue={""}
                                            className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                            {...register("regime")}
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
                                    defaultValue={""}
                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
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
                                    rules={{
                                        min: {
                                            value: 0.01,
                                            message: "O valor deve ser maior que 0",
                                        },
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                className={`w-full rounded-md border-stroke ${error ? "border-red" : "dark:border-strokedark"} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
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
                                            message: "O valor deve ser maior que 0",
                                        },
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                className={`w-full rounded-md border-stroke ${error ? "border-red" : "dark:border-strokedark"} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
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
                                        className={`${errors.data_base && "!border-red !ring-0"} w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                        {...register("data_base", {
                                            required: "Campo obrigatório",
                                        })}
                                        aria-invalid={errors.data_base ? "true" : "false"}
                                    />
                                    {errors.data_base && (
                                        <span className="absolute right-8.5 top-7.5 text-xs font-medium text-red">
                                            campo obrigatório
                                        </span>
                                    )}
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
                                            className={`${errors.data_requisicao && "!border-red !ring-0"} w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                                            {...register("data_requisicao", {
                                                required: "Campo obrigatório",
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

                            {watch("esfera") !== "FEDERAL" &&
                                watch("esfera") !== undefined && (
                                    <div className="col-span-1"></div>
                                )}

                            <div
                                className={`col-span-2 flex max-h-6 items-center gap-2 md:col-span-1`}
                            >
                                <CustomCheckbox
                                    check={watch("valor_aquisicao_total")}
                                    id={"valor_aquisicao_total"}
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
                                <div className="mt-1 flex flex-col gap-2 overflow-hidden 2xsm:col-span-2 md:col-span-1">
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
                                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
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
                                <div className="col-span-1 hidden md:block"></div>
                            )}
                            {/* ====> end label PERCENTUAL DE AQUISIÇÃO <==== */}

                            {(watch("especie") === "Principal" ||
                                watch("especie") === undefined) && (
                                    <div className="col-span-2 flex w-full flex-col justify-between gap-4 sm:flex-row">
                                        <div
                                            className={`flex flex-row ${watch("ja_possui_destacamento") ? "items-center" : "items-start"} w-full gap-2 2xsm:col-span-2 sm:col-span-1`}
                                        >
                                            <CustomCheckbox
                                                check={watch("ja_possui_destacamento")}
                                                id={"ja_possui_destacamento"}
                                                register={register("ja_possui_destacamento")}
                                                defaultChecked
                                            />

                                            <label
                                                htmlFor="ja_possui_destacamento"
                                                className={`${!watch("ja_possui_destacamento") && "mt-1"} font-nexa text-xs font-semibold uppercase text-meta-5`}
                                            >
                                                Já possui destacamento de honorários?
                                            </label>
                                        </div>
                                        {watch("ja_possui_destacamento") === false && (
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
                                                        {...register("percentual_de_honorarios", {})}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div
                                className={`col-span-2 flex items-center gap-2 md:col-span-1 ${watch("data_base")! < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                            >
                                <CustomCheckbox
                                    check={watch("incidencia_juros_moratorios")}
                                    id={"incidencia_juros_moratorios"}
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
                                className={`col-span-2 flex items-center gap-2 ${watch("data_base")! > "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                            >
                                <CustomCheckbox
                                    check={watch("nao_incide_selic_no_periodo_db_ate_abril")}
                                    id={"nao_incide_selic_no_periodo_db_ate_abril"}
                                    register={register(
                                        "nao_incide_selic_no_periodo_db_ate_abril",
                                    )}
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
                                    check={watch("incidencia_rra_ir")}
                                    id={"incidencia_rra_ir"}
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
                                null
                            ) : (
                                <div
                                    className={`flex h-6 gap-2 2xsm:col-span-2 md:col-span-1`}
                                >
                                    <CustomCheckbox
                                        check={watch("ir_incidente_rra")}
                                        id={"ir_incidente_rra"}
                                        register={register("ir_incidente_rra")}
                                    />

                                    <label
                                        htmlFor="ir_incidente_rra"
                                        className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        IR incidente sobre RRA?
                                    </label>
                                </div>
                            )}

                            {watch("ir_incidente_rra") &&
                                watch("incidencia_rra_ir") === true &&
                                watch("natureza") !== "TRIBUTÁRIA" ? (
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
                                        {...register("numero_de_meses", {
                                            required: "Campo obrigatório",
                                            setValueAs: (value) => {
                                                return parseInt(value);
                                            },
                                        })}
                                    />
                                </div>
                            ) : (
                                <>
                                    {watch("esfera") === "FEDERAL" && <div className="col-span-1 hidden md:block"></div>}
                                </>
                            )}
                            {watch("natureza") !== "TRIBUTÁRIA" ? (
                                <div
                                    className={`flex gap-2 ${watch("incidencia_pss") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}
                                >
                                    <CustomCheckbox
                                        check={watch("incidencia_pss")}
                                        id={"incidencia_pss"}
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
                            {watch("incidencia_pss") &&
                                watch("natureza") !== "TRIBUTÁRIA" ? (
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
                                    {watch("natureza") === "TRIBUTÁRIA" ? null : (
                                        <div className="hidden items-center md:flex">
                                            &nbsp;
                                        </div>
                                    )}
                                </>
                            )}
                            <div
                                className={`flex gap-2 ${watch("data_limite_de_atualizacao_check") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}
                            >
                                <CustomCheckbox
                                    check={watch("data_limite_de_atualizacao_check")}
                                    id={"data_limite_de_atualizacao_check"}
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
                                            Data de atualização deve ser maior que a data de
                                            requisição
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
                                                        className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                                        {...register("especie")}
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
                                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                                    {...register("estado_ente_devedor")}
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
                                                    {...register("juizo_vara", {})}
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
                                <span
                                    className="text-[16px] font-medium"
                                    aria-disabled={isSavingEdit}
                                >
                                    {isSavingEdit ? "Salvando alterações..." : "Salvar"}
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
            {/* end edit info modal */}
        </div>
    )
}

export default DashbrokersCard
