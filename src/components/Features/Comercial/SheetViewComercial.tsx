/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Form } from '@/components/ui/form';
import { estados } from '@/constants/estados';
import { tipoRegime } from '@/constants/regime-casamento';
import { tribunais } from '@/constants/tribunais';
import { BrokersContext } from '@/context/BrokersContext';
import { ReactGlobalQueryContext } from '@/context/ReactGlobalQueryContext';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import { InputFieldVariant } from '@/enums/inputFieldVariants.enum';
import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import dateFormater from '@/functions/formaters/dateFormater';
import numberFormat from '@/functions/formaters/numberFormat';
import percentageFormater from '@/functions/formaters/percentFormater';
import {
    findRentabilidadeAoAnoThroughDesembolso,
    handleDesembolsoVsRentabilidade,
} from '@/functions/juridico/solverDesembolsoVsRentabilidade';
import UseMySwal from '@/hooks/useMySwal';
import { NotionPage } from '@/interfaces/INotion';
import { IWalletResponse } from '@/interfaces/IWallet';
import api from '@/utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import {
    BiCheck,
    BiInfoCircle,
    BiSave,
    BiSolidCalculator,
    BiSolidCoinStack,
    BiX,
} from 'react-icons/bi';
import { BsCalendar2HeartFill, BsPencilSquare } from 'react-icons/bs';
import { CgSearchLoading } from 'react-icons/cg';
import { FaBalanceScale, FaIdCard, FaMapMarkedAlt, FaRegFilePdf } from 'react-icons/fa';
import { FaBuilding, FaBuildingColumns, FaLink, FaUser } from 'react-icons/fa6';
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi';
import { GrDocumentText, GrDocumentUser, GrMoney } from 'react-icons/gr';
import { IoIosPaper } from 'react-icons/io';
import { IoCalendar, IoDocumentTextSharp, IoGlobeOutline } from 'react-icons/io5';
import { LuClipboardCheck, LuCopy, LuHandshake } from 'react-icons/lu';
import { MdOutlineArchive, MdOutlineDownloading } from 'react-icons/md';
import { TbMoneybag, TbStatusChange } from 'react-icons/tb';
import verifyRequiredInputsToDue from '@/functions/juridico/verifyRequiredInputsToDue';
import { AxiosError } from 'axios';
import BrokerModal, { IdentificationType } from '@/components/Modals/BrokersCedente';
import LifeCycleStep from '@/components/LifeCycleStep';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { CelerInputField } from '@/components/CrmUi/InputFactory';
import { SelectItem } from '@/components/ui/select';
import CelerInputFormField from '@/components/Forms/CustomFormField';
import { Button } from '@/components/Button';
import RentabilityChart from '@/components/Charts/RentabilityChart';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import DocForm from '@/components/Modals/BrokersDocs';
import { Fade } from 'react-awesome-reveal';
import Image from 'next/image';
import DashbrokersCard, { ChecksProps } from '@/components/Cards/DashbrokersCard';
import { toast } from 'sonner';
import { formatCurrency } from '@/functions/formaters/formatCurrency';

type SheetViewComercialProps = {
    id: string;
    sheetData: any;
    grafico?: React.ReactNode;
};

export const SheetViewComercial = ({ id, grafico, sheetData }: SheetViewComercialProps) => {
    const {
        data: { user },
    } = useContext<UserInfoContextType>(UserInfoAPIContext);

    /* ====> context imports <==== */
    const {
        cedenteModal,
        setCedenteModal,
        docModalInfo,
        setDocModalInfo,
        fetchCardData,
        deleteModalLock,
        isFetchAllowed,
        setIsFetchAllowed,
        setDeleteModalLock,
        fetchDetailCardData,
        specificCardData,
        setSpecificCardData,
        selectedUser,
        setEditModalId,
    } = useContext(BrokersContext);

    const [credorIdentificationType, setCredorIdentificationType] =
        useState<IdentificationType>(null);
    const [requiredDueInputsError, setRequiredDueInputsError] = useState<boolean>(false);
    const [observation, setObservation] = useState<string>('');
    const [formData, setFormData] = useState<Record<string, any> | null>(null);
    const [happenedRecalculation, setHappenedRecalculation] = useState<boolean>(false);
    const [recalculationData, setRecalculationData] = useState<any>(null);
    const [isLoadingRecalculation, setIsLoadingRecalculation] = useState<boolean>(false);
    const [loadingUpdateState, setLoadingUpdateState] = useState({
        nomeCredor: false,
        cpfCnpj: false,
        npuOriginario: false,
        npuPrecatorio: false,
        juizoVara: false,
        enteDevedor: false,
        estadoEnteDevedor: false,
        formValores: false,
        sliderValores: false,
        observacoes: false,
        responsavel: false,
        previsaoDePagamento: false,
        linkDue: false,
        revisaoCalculo: false,
        espelhoOficio: false,
        estoquePrecatorio: false,
        estadoCivil: false,
        certidaoEmitidas: false,
        possuiProcessos: false,
        returnDue: false,
    });
    const [editLock, setEditLock] = useState<boolean>(false);
    const [disabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
    const [sliderError, setSliderError] = useState<boolean>(false);
    const [sliderValues, setSliderValues] = useState({
        rentabilidade: 0,
        desembolso: 0,
        proposal: 0,
        comission: 0,
    });
    const [statusDiligence, setStatusDiligence] = useState<string>('');

    const swal = UseMySwal();
    const { globalQueryClient } = useContext(ReactGlobalQueryContext);

    /* refs */
    const rentabilidadeSlideRef = useRef<HTMLInputElement>(null);
    const desembolsoSlideRef = useRef<HTMLInputElement>(null);
    /* ====> value states <==== */
    const [auxValues, setAuxValues] = useState<{ proposal: number; commission: number }>({
        proposal: 0,
        commission: 0,
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdatingDiligence, setIsUpdatingDiligence] = useState<boolean>(false);
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
    const [savingObservation, setSavingObservation] = useState<boolean>(false);
    const [isProposalButtonDisabled, setIsProposalButtonDisabled] = useState<boolean>(true);
    const [isProposalChanging, setIsProposalChanging] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);

    const proposalRef = useRef<HTMLInputElement | null>(null);
    const comissionRef = useRef<HTMLInputElement | null>(null);
    const observationRef = useRef<HTMLTextAreaElement | null>(null);
    const proposalRangeRef = useRef<HTMLInputElement | null>(null);
    const isFirstLoad = useRef(true); // referência: 'isFirstLoad' sempre apontará para o mesmo objeto retornado por useRef
    const [loading, setLoading] = useState<boolean>(false);
    const documentRef = useRef<HTMLDivElement>(null);

    const [checks, setChecks] = useState<ChecksProps>({
        is_precatorio_complete: false,
        is_cedente_complete: false,
        are_docs_complete: false,
        isFetching: false,
    });

    const fetchAllChecks = async (): Promise<void> => {
        setChecks((old) => ({
            ...old,
            isFetching: true,
        }));

        const cedenteType = credorIdentificationType === 'CPF' ? 'Cedente PF' : 'Cedente PJ';

        const idCedente = data?.properties[cedenteType].relation?.[0]
            ? data.properties[cedenteType].relation?.[0].id
            : null;

        try {
            const req =
                credorIdentificationType === 'CPF'
                    ? await api.get(
                          `/api/checker/pf/complete/precatorio/${data?.id}/cedente/${idCedente}/`,
                      )
                    : await api.get(
                          `/api/checker/pj/complete/precatorio/${data?.id}/cedente/${idCedente}/`,
                      );

            if (req.status === 200) {
                setChecks((old) => ({
                    ...old,
                    is_precatorio_complete: req.data.is_precatorio_complete,
                    is_cedente_complete: req.data.is_cedente_complete,
                    are_docs_complete: req.data.are_docs_complete,
                }));
            }
        } catch (error) {
            toast.error('Erro ao buscar info dos checks', {
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
        } finally {
            setChecks((old) => ({
                ...old,
                isFetching: false,
            }));
        }
    };

    /**
     * Função para atualizar a proposta e ajustar a comissão proporcionalmente
     * @param {string} value - valor da proposta
     * @param {boolean} sliderChange - indica se a mudança vem de um slider
     * @returns {void}
     */
    const handleProposalSliderChange = (value: string, sliderChange: boolean): void => {
        if (data) {
            const newProposalSliderValue = parseFloat(value);

            if (newProposalSliderValue !== auxValues.proposal) {
                setIsProposalButtonDisabled(false);
                setErrorMessage(false);
            } else {
                setIsProposalButtonDisabled(true);
            }

            // seta o valor do slide como o valor atual
            setSliderValues((oldValues) => {
                return { ...oldValues, proposal: newProposalSliderValue };
            });

            // Calcular a proporção em relação a proposta e ajustar a comissão
            const proportion =
                (newProposalSliderValue -
                    (data?.properties['(R$) Proposta Mínima - Celer'].number || 0)) /
                ((data?.properties['(R$) Proposta Máxima - Celer'].number || 0) -
                    (data?.properties['(R$) Proposta Mínima - Celer'].number || 0));

            // define o novo valor da comissão em relação a proporção
            const newComissionSliderValue =
                (data?.properties['(R$) Comissão Máxima - Celer'].number || 0) -
                proportion *
                    ((data?.properties['(R$) Comissão Máxima - Celer'].number || 0) -
                        (data?.properties['(R$) Comissão Mínima - Celer'].number || 0));

            setSliderValues((oldValues) => {
                return { ...oldValues, comission: newComissionSliderValue };
            });

            if (comissionRef.current && proposalRef.current) {
                comissionRef.current.value = numberFormat(newComissionSliderValue);
                if (sliderChange) {
                    proposalRef.current.value = numberFormat(newProposalSliderValue);
                }
            }
        }
    };

    /**
     * Função para atualizar a comissão e ajustar a proposta proporcionalmente
     * @param {string} value - valor da comissão
     * @param {boolean} sliderChange - indica se a mudança vem de um slider
     * @returns {void}
     */
    const handleComissionSliderChange = (value: string, sliderChange: boolean): void => {
        if (data) {
            // seta o valor da slider como o atual
            const newComissionSliderValue = parseFloat(value);
            setSliderValues((oldValues) => {
                return { ...oldValues, comission: newComissionSliderValue };
            });

            // Calcular a proporção em relação a comissão e ajustar a proposta
            const proportion =
                (newComissionSliderValue -
                    (data.properties['(R$) Comissão Mínima - Celer'].number || 0)) /
                ((data.properties['(R$) Comissão Máxima - Celer'].number || 0) -
                    (data.properties['(R$) Comissão Mínima - Celer'].number || 0));

            //  define o novo valor da proposta em relação a proporção
            const newProposalSliderValue =
                (data.properties['(R$) Proposta Máxima - Celer'].number || 0) -
                proportion *
                    ((data.properties['(R$) Proposta Máxima - Celer'].number || 0) -
                        (data.properties['(R$) Proposta Mínima - Celer'].number || 0));

            if (newProposalSliderValue !== auxValues.commission) {
                setIsProposalButtonDisabled(false);
                setErrorMessage(false);
            } else {
                setIsProposalButtonDisabled(true);
            }

            setSliderValues((oldValues) => {
                return { ...oldValues, proposal: newProposalSliderValue };
            });

            if (proposalRef.current && comissionRef.current) {
                proposalRef.current.value = numberFormat(newProposalSliderValue);
                if (sliderChange) {
                    comissionRef.current.value = numberFormat(newComissionSliderValue);
                }
            }
        }
    };

    /**
     * Função para atualizar proposta/comissão com os dados dos inputs
     *
     * @param {string} inputField - campo input que foi alterado
     * @param {string} value - valor do campo input
     * @returns {void}
     */
    const changeInputValues = (inputField: string, value: string): void => {
        const rawValue = value
            .replace(/R\$\s*/g, '')
            .replaceAll('.', '')
            .replaceAll(',', '.');
        const numericalValue = parseFloat(rawValue);

        switch (inputField) {
            case 'proposal':
                if (
                    numericalValue >=
                        (data?.properties['(R$) Proposta Mínima - Celer'].number || 0) &&
                    numericalValue <=
                        (data?.properties['(R$) Proposta Máxima - Celer'].number || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.proposal
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

                if (
                    numericalValue <
                        (data?.properties['(R$) Proposta Mínima - Celer'].number || 0) ||
                    numericalValue >
                        (data?.properties['(R$) Proposta Máxima - Celer'].number || 0) ||
                    isNaN(numericalValue)
                ) {
                    setErrorMessage(true);
                    return;
                } else {
                    setErrorMessage(false);
                }

                setSliderValues((old) => {
                    return {
                        ...old,
                        proposal: parseFloat(rawValue),
                    };
                });
                handleProposalSliderChange(rawValue, false);
                break;
            case 'comission':
                if (
                    numericalValue >=
                        (data?.properties['(R$) Comissão Mínima - Celer'].number || 0) &&
                    numericalValue <=
                        (data?.properties['(R$) Comissão Máxima - Celer'].number || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.commission
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

                if (
                    numericalValue <
                        (data?.properties['(R$) Comissão Mínima - Celer'].number || 0) ||
                    numericalValue >
                        (data?.properties['(R$) Comissão Máxima - Celer'].number || 0) ||
                    isNaN(numericalValue)
                ) {
                    setErrorMessage(true);
                    return;
                } else {
                    setErrorMessage(false);
                }
                setSliderValues((old) => {
                    return {
                        ...old,
                        comission: parseFloat(rawValue),
                    };
                });
                handleComissionSliderChange(rawValue, false);
                break;
            default:
                break;
        }
    };

    /**
     * Função para salvar os valores de proposta e comissão
     *
     * @returns {Promise<void>}
     */
    const saveProposalAndComission = async (): Promise<void> => {
        setSavingProposalAndComission(true);
        setIsFetchAllowed(false);
        const req = await api.patch(`/api/notion-api/broker/negotiation/${data?.id}/`, {
            proposal: sliderValues.proposal,
            commission: sliderValues.comission,
        });

        if (req.status === 202) {
            toast.success('Proposta e comissão salvas com sucesso!', {
                icon: <BiCheck className="fill-green-400 text-lg" />,
            });
            setAuxValues({
                proposal: sliderValues.proposal,
                commission: sliderValues.comission,
            });
            setIsProposalButtonDisabled(true);
            fetchDetailCardData(data!.id);
        }

        if (req.status === 400) {
            toast.error('Erro ao salvar proposta e comissão!', {
                icon: <BiX className="fill-red-500 text-lg" />,
            });
        }
        setIsFetchAllowed(true);
        setSavingProposalAndComission(false);
    };

    const updateObservation = useMutation({
        mutationFn: async (message: string) => {
            const req = await api.patch(`api/notion-api/update/${data?.id}/`, {
                Observação: {
                    rich_text: [
                        {
                            text: {
                                content: message,
                            },
                        },
                    ],
                },
            });
            return req.status;
        },
        onMutate: async (message: string) => {
            setSavingObservation(true);
            setIsFetchAllowed(false);
            const previousData = data;
            return { previousData };
        },
        onError: (error, message, context) => {
            globalQueryClient.setQueryData(
                ['page', sheetData.id],
                context?.previousData as NotionPage,
            );
            toast.error('Erro ao atualizar a observação!', {
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
        onSuccess: () => {
            toast.success('Campo atualizado!', {
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
            setSavingObservation(false);
            setIsFetchAllowed(true);
        },
    });

    const handleDueDiligence = () => {
        swal.fire({
            title: 'Diligência',
            text: 'Deseja mesmo finalizar a diligência?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await api.patch(`api/notion-api/update/${id}/`, {
                    'Status Diligência': {
                        select: {
                            name: 'Em liquidação',
                        },
                    },
                });
                if (response.status !== 202) {
                    swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao finalizar a diligência',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }

                refetch();

                swal.fire({
                    title: 'Diligência Finalizada',
                    text: 'A diligência foi Finalizada com sucesso! O ofício agora está em liquidação.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        });
    };
    const handleCessao = () => {
        swal.fire({
            title: 'Cessão',
            text: 'Deseja mesmo Enviar o Registro de Cessão?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await api.patch(`api/notion-api/update/${id}/`, {
                    'Status Diligência': {
                        select: {
                            name: 'Registro de cessão',
                        },
                    },
                });
                if (response.status !== 202) {
                    swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao Enviar Registro de Cessão',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }

                refetch();

                swal.fire({
                    title: 'Registro Salvo.',
                    text: 'O Oficio seguiu para a parte de cessão.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    const handlePendencia = () => {
        swal.fire({
            title: 'Pendência a Sanar',
            input: 'textarea',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
            inputLabel: 'Informe a pendência a ser sanada pelo cedente',
            inputPlaceholder: 'Ex: Falta de documentação. Favor enviar o documento X',

            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa informar a pendência';
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await api.patch(`api/notion-api/update/${id}/`, {
                    'Status Diligência': {
                        select: {
                            name: 'Pendência a Sanar',
                        },
                    },
                    Observação: {
                        rich_text: [
                            {
                                text: {
                                    content: `
- Motivo do Retorno: ${result.value}
- Encaminhado por: ${user} em ${new Date().toLocaleString()}
-------------------------------
${data?.properties['Observação']?.rich_text?.[0]?.text?.content ?? ''}
                  `,
                                },
                            },
                        ],
                    },
                });
                if (response.status !== 202) {
                    swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao encaminhar o ofício para repactuação',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }

                refetch();

                swal.fire({
                    title: 'Diligência Repactuada',
                    text: 'O ofício foi encaminhado para repactuação com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        });
    };
    const handleArchiving = () => {
        swal.fire({
            title: 'Arquivar Ofício',
            input: 'textarea',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Arquivar definitivamente',
            cancelButtonText: 'Não arquivar',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
            inputLabel: 'Informe o motivo do arquivamento',
            inputPlaceholder: 'Ex: Desistência do credor.',

            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa informar a motivo';
                }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await api.patch(`api/notion-api/update/${id}/`, {
                    Status: {
                        status: {
                            name: 'ARQUIVADO',
                        },
                    },
                    Observação: {
                        rich_text: [
                            {
                                text: {
                                    content: `
- Motivo do Arquivamento: ${result.value}
- Encaminhado por: ${user} em ${new Date().toLocaleString()}
-------------------------------
${data?.properties['Observação']?.rich_text?.[0]?.text?.content ?? ''}
                  `,
                                },
                            },
                        ],
                    },
                });

                if (response.status !== 202) {
                    swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao arquivar o ofício.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }

                refetch();

                swal.fire({
                    title: 'Ofício Arquivado',
                    text: 'O ofício arquivado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    const handleDueAndamento = () => {
        const requiredInputsCheck = verifyRequiredInputsToDue(
            data && data,
            credorIdentificationType === 'CPF' ? cedenteDataPF : socioData,
        );
        if (requiredInputsCheck) {
            swal.fire({
                title: 'Due em Andamento',
                text: 'Deseja mesmo deixar o Due em Andamento?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#F44336',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await api.patch(`api/notion-api/update/${id}/`, {
                        'Status Diligência': {
                            select: {
                                name: 'Due em Andamento',
                            },
                        },
                    });
                    if (response.status !== 202) {
                        swal.fire({
                            title: 'Erro',
                            text: 'Houve um erro ao deixar a Due em Andamento',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                    }

                    refetch();

                    swal.fire({
                        title: 'Registro Salvo',
                        text: 'A diligência está em andamento!.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                }
            });
        } else {
            swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Existem campos obrigatórios que ainda não foram preenchidos. Por favor, revise o formulário.',
            });
            setRequiredDueInputsError(true);
        }
    };

    const handleRevisaoDueDiligence = () => {
        const requiredInputsCheck = verifyRequiredInputsToDue(
            data && data,
            credorIdentificationType === 'CPF' ? cedenteDataPF : socioData,
        );
        if (requiredInputsCheck) {
            swal.fire({
                title: 'Revisão de Due Diligence',
                text: 'Deseja mesmo enviar para Revisão de Due Diligence?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#F44336',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await api.patch(`api/notion-api/update/${id}/`, {
                        'Status Diligência': {
                            select: {
                                name: 'Revisão de Due Diligence',
                            },
                        },
                    });
                    if (response.status !== 202) {
                        swal.fire({
                            title: 'Erro',
                            text: 'Houve um erro ao Enviar para Revisão da Due Diligence',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                    }

                    refetch();

                    swal.fire({
                        title: 'Registro da Due está em Andamento',
                        text: 'A diligência está em andamento.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                }
            });
        } else {
            swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Existem campos obrigatórios que ainda não foram preenchidos. Por favor, revise o formulário.',
            });
            setRequiredDueInputsError(true);
        }
    };

    async function fetchData() {
        const response = await api.get(`/api/notion-api/list/page/${sheetData.id}/`);
        return response.data;
    }
    async function fetchCedenteData(cedenteId: string) {
        if (!cedenteId) return;
        const response = await api.get(`/api/notion-api/list/page/${cedenteId}/`);
        return response.data;
    }

    const { data, isLoading, refetch } = useQuery<NotionPage>({
        queryKey: ['page', sheetData.id],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
    });

    const { data: cedenteDataPF } = useQuery<NotionPage>({
        queryKey: ['cedentePF', data?.properties['Cedente PF']?.relation?.[0]?.id],
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        queryFn: () => fetchCedenteData(data?.properties['Cedente PF']?.relation?.[0]?.id!),
        refetchOnWindowFocus: false,
        enabled: !!data?.properties['Cedente PF']?.relation?.[0]?.id,
    });

    const { data: cedenteDataPJ } = useQuery<NotionPage>({
        queryKey: ['cedentePJ', data?.properties['Cedente PJ']?.relation?.[0]?.id],
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        queryFn: () => fetchCedenteData(data?.properties['Cedente PJ']?.relation?.[0]?.id!),
        refetchOnWindowFocus: false,
        enabled: !!data?.properties['Cedente PJ']?.relation?.[0]?.id,
    });

    const { data: socioData } = useQuery<NotionPage>({
        queryKey: ['socio', cedenteDataPJ?.properties['Sócio Representante']?.relation?.[0]?.id],
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        queryFn: () =>
            fetchCedenteData(cedenteDataPJ?.properties['Sócio Representante']?.relation?.[0]?.id!),
        refetchOnWindowFocus: false,
        enabled: !!cedenteDataPJ?.properties['Sócio Representante']?.relation?.[0]?.id,
    });

    const onSubmitForm = async (formData: any) => {
        setIsLoadingRecalculation(true);
        if (formData.observacao) {
            formData.observacao = `
💭 Comentários: ${formData.observacao}
`;
        }

        if (formData.valor_aquisicao_total) {
            formData.percentual_a_ser_adquirido = 1;
        } else {
            formData.percentual_a_ser_adquirido = formData.percentual_a_ser_adquirido / 100;
        }

        if (!formData.ja_possui_destacamento) {
            formData.percentual_de_honorarios = formData.percentual_de_honorarios / 100;
        }

        if (typeof formData.valor_principal === 'string') {
            formData.valor_principal = backendNumberFormat(formData.valor_principal) || 0;
            formData.valor_principal = parseFloat(formData.valor_principal);
        }

        if (typeof formData.valor_juros === 'string') {
            formData.valor_juros = backendNumberFormat(formData.valor_juros) || 0;
            formData.valor_juros = parseFloat(formData.valor_juros);
        }

        if (formData.data_base) {
            formData.data_base = formData.data_base.split('/').reverse().join('-');
        }

        if (formData.data_requisicao) {
            formData.data_requisicao = formData.data_requisicao.split('/').reverse().join('-');
        }

        if (formData.data_limite_de_atualizacao) {
            formData.data_limite_de_atualizacao = formData.data_limite_de_atualizacao
                .split('/')
                .reverse()
                .join('-');
        }

        if (typeof formData.valor_pss === 'string') {
            formData.valor_pss = backendNumberFormat(formData.valor_pss) || 0;
            formData.valor_pss = parseFloat(formData.valor_pss);
        }

        if (!formData.ir_incidente_rra) {
            formData.numero_de_meses = 0;
        } else {
            formData.numero_de_meses = Number(formData.numero_de_meses);
        }

        if (!formData.incidencia_pss) {
            formData.valor_pss = 0;
        }

        if (!formData.data_limite_de_atualizacao_check) {
            delete formData.data_limite_de_atualizacao_check;
        }

        formData.upload_notion = true;
        formData.need_to_recalculate_proposal = true;

        swal.fire({
            title: 'Confirmação',
            text: 'Deseja enviar para repactuação?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim. Enviar para repactuação',
            cancelButtonText: 'Não. Somente atualizar',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
        }).then(async (result) => {
            if (result.isConfirmed) {
                formData.repactuar = true;
            } else {
                formData.repactuar = false;
            }

            try {
                const response = await api.patch(
                    `/api/juridico/update/precatorio/${id}/`,
                    formData,
                );
                setHappenedRecalculation(true);
                setRecalculationData(response.data);

                swal.fire({
                    title: 'Sucesso',
                    text: 'Dados atualizados com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });

                refetch();
            } catch (error: AxiosError | any) {
                swal.fire({
                    title: 'Erro',
                    text: `${error.response?.data?.detail || error.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                console.error(error);
            } finally {
                setIsLoadingRecalculation(false);
            }
        });
    };

    const form = useForm();
    const isFormModified = Object.keys(form.watch()).some(
        (key) => form.watch()[key] !== formData?.[key],
    );

    // TODO: documentar todas as funções desse componente com JSDocs
    const handleChangeCreditorName = async (value: string, page_id: string) => {
        await creditorNameMutation.mutateAsync({
            page_id,
            value,
        });
    };

    /**
     * @description
     * Essa função é utilizada para lidar com a mudança no campo de identificação (CPF/CNPJ)
     *
     * @param {string} value - Valor do campo de identificação
     * @param {string} page_id - ID da página do Notion
     * @returns {Promise<void>}
     */
    const handleChangeIdentification = async (value: string, page_id: string): Promise<void> => {
        if (value.length === 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length === 14) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        await identificationMutation.mutateAsync({
            page_id,
            value,
        });
    };

    /**
     * @description
     * Essa função é utilizada para lidar com a mudança no campo de NPU
     *
     * @param {string} value - Valor do campo de NPU
     * @param {string} type - Tipo do campo de NPU (ex: 'NPU')
     * @param {string} page_id - ID da página do Notion
     * @returns {Promise<void>}
     */
    const handleChangeNpu = async (value: string, type: string, page_id: string) => {
        value = value.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6');

        await npuMutation.mutateAsync({
            page_id,
            type,
            value,
        });
    };

    const handleChangeJuizo = async (value: string, page_id: string) => {
        await juizoMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleChangeEnteDevedor = async (value: string, page_id: string) => {
        await enteDevedorMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleChangeEstadoEnteDevedor = async (value: string, page_id: string) => {
        await estadoEnteDevedorMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleChangeRentabilidadeSlider = (value: string, fromSlider?: boolean) => {
        if (!value) return;
        const sanitizedValue = value.replace(/%/g, '');

        const newRentabilidade = !fromSlider
            ? Number(sanitizedValue) / 100
            : Number(sanitizedValue);
        const newDesembolso = handleDesembolsoVsRentabilidade(
            Number(newRentabilidade),
            data,
        ).desembolso;

        if (newRentabilidade > 2 || newRentabilidade < 0) {
            setSliderError(true);
            return;
        } else {
            setSliderError(false);
        }

        setSliderValues((oldValues) => ({
            ...oldValues,
            rentabilidade: newRentabilidade,
            desembolso: newDesembolso,
        }));

        if (rentabilidadeSlideRef.current && desembolsoSlideRef.current) {
            rentabilidadeSlideRef.current.value = `${(newRentabilidade * 100).toFixed(2).replace('.', ',')}%`;
            if (fromSlider) {
                desembolsoSlideRef.current.value = numberFormat(newDesembolso);
            }
        }
    };

    const handleChangeDesembolsoSlider = (value: string, fromSlider?: boolean) => {
        if (!value) return;
        const rawValue = !fromSlider
            ? Number(
                  value
                      .replace(/R\$\s*/g, '')
                      .replaceAll('.', '')
                      .replaceAll(',', '.'),
              )
            : Number(value);

        const newDesembolso = rawValue;
        const newRentabilidade = findRentabilidadeAoAnoThroughDesembolso(
            Number(newDesembolso),
            data,
        ).rentabilidade_ao_ano;

        if (
            newDesembolso > handleDesembolsoVsRentabilidade(0, data).desembolso ||
            newDesembolso < handleDesembolsoVsRentabilidade(2, data).desembolso
        ) {
            setSliderError(true);
            return;
        } else {
            setSliderError(false);
        }

        setSliderValues((oldValues) => ({
            ...oldValues,
            rentabilidade: newRentabilidade,
            desembolso: newDesembolso,
        }));

        if (rentabilidadeSlideRef.current && desembolsoSlideRef.current) {
            desembolsoSlideRef.current.value = numberFormat(newDesembolso);
            if (fromSlider) {
                rentabilidadeSlideRef.current.value = `${(newRentabilidade * 100).toFixed(2).replace('.', ',')}%`;
            }
        }
    };

    const handleSaveValues = async () => {
        setLoadingUpdateState((prev) => ({ ...prev, formValores: true }));
        try {
            const factor = Math.pow(10, 5);
            const newRentabilidade = Math.floor(sliderValues.rentabilidade * factor) / factor;
            const res = await api.post(`/api/juridico/desembolso/${id}/`, {
                rentabilidade_anual: newRentabilidade,
            });

            if (res.status === 200) {
                swal.fire({
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'success',
                    text: 'Valores salvos com sucesso',
                    position: 'bottom-right',
                    showConfirmButton: false,
                });
                refetch();
            }
        } catch (error) {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Erro ao salvar os valores',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        } finally {
            setLoadingUpdateState((prev) => ({ ...prev, formValores: false }));
        }
    };

    const handleUpdatePrevisaoDePagamento = async (value: string, page_id: string) => {
        await previsaoDePagamentoMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleUpdateObservation = async (value: string, page_id: string) => {
        await observationMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleUpdateDueLink = async (value: string, page_id: string) => {
        await dueLinkMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleUpdateRevisaoCalculo = async (value: boolean, page_id: string) => {
        await revisaoCalculoMutation.mutateAsync({
            value,
            page_id,
        });
    };

    const handleUpdateEspelhoDoOficio = async (value: string, page_id: string) => {
        await espelhoOficioMutation.mutateAsync({
            value,
            page_id,
        });
    };

    const handleUpdateEstoquePrecatorio = async (value: string, page_id: string) => {
        await estoquePrecatoriosMutation.mutateAsync({
            value,
            page_id,
        });
    };

    const handleUpdateCertidoesEmitidas = async (value: string, page_id: string) => {
        await certidaoEmitidaMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleUpdatePossuiProcessos = async (value: string, page_id: string) => {
        await possuiProcessosMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleUpdateEstadoCivil = async (value: string, page_id: string) => {
        await estadoCivilMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleReturnDueRevision = async () => {
        await returnDueRevisionMutation.mutateAsync({
            page_id: id,
        });
    };

    // ----> Mutations <-----
    const returnDueRevisionMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Status Diligência': {
                    select: {
                        name: 'Revisão de Due Diligence',
                    },
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState((prev) => ({ ...prev, returnDue: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o status de diligência',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Status de Diligência atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, returnDue: false }));
        },
    });

    const estoquePrecatoriosMutation = useMutation({
        mutationFn: async (paramsObj: { value: string; page_id: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Estoque de Precatórios Baixado': {
                    checkbox: paramsObj.value,
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState((prev) => ({ ...prev, estoquePrecatorio: true }));
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
                return {
                    ...old,
                    properties: {
                        ...old?.properties,
                        'Estoque de Precatórios Baixado': {
                            ...old?.properties['Estoque de Precatórios Baixado'],
                            checkbox: paramsObj.value,
                        },
                    },
                };
            });
            return { prevData };
        },
        onError: (error, paramsObj, context) => {
            globalQueryClient.setQueryData(['details', id], context?.prevData);
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar campo Estoque de Precatórios',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: (data, paramsObj) => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Campo Estoque de Precatórios atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, estoquePrecatorio: false }));
        },
    });

    const espelhoOficioMutation = useMutation({
        mutationFn: async (paramsObj: { value: string; page_id: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Espelho do ofício': {
                    checkbox: paramsObj.value,
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState((prev) => ({ ...prev, espelhoOficio: true }));
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
                return {
                    ...old,
                    properties: {
                        ...old?.properties,
                        'Espelho do ofício': {
                            ...old?.properties['Espelho do ofício'],
                            checkbox: paramsObj.value,
                        },
                    },
                };
            });
            return { prevData };
        },
        onError: (error, paramsObj, context) => {
            globalQueryClient.setQueryData(['details', id], context?.prevData);
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar Espelho do ofício',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: (data, paramsObj) => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Campo Espelho do ofício atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, espelhoOficio: false }));
        },
    });

    const revisaoCalculoMutation = useMutation({
        mutationFn: async (paramsObj: { value: boolean; page_id: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Cálculo Revisado': {
                    checkbox: paramsObj.value,
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState((prev) => ({ ...prev, revisaoCalculo: true }));
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
                return {
                    ...old,
                    properties: {
                        ...old.properties,
                        'Cálculo Revisado': {
                            ...old.properties['Cálculo Revisado'],
                            checkbox: paramsObj.value,
                        },
                    },
                };
            });
            return { prevData };
        },
        onError: (error, paramsObj, context) => {
            globalQueryClient.setQueryData(['details', id], context?.prevData);
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar Revisão de Cálculo',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: (data, paramsObj) => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Campo Revisão de Cálculo atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, revisaoCalculo: false }));
        },
    });

    const dueLinkMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string | null }) => {
            if (paramsObj.value === '') {
                paramsObj.value = null;
            }

            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Link de Due Diligence': {
                    url: paramsObj.value,
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, linkDue: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o campo Link do Ofício',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Campo Link do Ofício atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
            refetch();
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, linkDue: false }));
        },
    });

    const resposavelMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                // pegar os responsáveis do ofício e adicionar o usuário logado. Exemplo: henrique, jarbas, joao, maria
                'Responsável - Celer': {
                    multi_select: [
                        {
                            name:
                                data?.properties['Responsável - Celer']?.multi_select
                                    ?.map((item: any) => item.name)
                                    .join(',') + `${user}`,
                        },
                    ],
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, responsavel: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o campo Responsável',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Campo Responsável atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, responsavel: false }));
        },
    });

    const creditorNameMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                Credor: {
                    title: [
                        {
                            text: {
                                content: paramsObj.value,
                            },
                        },
                    ],
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async (paramsObj: any) => {
            setEditLock(true);
            setLoadingUpdateState((prev) => ({ ...prev, nomeCredor: true }));
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o campo Nome do Credor',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Nome do Credor atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, nomeCredor: false }));
        },
    });

    const observationMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                Observação: {
                    rich_text: [
                        {
                            text: {
                                content: paramsObj.value,
                            },
                        },
                    ],
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async (paramsObj: any) => {
            setLoadingUpdateState((prev) => ({ ...prev, observacoes: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o campo Observações',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Observações atualizadas com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
            refetch();
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, observacoes: false }));
        },
    });

    const identificationMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'CPF/CNPJ': {
                    rich_text: [
                        {
                            text: {
                                content: paramsObj.value,
                            },
                        },
                    ],
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async (paramsObj: any) => {
            setLoadingUpdateState((prev) => ({ ...prev, cpfCnpj: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o campo CPF/CNPJ',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'CPF/CNPJ atualizado com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setLoadingUpdateState((prev) => ({ ...prev, cpfCnpj: false }));
            setEditLock(false);
        },
    });

    const previsaoDePagamentoMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(
                `api/legal/change-estimated-date/${paramsObj.page_id}/`,
                {
                    previsao_de_pagamento: paramsObj.value.split('/').reverse().join('-'),
                    data_base: data?.properties['Data Base'].date?.start,
                    valor_principal: data?.properties['Valor Principal']?.number,
                    valor_juros: data?.properties['Valor Juros']?.number,
                    valor_pss: data?.properties['PSS']?.number,
                    numero_de_meses: data?.properties['Meses RRA']?.number,
                    ir_incidente_rra: data?.properties['IR Incidente sobre RRA']?.checkbox,
                    incidencia_pss: data?.properties['Incidência PSS']?.checkbox,
                    data_requisicao: data?.properties['Data do Recebimento'].date?.start,
                    upload_notion: true,
                    need_to_recalculate_proposal: true,
                    percentual_a_ser_adquirido:
                        data?.properties['Percentual a ser adquirido']?.number,
                    natureza: data?.properties['Natureza']?.select?.name,
                    incidencia_juros_moratorios:
                        data?.properties['Incidência de Juros Moratórios']?.checkbox,
                    incidencia_rra_ir: data?.properties['Incidencia RRA/IR']?.checkbox,
                },
            );

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, previsaoDePagamento: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: 'Houve um erro ao atualizar o campo Previsão de Pagamento',
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: 'Previsão de Pagamento atualizada com sucesso',
                position: 'bottom-right',
                showConfirmButton: false,
            });
            refetch(); // refetch para atualizar o objeto do notion com a nova data
        },
        onSettled: () => {
            setLoadingUpdateState((prev) => ({ ...prev, previsaoDePagamento: false }));
            setEditLock(false);
        },
    });

    const npuMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; type: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                [paramsObj.type]: {
                    rich_text: [
                        {
                            text: {
                                content: paramsObj.value,
                            },
                        },
                    ],
                },
            });
            if (response.status !== 202) {
                console.error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async (paramsObj) => {
            const npuType =
                paramsObj.type === 'NPU (Originário)' ? 'npuOriginario' : 'npuPrecatorio';
            setLoadingUpdateState((prev) => ({ ...prev, [npuType]: true }));
            setEditLock(true);
            return { npuType };
        },
        onError: (error, paramsObj) => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo ${paramsObj.type}`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: (data, paramsObj) => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo ${paramsObj.type} alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: (data, error, paramsObj, context) => {
            setEditLock(false);
            if (context?.npuType) {
                setLoadingUpdateState((prev) => ({ ...prev, [context?.npuType]: false }));
            }
        },
    });

    const juizoMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                Juízo: {
                    rich_text: [
                        {
                            text: {
                                content: paramsObj.value,
                            },
                        },
                    ],
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, juizoVara: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo Juízo.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo Juízo alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, juizoVara: false }));
        },
    });

    const enteDevedorMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Ente Devedor': {
                    select: {
                        name: paramsObj.value,
                    },
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, enteDevedor: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo Ente Devedor`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo Ente Devedor alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, enteDevedor: false }));
        },
    });

    const estadoEnteDevedorMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Estado do Ente Devedor': {
                    select: {
                        name: paramsObj.value,
                    },
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, estadoEnteDevedor: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo Estado do Ente Devedor`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo Estado do Ente Devedor alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, estadoEnteDevedor: false }));
        },
    });

    const certidaoEmitidaMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Certidões emitidas': {
                    checkbox: paramsObj.value === 'SIM' ? true : false,
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState((prev) => ({ ...prev, certidaoEmitidas: true }));
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
                return {
                    ...old,
                    properties: {
                        ...old?.properties,
                        'Certidões emitidas': {
                            ...old?.properties['Certidões emitidas'],
                            checkbox: paramsObj.value,
                        },
                    },
                };
            });
            return { prevData };
        },
        onError: (error, paramsObj, context) => {
            globalQueryClient.setQueryData(['page', id], context?.prevData);
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo Certidões Emitidas`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo Certidões Emitidas foi alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, certidaoEmitidas: false }));
        },
    });

    const possuiProcessosMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Possui processos?': {
                    checkbox: paramsObj.value === 'SIM' ? true : false,
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState((prev) => ({ ...prev, possuiProcessos: true }));
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
                return {
                    ...old,
                    properties: {
                        ...old?.properties,
                        'Possui processos?': {
                            ...old?.properties['Possui processos?'],
                            checkbox: paramsObj.value,
                        },
                    },
                };
            });
            return { prevData };
        },
        onError: (error, paramsObj, context) => {
            globalQueryClient.setQueryData(['page', id], context?.prevData);
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo Possui Processos`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo Possui Processos foi alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, possuiProcessos: false }));
        },
    });

    const estadoCivilMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                'Estado Civil': {
                    select: {
                        name: paramsObj.value,
                    },
                },
            });
            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }
            return response.data;
        },
        onMutate: async () => {
            setLoadingUpdateState((prev) => ({ ...prev, estadoCivil: true }));
            setEditLock(true);
        },
        onError: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo Estado Civil`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSuccess: () => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                text: `Campo Estado Civil alterado com sucesso.`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState((prev) => ({ ...prev, estadoCivil: false }));
        },
    });

    useEffect(() => {
        if (data && sliderValues.rentabilidade !== 0 && sliderValues.desembolso !== 0) {
            if (
                sliderValues.rentabilidade !== data.properties['Rentabilidade Anual'].number ||
                sliderValues.desembolso !==
                    data.properties['Nova Fórmula do Desembolso'].formula?.number
            ) {
                setDisabledSaveButton(false);
            } else {
                setDisabledSaveButton(true);
            }
        }
    }, [sliderValues]);

    useEffect(() => {
        if (data) {
            form.setValue('tipo_do_oficio', data?.properties['Tipo'].select?.name || 'PRECATÓRIO');
            form.setValue(
                'natureza',
                data?.properties['Natureza'].select?.name || 'NÃO TRIBUTÁRIA',
            );
            form.setValue('esfera', data?.properties['Esfera'].select?.name || 'FEDERAL');
            form.setValue('regime', data?.properties['Regime'].select?.name || 'GERAL');
            form.setValue('tribunal', data?.properties['Tribunal'].select?.name || 'STJ');
            form.setValue(
                'valor_principal',
                numberFormat(data?.properties['Valor Principal']?.number || 0),
            );
            form.setValue(
                'valor_juros',
                numberFormat(data?.properties['Valor Juros']?.number || 0),
            );
            form.setValue(
                'data_base',
                data?.properties['Data Base'].date?.start.split('-').reverse().join('/') || '',
            );
            form.setValue(
                'data_requisicao',
                data?.properties['Data do Recebimento'].date?.start
                    .split('-')
                    .reverse()
                    .join('/') || '',
            );
            form.setValue(
                'valor_aquisicao_total',
                data?.properties['Percentual a ser adquirido']?.number === 1,
            );
            form.setValue(
                'percentual_a_ser_adquirido',
                data?.properties['Percentual a ser adquirido']?.number! * 100 || 0,
            );
            form.setValue(
                'ja_possui_destacamento',
                data?.properties['Honorários já destacados?'].checkbox,
            );
            form.setValue(
                'percentual_de_honorarios',
                data?.properties['Percentual de Honorários Não destacados']?.number! * 100 || 0,
            );
            form.setValue(
                'incidencia_juros_moratorios',
                data?.properties['Incidência de Juros Moratórios'].checkbox,
            );
            form.setValue(
                'nao_incide_selic_no_periodo_db_ate_abril',
                data?.properties['Incide Selic Somente Sobre Principal'].checkbox,
            );
            form.setValue('incidencia_rra_ir', data?.properties['Incidencia RRA/IR'].checkbox);
            form.setValue('ir_incidente_rra', data?.properties['IR Incidente sobre RRA'].checkbox);
            form.setValue('numero_de_meses', data?.properties['Meses RRA']?.number || 0);
            form.setValue('incidencia_pss', data?.properties['Meses RRA']?.number || 0);
            form.setValue('incidencia_pss', data?.properties['PSS']?.number! > 0);
            form.setValue('valor_pss', numberFormat(data?.properties['PSS']?.number || 0));

            setFormData(form.watch);

            setSliderValues({
                rentabilidade: data?.properties['Rentabilidade Anual']?.number || 0,
                desembolso: data?.properties['Nova Fórmula do Desembolso']?.formula?.number || 0,
                proposal: sliderValues.proposal,
                comission: sliderValues.comission,
            });

            setObservation(data?.properties['Observação']?.rich_text?.[0]?.text?.content || '');
        }
    }, [data]);

    useEffect(() => {
        // verifica o tipo de identificação do credor e formata para só obter números na string
        const credorIdent =
            data?.properties['CPF/CNPJ'].rich_text?.[0]?.text?.content.replace(/\D/g, '') || '';

        setCredorIdentificationType(
            credorIdent?.length === 11 ? 'CPF' : credorIdent?.length === 14 ? 'CNPJ' : null,
        );
    }, [data]);

    useEffect(() => {
        const dataStatusDiligence = data?.properties['Status Diligência'].select?.name;
        setStatusDiligence(dataStatusDiligence || '');
    }, [data]);

    useEffect(() => {
        if (data) {
            setSliderValues((prevData) => ({
                ...prevData,
                proposal:
                    data.properties['Proposta Escolhida - Celer'].number ||
                    data.properties['(R$) Proposta Mínima - Celer'].number ||
                    0,
                comission:
                    data.properties['Comissão - Celer'].number ||
                    data.properties['(R$) Comissão Máxima - Celer'].number ||
                    0,
            }));

            setAuxValues({
                proposal:
                    data.properties['Proposta Escolhida - Celer'].number ||
                    data.properties['(R$) Proposta Mínima - Celer'].number ||
                    0,
                commission:
                    data.properties['Comissão - Celer'].number ||
                    data.properties['(R$) Comissão Mínima - Celer'].number ||
                    0,
            });

            if (proposalRef.current && comissionRef.current && observationRef.current) {
                proposalRef.current.value = numberFormat(
                    data.properties['Proposta Escolhida - Celer'].number ||
                        data.properties['(R$) Proposta Mínima - Celer'].number ||
                        0,
                );

                comissionRef.current.value = numberFormat(
                    data.properties['Comissão - Celer'].number ||
                        data.properties['(R$) Comissão Máxima - Celer'].number ||
                        0,
                );

                observationRef.current.value =
                    data?.properties?.['Observação']?.rich_text!.length > 0
                        ? data.properties['Observação'].rich_text![0].text.content
                        : '';
            }
        }
    }, [data]);

    return (
        <div className="flex w-full flex-col gap-5">
            <Form {...form}>
                <div className="space-y-6 rounded-md">
                    <section id="info_credor" className="form-inputs-container">
                        <div className="w-full 2xsm:col-span-4 lg:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="credor"
                                fieldType={InputFieldVariant.INPUT}
                                label="Nome do Credor"
                                defaultValue={
                                    data?.properties['Credor']?.title?.[0]?.plain_text || ''
                                }
                                iconSrc={<FaUser className="self-center" />}
                                iconAlt="user"
                                className="w-full"
                                onSubmit={(_, value) => handleChangeCreditorName(value, id)}
                                isLoading={loadingUpdateState.nomeCredor}
                                disabled={editLock}
                            />
                        </div>

                        <div className="w-full 2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="cpf_cnpj"
                                fieldType={InputFieldVariant.INPUT}
                                label={
                                    data?.properties['CPF/CNPJ']?.rich_text?.[0]?.plain_text &&
                                    data.properties['CPF/CNPJ'].rich_text[0].plain_text.length > 11
                                        ? 'CNPJ'
                                        : 'CPF'
                                }
                                defaultValue={
                                    data?.properties['CPF/CNPJ']?.rich_text?.[0].plain_text || ''
                                }
                                iconSrc={<FaIdCard className="self-center" />}
                                iconAlt="document"
                                className="w-full"
                                onSubmit={(_, value) => handleChangeIdentification(value, id)}
                                isLoading={loadingUpdateState.cpfCnpj}
                                disabled={editLock}
                            />
                        </div>
                    </section>

                    <section id="cedentes" className="form-inputs-container">
                        <div className="col-span-4 w-full">
                            <h3 className="font-medium text-bodydark2">
                                Informações sobre o cedente
                            </h3>
                        </div>
                        <div className="col-span-4 gap-4">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="grid min-w-40 md:col-span-3 lg:col-span-2 xl:col-span-2">
                                    <CelerInputField
                                        name="emissao_certidao_check"
                                        fieldType={InputFieldVariant.SELECT}
                                        label={`Certidões Emitidas ?`}
                                        defaultValue={
                                            data?.properties['Certidões emitidas']?.checkbox
                                                ? 'SIM'
                                                : 'NÃO'
                                        }
                                        onValueChange={(_, value) =>
                                            handleUpdateCertidoesEmitidas(value, id)
                                        }
                                        isLoading={loadingUpdateState.certidaoEmitidas}
                                        disabled={editLock}
                                        className="w-full"
                                    >
                                        <SelectItem value="SIM">Sim</SelectItem>
                                        <SelectItem value="NÃO">Não</SelectItem>
                                    </CelerInputField>

                                    {!data?.properties['Certidões emitidas']?.checkbox &&
                                        requiredDueInputsError && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Campo obrigatório para due
                                            </p>
                                        )}
                                </div>

                                <div className="grid min-w-40 md:col-span-3 lg:col-span-2 xl:col-span-2">
                                    <CelerInputField
                                        name="possui_processos_check"
                                        fieldType={InputFieldVariant.SELECT}
                                        label={`Possui Processos ?`}
                                        defaultValue={
                                            data?.properties['Possui processos?']?.checkbox
                                                ? 'SIM'
                                                : 'NÃO'
                                        }
                                        onValueChange={(_, value) =>
                                            handleUpdatePossuiProcessos(value, id)
                                        }
                                        isLoading={loadingUpdateState.possuiProcessos}
                                        disabled={editLock}
                                        className="w-full"
                                    >
                                        <SelectItem value="SIM">Sim</SelectItem>
                                        <SelectItem value="NÃO">Não</SelectItem>
                                    </CelerInputField>

                                    {!data?.properties['Possui processos?']?.checkbox &&
                                        requiredDueInputsError && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Campo obrigatório para due
                                            </p>
                                        )}
                                </div>

                                <div className="grid 2xsm:w-full md:col-span-6 md:w-115 xl:col-span-2">
                                    <CelerInputField
                                        className="w-full gap-2"
                                        fieldType={InputFieldVariant.SELECT}
                                        name="regime_casamento"
                                        label="Estado Civil"
                                        iconSrc={<BsCalendar2HeartFill />}
                                        defaultValue={
                                            credorIdentificationType === 'CPF'
                                                ? cedenteDataPF?.properties['Estado Civil']?.select
                                                      ?.name || ''
                                                : socioData?.properties['Estado Civil']?.select
                                                      ?.name || ''
                                        }
                                        onValueChange={(_, value) =>
                                            handleUpdateEstadoCivil(
                                                value,
                                                credorIdentificationType === 'CPF'
                                                    ? cedenteDataPF?.id!
                                                    : socioData?.id!,
                                            )
                                        }
                                        isLoading={loadingUpdateState.estadoCivil}
                                        disabled={editLock}
                                    >
                                        {tipoRegime.map((item, index) => (
                                            <SelectItem
                                                defaultChecked={
                                                    credorIdentificationType === 'CPF'
                                                        ? cedenteDataPF?.properties['Estado Civil']
                                                              ?.select?.name === item
                                                        : socioData?.properties['Estado Civil']
                                                              ?.select?.name === item
                                                }
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </CelerInputField>

                                    {credorIdentificationType === 'CPF' &&
                                        !cedenteDataPF?.properties['Estado Civil']?.select?.name &&
                                        requiredDueInputsError && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Campo obrigatório para due
                                            </p>
                                        )}

                                    {credorIdentificationType === 'CNPJ' &&
                                        !socioData?.properties['Estado Civil']?.select?.name &&
                                        requiredDueInputsError && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Campo obrigatório para due
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => data && setCedenteModal(data)}
                                    className="flex items-center gap-3 rounded-md border border-strokedark/20 px-4 py-2 text-sm font-medium uppercase text-slate-600 transition-colors duration-200 hover:bg-strokedark/20 dark:border-stroke/20 dark:text-white dark:hover:bg-stroke/20"
                                >
                                    {data?.properties['Cedente PF'].relation?.[0] ||
                                    data?.properties['Cedente PJ'].relation?.[0] ? (
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
                                <button
                                    onClick={() => data && setDocModalInfo(data)}
                                    className="flex items-center gap-3 rounded-md border border-strokedark/20 px-4 py-2 text-sm font-medium uppercase text-slate-600 transition-colors duration-200 hover:bg-strokedark/20 dark:border-stroke/20 dark:text-white dark:hover:bg-stroke/20"
                                >
                                    <FaRegFilePdf />
                                    Gerir Documentos
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="form-inputs-container" id="info_processo">
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                            <CelerInputField
                                name="npu_originario"
                                fieldType={InputFieldVariant.INPUT}
                                label="NPU (Originário)"
                                defaultValue={
                                    data?.properties['NPU (Originário)']?.rich_text?.[0].plain_text
                                }
                                iconSrc={<IoDocumentTextSharp className="self-center" />}
                                iconAlt="law"
                                className="w-full"
                                onSubmit={(_, value) =>
                                    handleChangeNpu(value, 'NPU (Originário)', id)
                                }
                                isLoading={loadingUpdateState.npuOriginario}
                                disabled={editLock}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                            <CelerInputField
                                name="npu_precatorio"
                                fieldType={InputFieldVariant.INPUT}
                                label="NPU (Precatório)"
                                defaultValue={
                                    data?.properties['NPU (Precatório)']?.rich_text?.[0]
                                        .plain_text || ''
                                }
                                iconSrc={<IoDocumentTextSharp className="self-center" />}
                                iconAlt="law"
                                className="w-full"
                                onSubmit={(_, value) =>
                                    handleChangeNpu(value, 'NPU (Precatório)', id)
                                }
                                isLoading={loadingUpdateState.npuPrecatorio}
                                disabled={editLock}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                            <CelerInputField
                                name="juizo_vara"
                                fieldType={InputFieldVariant.INPUT}
                                label="Vara"
                                defaultValue={
                                    data?.properties['Juízo']?.rich_text?.[0].plain_text || ''
                                }
                                iconSrc={<FaBuildingColumns className="self-center" />}
                                iconAlt="law"
                                className="w-full"
                                onSubmit={(_, value) => handleChangeJuizo(value, id)}
                                isLoading={loadingUpdateState.juizoVara}
                                disabled={editLock}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                            <CelerInputField
                                name="ente_devedor"
                                fieldType={InputFieldVariant.INPUT}
                                label="Ente Devedor"
                                defaultValue={data?.properties['Ente Devedor'].select?.name || ''}
                                iconSrc={<FaBuilding className="self-center" />}
                                iconAlt="law"
                                className="w-full"
                                onSubmit={(_, value) => handleChangeEnteDevedor(value, id)}
                                isLoading={loadingUpdateState.enteDevedor}
                                disabled={editLock}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                            <CelerInputField
                                name="estado_ente_devedor"
                                fieldType={InputFieldVariant.SELECT}
                                label="Estado Ente Devedor"
                                defaultValue={
                                    data?.properties['Estado do Ente Devedor'].select?.name || ''
                                }
                                iconSrc={<FaMapMarkedAlt className="self-center" />}
                                iconAlt="law"
                                className="w-full"
                                onValueChange={(_, value) =>
                                    handleChangeEstadoEnteDevedor(value, id)
                                }
                                isLoading={loadingUpdateState.estadoEnteDevedor}
                                disabled={editLock}
                            >
                                {estados.map((estado) => (
                                    <SelectItem
                                        className="shad-select-item"
                                        defaultChecked={
                                            data?.properties['Estado do Ente Devedor'].select
                                                ?.name === estado.id
                                        }
                                        key={estado.id}
                                        value={estado.id}
                                    >
                                        {estado.nome}
                                    </SelectItem>
                                ))}
                            </CelerInputField>
                        </div>
                    </section>
                    {/* Proposta */}
                    <div className="flex flex-row gap-4">
                        <section
                            id="info_valores"
                            className="rounded-md bg-white p-4 dark:bg-boxdark"
                        >
                            <form onSubmit={form.handleSubmit(onSubmitForm)}>
                                <div className="grid grid-cols-2 gap-6 3xl:grid-cols-2">
                                    {/* tipo */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="tipo_do_oficio"
                                            label="Tipo"
                                            fieldType={InputFieldVariant.SELECT}
                                            defaultValue={
                                                data?.properties['Tipo'].select?.name ?? ''
                                            }
                                            className="w-full"
                                        >
                                            <SelectItem value="PRECATÓRIO">PRECATÓRIO</SelectItem>
                                            <SelectItem value="CREDITÓRIO">CREDITÓRIO</SelectItem>
                                            <SelectItem value="R.P.V.">R.P.V.</SelectItem>
                                        </CelerInputFormField>
                                    </div>
                                    {/* natureza */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="natureza"
                                            label="Natureza"
                                            fieldType={InputFieldVariant.SELECT}
                                            defaultValue={
                                                data?.properties['Natureza'].select?.name ?? ''
                                            }
                                            className="w-full"
                                        >
                                            <SelectItem value="NÃO TRIBUTÁRIA">
                                                NÃO TRIBUTÁRIA
                                            </SelectItem>
                                            <SelectItem value="TRIBUTÁRIA">TRIBUTÁRIA</SelectItem>
                                        </CelerInputFormField>
                                    </div>
                                    {/* esfera */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="esfera"
                                            label="Esfera"
                                            fieldType={InputFieldVariant.SELECT}
                                            defaultValue={
                                                data?.properties['Esfera'].select?.name ?? ''
                                            }
                                            className="w-full"
                                        >
                                            <SelectItem value="FEDERAL">FEDERAL</SelectItem>
                                            <SelectItem value="ESTADUAL">ESTADUAL</SelectItem>
                                            <SelectItem value="MUNICIPAL">MUNICIPAL</SelectItem>
                                        </CelerInputFormField>
                                    </div>
                                    {/* regime */}
                                    {form.watch('esfera') !== 'FEDERAL' && (
                                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                            <CelerInputFormField
                                                control={form.control}
                                                name="regime"
                                                label="Regime"
                                                fieldType={InputFieldVariant.SELECT}
                                                defaultValue={
                                                    data?.properties['Regime'].select?.name ?? ''
                                                }
                                                className="w-full"
                                            >
                                                <SelectItem value="GERAL">GERAL</SelectItem>
                                                <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                                            </CelerInputFormField>
                                        </div>
                                    )}
                                    {/* tribunal */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="tribunal"
                                            label="Tribunal"
                                            fieldType={InputFieldVariant.SELECT}
                                            defaultValue={
                                                data?.properties['Tribunal'].select?.name ?? ''
                                            }
                                            className="w-full"
                                        >
                                            {tribunais.map((tribunal) => (
                                                <SelectItem key={tribunal.id} value={tribunal.id}>
                                                    {tribunal.nome}
                                                </SelectItem>
                                            ))}
                                        </CelerInputFormField>
                                    </div>
                                    {/* valor principal */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="valor_principal"
                                            label="Valor Principal"
                                            fieldType={InputFieldVariant.NUMBER}
                                            currencyFormat="R$ "
                                            defaultValue={
                                                data?.properties['Valor Principal'].number ?? 0
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    {/* valor juros */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="valor_juros"
                                            label="Juros"
                                            fieldType={InputFieldVariant.NUMBER}
                                            currencyFormat="R$ "
                                            defaultValue={
                                                data?.properties['Valor Juros'].number ?? 0
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    {/* data base */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="data_base"
                                            label="Data Base"
                                            fieldType={InputFieldVariant.DATE}
                                            defaultValue={
                                                data?.properties['Data Base'].date?.start ?? ''
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    {/* data requisição */}
                                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                        <CelerInputFormField
                                            control={form.control}
                                            name="data_requisicao"
                                            label="Data Requisição"
                                            fieldType={InputFieldVariant.DATE}
                                            defaultValue={
                                                data?.properties['Data do Recebimento'].date
                                                    ?.start ?? ''
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <hr className="mt-6 border border-stroke dark:border-strokedark" />

                                <div className="mt-6 grid gap-6 md:grid-cols-4">
                                    <div className="grid gap-6 2xsm:col-span-4 xl:col-span-2 xl:grid-cols-2 3xl:col-span-3">
                                        {/* percentual adquirido */}
                                        <div className="2xsm:col-span-4 xl:col-span-1">
                                            <CelerInputFormField
                                                control={form.control}
                                                name="valor_aquisicao_total"
                                                label="Aquisição Total"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                className="w-full"
                                            />
                                        </div>
                                        {form.watch('valor_aquisicao_total') === false ? (
                                            <div className="2xsm:col-span-4 xl:col-span-1">
                                                <CelerInputFormField
                                                    control={form.control}
                                                    name="percentual_a_ser_adquirido"
                                                    label="Percentual de Aquisição (%)"
                                                    fieldType={InputFieldVariant.NUMBER}
                                                    className="w-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="2xsm:hidden xl:col-span-1 xl:block">
                                                &nbsp;
                                            </div>
                                        )}

                                        {/* destacamento de honorários */}
                                        <div className="flex gap-6 2xsm:col-span-4 xl:col-span-1">
                                            <CelerInputFormField
                                                control={form.control}
                                                name="ja_possui_destacamento"
                                                label="Já Possui Destacamento de Honorários?"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                className="w-full"
                                            />
                                        </div>

                                        {!form.watch('ja_possui_destacamento') ? (
                                            <div className="2xsm:col-span-4 xl:col-span-1">
                                                <CelerInputFormField
                                                    control={form.control}
                                                    name="percentual_de_honorarios"
                                                    label="Percentual de Honorários (%)"
                                                    fieldType={InputFieldVariant.NUMBER}
                                                    className="w-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="2xsm:hidden xl:col-span-1 xl:block">
                                                &nbsp;
                                            </div>
                                        )}

                                        {/* juros moratórios */}
                                        <div
                                            className={`col-span-2 ${form.watch('data_base') && form.watch('data_base').split('/').reverse().join('-') < '2021-12-01' && form.watch('natureza') !== 'TRIBUTÁRIA' ? '' : 'hidden'}`}
                                        >
                                            <CelerInputFormField
                                                control={form.control}
                                                name="incidencia_juros_moratorios"
                                                label="Juros de Mora Fixados em Sentença"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* incide selic */}
                                        <div
                                            className={`2xsm:col-span-4 xl:col-span-2 ${form.watch('data_base') && form.watch('data_base').split('/').reverse().join('-') > '2021-12-01' && form.watch('natureza') !== 'TRIBUTÁRIA' ? '' : 'hidden'}`}
                                        >
                                            <CelerInputFormField
                                                control={form.control}
                                                name="nao_incide_selic_no_periodo_db_ate_abril"
                                                label="SELIC Somente Sobre o Principal"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* incidência IR */}
                                        <div className="2xsm:col-span-4 xl:col-span-2">
                                            <CelerInputFormField
                                                control={form.control}
                                                name="incidencia_rra_ir"
                                                label="Incidência de IR"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Incidência de IR sobre RRA */}
                                        {form.watch('natureza') !== 'TRIBUTÁRIA' &&
                                        form.watch('incidencia_rra_ir') === true ? (
                                            <>
                                                <div className="2xsm:col-span-4 xl:col-span-1">
                                                    <CelerInputFormField
                                                        control={form.control}
                                                        name="ir_incidente_rra"
                                                        label="IR Incidente sobre RRA?"
                                                        fieldType={InputFieldVariant.CHECKBOX}
                                                        className="w-full"
                                                    />
                                                </div>
                                                {form.watch('ir_incidente_rra') === true ? (
                                                    <div className="col-span-1">
                                                        <CelerInputFormField
                                                            control={form.control}
                                                            name="numero_de_meses"
                                                            label="Número de Meses"
                                                            fieldType={InputFieldVariant.INPUT}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="2xsm:hidden xl:col-span-1 xl:block">
                                                        &nbsp;
                                                    </div>
                                                )}
                                            </>
                                        ) : null}

                                        {/* incidência de PSS */}
                                        {form.watch('natureza') !== 'TRIBUTÁRIA' && (
                                            <>
                                                <div className="2xsm:col-span-4 xl:col-span-1">
                                                    <CelerInputFormField
                                                        control={form.control}
                                                        name="incidencia_pss"
                                                        label="Incide PSS?"
                                                        fieldType={InputFieldVariant.CHECKBOX}
                                                        className="w-full"
                                                    />
                                                </div>
                                                {form.watch('incidencia_pss') === true ? (
                                                    <div className="2xsm:col-span-4 xl:col-span-1">
                                                        <CelerInputFormField
                                                            control={form.control}
                                                            name="valor_pss"
                                                            label="Valor PSS"
                                                            fieldType={InputFieldVariant.NUMBER}
                                                            currencyFormat={'R$ '}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="2xsm:hidden xl:col-span-1 xl:block">
                                                        &nbsp;
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* data limite de atualização */}
                                        <div className="2xsm:col-span-4 xl:col-span-1">
                                            <CelerInputFormField
                                                control={form.control}
                                                name="data_limite_de_atualizacao_check"
                                                label="Atualiza Para Data Passada?"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                className="w-full"
                                            />
                                        </div>

                                        {form.watch('data_limite_de_atualizacao_check') === true ? (
                                            <div className="2xsm:col-span-4 xl:col-span-1">
                                                <CelerInputFormField
                                                    control={form.control}
                                                    name="data_limite_de_atualizacao"
                                                    label="Atualizado Até:"
                                                    fieldType={InputFieldVariant.DATE}
                                                    className="w-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="2xsm:hidden xl:col-span-1 xl:block">
                                                &nbsp;
                                            </div>
                                        )}

                                        {form.watch('data_limite_de_atualizacao') &&
                                            form
                                                .watch('data_limite_de_atualizacao')
                                                .split('/')
                                                .reverse()
                                                .join('-') <
                                                form
                                                    .watch('data_requisicao')
                                                    .split('/')
                                                    .reverse()
                                                    .join('-') && (
                                                <span className="col-span-2 text-xs text-red-500 dark:text-red-400">
                                                    Data de atualização não pode ser menor que a
                                                    data da requisição
                                                </span>
                                            )}
                                    </div>

                                    <div className="col-span-4 flex w-full justify-center">
                                        <hr className="my-6 border border-stroke dark:border-strokedark" />
                                        <CelerInputFormField
                                            name="observacao"
                                            control={form.control}
                                            fieldType={InputFieldVariant.TEXTAREA}
                                            label="Motivo da Atualização"
                                            required={true}
                                            placeholder="Insira o motivo da atualização do ativo"
                                            iconSrc={<IoIosPaper className="self-center" />}
                                            iconAlt="law"
                                            className="w-full"
                                            rows={7}
                                            disabled={editLock}
                                        />
                                    </div>

                                    <div className="col-span-4 w-full justify-center">
                                        <h3 className="text-sm font-medium text-bodydark2 2xsm:text-center md:text-left">
                                            Atenção: A atualização dos valores, datas, percentuais
                                            etc implica na modificação do valor líquido do ativo.
                                            Caso o status do ativo será alterado para Repactuação,
                                            ele retornará para o broker para re-negociação.
                                        </h3>
                                    </div>
                                </div>

                                <hr className="mt-6 border border-stroke dark:border-strokedark" />

                                <div className="mt-6 flex items-center justify-center gap-6">
                                    <p>Valor Líquido: </p>
                                    {!isLoading && (
                                        <span className="font-medium">
                                            {numberFormat(
                                                happenedRecalculation === false
                                                    ? data?.properties[
                                                          'Valor Líquido (Com Reserva dos Honorários)'
                                                      ]?.formula?.number || 0
                                                    : recalculationData.result
                                                          .net_mount_to_be_assigned,
                                            )}
                                        </span>
                                    )}
                                </div>
                            </form>
                        </section>

                        <div className="grid w-full gap-5 border-l-0 border-t-2 border-stroke bg-white pl-0 pt-5 text-[#333] dark:border-strokedark dark:bg-boxdark dark:text-white md:mt-0 md:border-l-2 md:border-t-0 md:pl-3 md:pt-5">
                            <div className="relative flex h-fit flex-col gap-5 p-8 sm:pb-0">
                                <div className="flex items-center justify-between gap-6 2xsm:flex-col md:flex-row">
                                    <div className="flex w-full flex-1 flex-col items-center gap-4 pb-2 2xsm:pb-0 md:pb-2">
                                        <div className="flex items-center text-sm font-medium">
                                            <p className="w-full text-sm">Proposta:</p>
                                            <input
                                                ref={proposalRef}
                                                type="text"
                                                disabled={
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Due Diligence') ||
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Em liquidação') ||
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Juntar Documentos') ||
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Pendência a Sanar')
                                                }
                                                onBlur={(e) => {
                                                    e.target.value = formatCurrency(e.target.value);
                                                }}
                                                value={numberFormat(sliderValues.proposal)}
                                                onChange={(e) =>
                                                    changeInputValues('proposal', e.target.value)
                                                }
                                                className="ml-2 max-w-35 rounded-md border-none bg-gray-100 py-2 pl-1 pr-2 text-center text-sm font-medium text-body focus-visible:ring-body disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-boxdark-2/50 dark:text-bodydark dark:focus-visible:ring-snow"
                                            />
                                        </div>
                                        <input
                                            // ref={proposalRangeRef}
                                            type="range"
                                            step="0.01"
                                            disabled={
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Due Diligence') ||
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Em liquidação') ||
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Juntar Documentos') ||
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Pendência a Sanar')
                                            }
                                            min={
                                                data?.properties['(R$) Proposta Mínima - Celer']
                                                    .number || 0
                                            }
                                            max={
                                                data?.properties['(R$) Proposta Máxima - Celer']
                                                    .number || 0
                                            }
                                            value={sliderValues.proposal}
                                            onChange={(e) =>
                                                handleProposalSliderChange(e.target.value, true)
                                            }
                                            className="range-slider w-full disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="relative flex items-center justify-between gap-5 rounded-xl 2xsm:flex-col md:flex-row">
                                    <div className="flex w-full flex-1 flex-col items-center gap-4 rounded-xl">
                                        <div className="flex items-center text-sm font-medium ">
                                            <p className="text-sm">Comissão:</p>
                                            <input
                                                ref={comissionRef}
                                                type="text"
                                                disabled={
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Due Diligence') ||
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Em liquidação') ||
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Juntar Documentos') ||
                                                    (data?.properties['Status'].status?.name ===
                                                        'Proposta aceita' &&
                                                        data?.properties['Status Diligência'].select
                                                            ?.name === 'Pendência a Sanar')
                                                }
                                                onBlur={(e) => {
                                                    e.target.value = formatCurrency(e.target.value);
                                                }}
                                                value={numberFormat(sliderValues.comission)}
                                                onChange={(e) =>
                                                    changeInputValues('comission', e.target.value)
                                                }
                                                className="ml-2 max-w-35 rounded-md border-none bg-gray-100 py-2 pl-1 pr-2 text-center text-sm font-medium text-body focus-visible:ring-body disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:bg-boxdark-2/50 dark:text-bodydark dark:focus-visible:ring-snow"
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            step="0.01"
                                            disabled={
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Due Diligence') ||
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Em liquidação') ||
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Juntar Documentos') ||
                                                (data?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    data?.properties['Status Diligência'].select
                                                        ?.name === 'Pendência a Sanar')
                                            }
                                            min={
                                                data?.properties['(R$) Comissão Mínima - Celer']
                                                    .number || 0
                                            }
                                            max={
                                                data?.properties['(R$) Comissão Máxima - Celer']
                                                    .number || 0
                                            }
                                            value={sliderValues.comission}
                                            onChange={(e) =>
                                                handleComissionSliderChange(e.target.value, true)
                                            }
                                            className="range-slider-reverse [::-webkit-slider-thumb]::-webkit-slider-thumb {background-color: #FFF;} w-full disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex w-fit gap-2">
                                    <Button
                                        disabled={isProposalButtonDisabled}
                                        onClick={saveProposalAndComission}
                                        className="h-8 w-full px-2 py-1 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {savingProposalAndComission
                                            ? 'Salvando...'
                                            : 'Salvar Oferta'}
                                    </Button>
                                </div>

                                {errorMessage && (
                                    <div className="absolute -bottom-4 w-full text-center text-xs text-red">
                                        Valor&#40;res&#41; fora do escopo definido
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

            <section className="grid grid-cols-12 justify-center gap-5">
                <div
                    id="cedentes"
                    className={`${grafico ? 'col-span-8' : 'col-span-12'} grid gap-6 rounded-md bg-white p-8 dark:bg-boxdark`}
                >
                    <h3 className="font-medium text-bodydark2">Detalhes do precatório</h3>
                    <div className="grid grid-cols-4 gap-6 3xl:grid-cols-6">
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="vl_com_reservas"
                                fieldType={InputFieldVariant.INPUT}
                                label="Valor Líquido"
                                defaultValue={numberFormat(
                                    data?.properties['Valor Líquido (Com Reserva dos Honorários)']
                                        ?.formula?.number || 0,
                                )}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>

                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="proposta"
                                fieldType={InputFieldVariant.INPUT}
                                label="Proposta Escolhida"
                                defaultValue={numberFormat(
                                    data?.properties['Proposta Escolhida - Celer']?.number || 0,
                                )}
                                iconSrc={<LuHandshake className="self-center" />}
                                iconAlt="deal"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="comissao"
                                fieldType={InputFieldVariant.INPUT}
                                label="Comissão"
                                defaultValue={numberFormat(
                                    data?.properties['Comissão - Celer']?.number || 0,
                                )}
                                iconSrc={<TbMoneybag className="self-center" />}
                                iconAlt="money_bag"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="custo_total"
                                fieldType={InputFieldVariant.INPUT}
                                label="Custo total do Precatório (absoluto)"
                                defaultValue={numberFormat(
                                    (data?.properties['Comissão - Celer'].number || 0) +
                                        (data?.properties['Proposta Escolhida - Celer'].number ||
                                            0),
                                )}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="custo"
                                fieldType={InputFieldVariant.INPUT}
                                label="Custo do precatório"
                                defaultValue={percentageFormater(
                                    data?.properties['Custo do precatório']?.formula?.number || 0,
                                )}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="receive_money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="loa"
                                fieldType={InputFieldVariant.INPUT}
                                label="LOA"
                                defaultValue={
                                    data?.properties['LOA']?.number || 'Sem LOA cadastrada'
                                }
                                iconSrc={<IoCalendar className="self-center" />}
                                iconAlt="calendar"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="esfera"
                                fieldType={InputFieldVariant.INPUT}
                                label="Esfera"
                                defaultValue={
                                    data?.properties['Esfera'].select?.name || 'Não informada'
                                }
                                iconSrc={<IoGlobeOutline className="self-center" />}
                                iconAlt="calendar"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="percentual_de_honorarios"
                                fieldType={InputFieldVariant.INPUT}
                                label="Destacamento de Honorários"
                                defaultValue={percentageFormater(
                                    data?.properties['Percentual de Honorários Não destacados']
                                        .number || 0,
                                )}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="percentual_a_ser_adquirido"
                                fieldType={InputFieldVariant.INPUT}
                                label="Percentual a ser Adquirido"
                                defaultValue={percentageFormater(
                                    data?.properties['Percentual a ser adquirido']?.number || 0,
                                )}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="valor_liquido_cedido"
                                fieldType={InputFieldVariant.INPUT}
                                label="Valor Líquido a ser Cedido"
                                defaultValue={numberFormat(
                                    data?.properties['Valor Líquido a ser cedido']?.formula
                                        ?.number || 0,
                                )}
                                iconSrc={<GiPayMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="valor_total_inscrito"
                                fieldType={InputFieldVariant.INPUT}
                                label="Valor Total Inscrito"
                                defaultValue={numberFormat(
                                    data?.properties['Valor Total Inscrito']?.formula?.number || 0,
                                )}
                                iconSrc={<GrMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="imposto_de_renda_retido_3"
                                fieldType={InputFieldVariant.INPUT}
                                label="Imposto de Renda"
                                defaultValue={numberFormat(
                                    data?.properties['Imposto de Renda Retido 3%']?.number || 0,
                                )}
                                iconSrc={<GiTakeMyMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="rra"
                                fieldType={InputFieldVariant.INPUT}
                                label="RRA"
                                defaultValue={numberFormat(data?.properties?.RRA?.number || 0)}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="PSS"
                                fieldType={InputFieldVariant.INPUT}
                                label="PSS"
                                defaultValue={numberFormat(data?.properties?.PSS?.number || 0)}
                                iconSrc={<GiReceiveMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                        <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-2">
                            <CelerInputField
                                name="valor_dos_honorarios_nao_destacados"
                                fieldType={InputFieldVariant.INPUT}
                                label="Valor dos Honorários"
                                defaultValue={numberFormat(
                                    data?.properties['Honorários não destacados']?.formula
                                        ?.number || 0,
                                )}
                                iconSrc={<GiTakeMyMoney className="self-center" />}
                                iconAlt="money"
                                className="w-full disabled:text-boxdark disabled:dark:text-white"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <hr className="border border-stroke dark:border-strokedark" />

                    <div className="grid gap-6">
                        <CelerInputField
                            name="calculo_revisado_check"
                            fieldType={InputFieldVariant.CHECKBOX}
                            checked={data?.properties['Cálculo Revisado'].checkbox}
                            label="Cálculo Revisado"
                            isLoading={loadingUpdateState.revisaoCalculo}
                            onValueChange={(_, value) => handleUpdateRevisaoCalculo(value, id)}
                            className="text-sm font-medium"
                        />
                    </div>
                </div>
                {grafico && (
                    <div className="col-span-4">
                        <section id="valores_grafico">
                            <div className="grid gap-4 2xsm:grid-cols-2 md:gap-6 xl:grid-cols-12 2xl:gap-7.5">
                                <div className="col-span-8 3xl:col-span-8">{grafico}</div>
                            </div>
                        </section>
                    </div>
                )}
            </section>

            <section id="observacao" className="form-inputs-container">
                <div className="col-span-5">
                    <p className="mb-2">Observações:</p>
                    <div className="relative">
                        <textarea
                            defaultValue={
                                data?.properties['Observação']?.rich_text?.[0]?.plain_text || ''
                            }
                            className="w-full resize-none rounded-md border-stroke placeholder:text-sm dark:border-strokedark dark:bg-boxdark-2/50"
                            onChange={(e) => setObservation(e.target.value)}
                            rows={10}
                            placeholder="Insira uma observação"
                        />
                        <Button
                            variant="ghost"
                            onClick={() => handleUpdateObservation(observation, id)}
                            className="absolute bottom-3 right-2 z-2 bg-slate-100 px-1 py-1 text-sm hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70"
                        >
                            {/* {
                                            savingObservation ? (
                                                <AiOutlineLoading className="text-lg animate-spin" />
                                            ) : ( */}
                            <BiSave className="text-lg" />
                            {/* )
                                        } */}
                        </Button>
                    </div>
                </div>
            </section>
            {cedenteModal !== null && <BrokerModal />}
            {docModalInfo !== null && <DocForm />}
        </div>
    );
};
