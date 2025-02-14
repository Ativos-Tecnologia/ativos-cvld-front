'use client';
import { BrokersContext } from '@/context/BrokersContext';
import { GeneralUIContext } from '@/context/GeneralUIContext';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { formatCurrency } from '@/functions/formaters/formatCurrency';
import { applyMaskCpfCnpj } from '@/functions/formaters/maskCpfCnpj';
import numberFormat from '@/functions/formaters/numberFormat';
import UseMySwal from '@/hooks/useMySwal';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiCheck, BiRefresh, BiSave, BiTrash, BiX } from 'react-icons/bi';
import { BsCheckCircleFill, BsPencilSquare } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa';
import { GrDocumentUser } from 'react-icons/gr';
import { HiCheck } from 'react-icons/hi';
import { IoCloseCircle } from 'react-icons/io5';
import { RiErrorWarningFill } from 'react-icons/ri';
import { TbReportMoney } from 'react-icons/tb';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { Button } from '../Button';
import CustomCheckbox from '../CrmUi/Checkbox';
import ConfirmModal from '../CrmUi/ConfirmModal';
import CRMTooltip from '../CrmUi/Tooltip';
import Badge from '../CrmUi/ui/Badge/Badge';
import EditOficioBrokerForm from '../Forms/EditOficioBrokerForm';
import { IdentificationType } from '../Modals/BrokersCedente';
import { PrintPDF } from '../PrintPDF';
import { MultiStepLoader } from '../ui/multi-step-loader';
import { sleep } from '@/functions/timer/sleep';

export interface IChecksProps {
    is_precatorio_complete: boolean | null;
    is_cedente_complete: boolean | null;
    are_docs_complete: boolean | null;
    isFetching: boolean;
};

const loadingSteps = {
    "accept": [
        "Reunindo Informações" ,
        "Verificando os Dados",
        "Enviando Proposta",
        "Configurando Prazos",
        "Repassando para o Jurídico",
        "Validando Proposta",
        "Proposta Aceita"
    ],
    "decline": [
        "Conectando com o banco de dados",
        "Verificando os Dados",
        "Alterando Status de Proposta",
        "Removendo prazos",
        "Retirando ofício do Jurídico",
        "Retornado para Negociação",
    ]
}

/**
 * @param {NotionPage} oficio - O ativo que vai ser carregado no componente
 * @returns {JSX.Element} - O card renderizado
 */
const DashbrokersCard = ({ oficio }: { oficio: NotionPage }): JSX.Element => {
    /* ====> context imports <==== */
    const {
        fetchCardData,
        setCedenteModal,
        deleteModalLock,
        isFetchAllowed,
        setIsFetchAllowed,
        setDeleteModalLock,
        setDocModalInfo,
        fetchDetailCardData,
        specificCardData,
        setSpecificCardData,
        selectedUser,
        setEditModalId,
    } = useContext(BrokersContext);

    const {
        data: { profile_picture, first_name, last_name, phone },
    } = useContext(UserInfoAPIContext);

    /** teste */
    const [showMultiLoader, setShowMultiLoader] = useState<boolean>(false)

    /* ====> value states <==== */
    const [auxValues, setAuxValues] = useState<{ proposal: number; commission: number }>({
        proposal: 0,
        commission: 0,
    });
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0,
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdatingDiligence, setIsUpdatingDiligence] = useState<boolean>(false);
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
    const [savingObservation, setSavingObservation] = useState<boolean>(false);
    const [isProposalButtonDisabled, setIsProposalButtonDisabled] = useState<boolean>(true);
    const [isProposalChanging, setIsProposalChanging] = useState<boolean>(false);
    const [proposalReqStatus, setProposalReqStatus] = useState<"success" | "failure" | null>(null);
    const [proposalReqType, setProposalReqType] = useState<"accept" | "decline" | null>(null);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const [credorIdentificationType, setCredorIdentificationType] =
        useState<IdentificationType>(null);
    const [confirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [checks, setChecks] = useState<IChecksProps>({
        is_precatorio_complete: false,
        is_cedente_complete: false,
        are_docs_complete: false,
        isFetching: false,
    });

    const { theme } = useContext(GeneralUIContext);
    const swal = UseMySwal();

    /* ====> refs <==== */
    const proposalRef = useRef<HTMLInputElement | null>(null);
    const comissionRef = useRef<HTMLInputElement | null>(null);
    const observationRef = useRef<HTMLTextAreaElement | null>(null);
    const isFirstLoad = useRef(true); // referência: 'isFirstLoad' sempre apontará para o mesmo objeto retornado por useRef
    const multiLoaderSteps = useRef<any>([...loadingSteps.accept]);
    const [loading, setLoading] = useState<boolean>(false);
    const documentRef = useRef<HTMLDivElement>(null);

    //* ====> Principal Data <==== */
    const [mainData, setMainData] = useState<NotionPage | null>(null);

    /**
     * Função responsável por fazer fetch em todos os estados dos checks
     *
     * @returns {Promise<void>} - retorno da função
     */
    const fetchAllChecks = async (): Promise<void> => {
        setChecks((old) => ({
            ...old,
            isFetching: true,
        }));

        const cedenteType = credorIdentificationType === 'CPF' ? 'Cedente PF' : 'Cedente PJ';

        const idCedente = mainData?.properties[cedenteType].relation?.[0]
            ? mainData.properties[cedenteType].relation?.[0].id
            : null;

        try {
            const req =
                credorIdentificationType === 'CPF'
                    ? await api.get(
                        `/api/checker/pf/complete/precatorio/${mainData?.id}/cedente/${idCedente}/`,
                    )
                    : await api.get(
                        `/api/checker/pj/complete/precatorio/${mainData?.id}/cedente/${idCedente}/`,
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
     * Fecha o loader de proposta e limpa o status da requisição de proposta
     */
    function handleCloseLoader() {
        setShowMultiLoader(false);
        setProposalReqStatus(null);
    }

    /**
     * Função para atualizar a proposta e ajustar a comissão proporcionalmente
     * @param {string} value - valor da proposta
     * @param {boolean} sliderChange - indica se a mudança vem de um slider
     * @returns {void}
     */
    const handleProposalSliderChange = (value: string, sliderChange: boolean): void => {
        if (mainData) {
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
                    (mainData?.properties['(R$) Proposta Mínima - Celer'].number || 0)) /
                ((mainData?.properties['(R$) Proposta Máxima - Celer'].number || 0) -
                    (mainData?.properties['(R$) Proposta Mínima - Celer'].number || 0));

            // define o novo valor da comissão em relação a proporção
            const newComissionSliderValue =
                (mainData?.properties['(R$) Comissão Máxima - Celer'].number || 0) -
                proportion *
                ((mainData?.properties['(R$) Comissão Máxima - Celer'].number || 0) -
                    (mainData?.properties['(R$) Comissão Mínima - Celer'].number || 0));

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
        if (mainData) {
            // seta o valor da slider como o atual
            const newComissionSliderValue = parseFloat(value);
            setSliderValues((oldValues) => {
                return { ...oldValues, comission: newComissionSliderValue };
            });

            // Calcular a proporção em relação a comissão e ajustar a proposta
            const proportion =
                (newComissionSliderValue -
                    (mainData.properties['(R$) Comissão Mínima - Celer'].number || 0)) /
                ((mainData.properties['(R$) Comissão Máxima - Celer'].number || 0) -
                    (mainData.properties['(R$) Comissão Mínima - Celer'].number || 0));

            //  define o novo valor da proposta em relação a proporção
            const newProposalSliderValue =
                (mainData.properties['(R$) Proposta Máxima - Celer'].number || 0) -
                proportion *
                ((mainData.properties['(R$) Proposta Máxima - Celer'].number || 0) -
                    (mainData.properties['(R$) Proposta Mínima - Celer'].number || 0));

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
                    (oficio.properties['(R$) Proposta Mínima - Celer'].number || 0) &&
                    numericalValue <=
                    (oficio.properties['(R$) Proposta Máxima - Celer'].number || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.proposal
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

                if (
                    numericalValue <
                    (oficio.properties['(R$) Proposta Mínima - Celer'].number || 0) ||
                    numericalValue >
                    (oficio.properties['(R$) Proposta Máxima - Celer'].number || 0) ||
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
                    (oficio.properties['(R$) Comissão Mínima - Celer'].number || 0) &&
                    numericalValue <=
                    (oficio.properties['(R$) Comissão Máxima - Celer'].number || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.commission
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

                if (
                    numericalValue <
                    (oficio.properties['(R$) Comissão Mínima - Celer'].number || 0) ||
                    numericalValue >
                    (oficio.properties['(R$) Comissão Máxima - Celer'].number || 0) ||
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
        const req = await api.patch(`/api/notion-api/broker/negotiation/${oficio.id}/`, {
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
            fetchDetailCardData(mainData!.id);
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
            const req = await api.patch(`api/notion-api/update/${mainData?.id}/`, {
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
            const previousData = mainData;
            return { previousData };
        },
        onError: (error, message, context) => {
            setMainData(context?.previousData as NotionPage);
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

    const proposalTrigger = useMutation({
        mutationFn: async (status: string) => {
            const req =
                status === 'Proposta aceita'
                    ? await api.patch(`api/notion-api/broker/accept-proposal/${mainData?.id}/`)
                    : await api.patch(`api/notion-api/broker/decline-proposal/${mainData?.id}/`);
            return req.status;
        },
        onMutate: async () => {
            setIsFetchAllowed(false);
            setShowMultiLoader(true);
            setIsProposalChanging(true);
        },
        onError: async () => {
            setIsFetchAllowed(true);
            setProposalReqStatus("failure");
            // toast.error('Erro ao modificar proposta! Contate a Ativos para verificar o motivo.', {
            //     icon: <BiX className="fill-red-500 text-lg" />,
            // });
        },
        onSuccess: async () => {
            setIsFetchAllowed(true);
            setProposalReqStatus("success");
            await fetchDetailCardData(mainData!.id);
            // if (
            //     mainData?.properties['Status'].status?.name !== 'Proposta aceita' &&
            //     checks.are_docs_complete &&
            //     checks.is_cedente_complete &&
            //     checks.is_precatorio_complete
            // ) {
            //     confetti({
            //         spread: 180,
            //         particleCount: 300,
            //         origin: {
            //             y: 0.5,
            //         },
            //     });
            //     swal.fire({
            //         icon: 'success',
            //         iconColor: '#00b809',
            //         title: 'Agora é com a gente!',
            //         text: 'Nosso setor jurídico dará inicio ao processo de Due Diligence.',
            //         color: `${theme === 'light' ? '#64748B' : '#AEB7C0'}`,
            //         showConfirmButton: true,
            //         confirmButtonText: 'OK',
            //         confirmButtonColor: '#1a56db',
            //         backdrop: false,
            //         background: `${theme === 'light' ? '#FFF' : '#24303F'}`,
            //         showCloseButton: true,
            //         timer: 5000,
            //         timerProgressBar: true,
            //         didOpen: (toast) => {
            //             toast.onmouseenter = swal.stopTimer;
            //             toast.onmouseleave = swal.resumeTimer;
            //         },
            //     });
            // } else if (
            //     mainData?.properties['Status'].status?.name !== 'Proposta aceita' &&
            //     (!checks.are_docs_complete ||
            //         !checks.is_cedente_complete ||
            //         !checks.is_precatorio_complete)
            // ) {
            //     swal.fire({
            //         icon: 'info',
            //         // iconColor: "#00b809",
            //         title: 'Proposta aceita!',
            //         text: 'Porém ainda há pontos pendentes para a conclusão da diligência.',
            //         color: `${theme === 'light' ? '#64748B' : '#AEB7C0'}`,
            //         showConfirmButton: true,
            //         confirmButtonText: 'OK',
            //         confirmButtonColor: '#1a56db',
            //         backdrop: false,
            //         background: `${theme === 'light' ? '#FFF' : '#24303F'}`,
            //         showCloseButton: true,
            //         timer: 5000,
            //         timerProgressBar: true,
            //         didOpen: (toast) => {
            //             toast.onmouseenter = swal.stopTimer;
            //             toast.onmouseleave = swal.resumeTimer;
            //         },
            //     });
            // } else if (mainData?.properties['Status'].status?.name === 'Proposta aceita') {
            //     swal.fire({
            //         icon: 'warning',
            //         // iconColor: "#e63f66",
            //         title: 'Proposta cancelada!',
            //         text: 'Você pode registrar o motivo no campo de observação.',
            //         color: `${theme === 'light' ? '#64748B' : '#AEB7C0'}`,
            //         showConfirmButton: true,
            //         confirmButtonText: 'OK',
            //         confirmButtonColor: '#1a56db',
            //         backdrop: false,
            //         background: `${theme === 'light' ? '#FFF' : '#24303F'}`,
            //         showCloseButton: true,
            //         timer: 5000,
            //         timerProgressBar: true,
            //         didOpen: (toast) => {
            //             toast.onmouseenter = swal.stopTimer;
            //             toast.onmouseleave = swal.resumeTimer;
            //         },
            //     });
            // }
        },
        onSettled: async () => {
            setIsProposalChanging(false);
            await sleep(2);
        },
    });
    
    const deleteOficio = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch('api/notion-api/page/bulk-action/visibility/', {
                page_ids: [id],
                archived: true,
            });

            if (response.status !== 202) {
                throw new Error('Houve um erro ao excluir o ofício');
            }
            return response.data;
        },
        onMutate: async (id: string) => {
            setIsDeleting(true);
            setSpecificCardData(null);
            setIsFetchAllowed(false);
        },
        onError: (err, paramsObj, context) => {
            toast.error('Erro ao arquivar o ofício!', {
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
            toast.success('Ofício deletado!', {
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
            await fetchCardData(selectedUser ?? undefined);
        },
        onSettled: () => {
            setIsDeleting(false);
            setDeleteModalLock(false);
            setIsFetchAllowed(true);
        },
    });

    /**
     * Atualiza o campo de observação do oficio
     *
     * @param {string} message - mensagem do campo de observação
     * @returns {Promise<void>}
     */
    const handleUpdateObservation = async (message: string): Promise<void> => {
        await updateObservation.mutateAsync(message);
    };

    /**
     * Atualiza o status do oficio por meio do checkbox
     *
     * @returns {Promise<void>}
     */
    const handleUpdateStatus = async (): Promise<void> => {
        const status =
            mainData?.properties['Status'].status?.name === 'Proposta aceita'
                ? 'Negociação em Andamento'
                : 'Proposta aceita';
        
        if (status === 'Proposta aceita') {
            multiLoaderSteps.current = loadingSteps.accept
            setProposalReqType("accept");
        } else {
            multiLoaderSteps.current = loadingSteps.decline
            setProposalReqType("decline");
        }
        
        await proposalTrigger.mutateAsync(status);
    };

    /**
     * Define o ofício como liquidado
     * atualizando o status de diligência
     * e status do ofício
     *
     * @returns {Promise<void>}
     */
    const handleLiquidateCard = async (): Promise<void> => {
        setIsFetchAllowed(false);
        setIsUpdatingDiligence(true);

        try {
            const response = await api.patch(
                `api/notion-api/broker/liquidate-proposal/${mainData!.id}/`,
            );

            if (response.status === 202) {
                setIsFetchAllowed(true);
                await fetchCardData(selectedUser ?? undefined);
                swal.fire({
                    icon: 'success',
                    iconColor: '#00b809',
                    title: 'Agora é com a gente!',
                    text: 'O ativo foi enviado para o processo de liquidação.',
                    color: `${theme === 'light' ? '#64748B' : '#AEB7C0'}`,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1a56db',
                    backdrop: false,
                    background: `${theme === 'light' ? '#FFF' : '#24303F'}`,
                    showCloseButton: true,
                    timer: 5000,
                    timerProgressBar: true,
                });
                confetti({
                    spread: 180,
                    particleCount: 300,
                    origin: {
                        y: 0.5,
                    },
                });
            }
        } catch (error) {
            toast.error('Erro ao atualizar o status!', {
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
            setIsUpdatingDiligence(false);
        }
    };

    /**
     * Deleta o ofício selecionado da lista
     *
     * @param {string} id - O id do ofício que será deletado
     * @returns {Promise<void>}
     */
    const handleDeleteOficio = async (id: string): Promise<void> => {
        await deleteOficio.mutateAsync(id);
        setOpenConfirmModal(false);
    };

    /**
     * Atualiza o card com as informações atuais
     * (vindas do Notion)
     *
     * @returns {Promise<void>}
     */
    const handleRefreshCard = async (): Promise<void> => {
        setIsFetchingData(true);

        try {
            const responseStatus = await fetchDetailCardData(mainData!.id);
            if (responseStatus === 200) {
                toast.success('Dados do ofício atualizados!', {
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
            }
        } catch (error) {
            toast.error('Erro ao atualizar as informações do ofício!', {
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
            setIsFetchingData(false);
        }
    };

    /**
     * Define o estado de mainData como oficio quando a página
     * é renderizada ou é feito algum filtro
     */
    useEffect(() => {
        setMainData(oficio);
    }, [oficio]);

    /**
     * Define o estado de mainData como specificCardData
     * quando há alguma alteração no card
     */
    useEffect(() => {
        if (specificCardData !== null && specificCardData.id === mainData?.id) {
            setMainData(specificCardData);
        }
    }, [specificCardData]);

    /**
     * Faz o fetch em todos os checks do card quando
     * montado e/ou quando o card for atualizado
     */
    useEffect(() => {
        if (credorIdentificationType === null || !isFetchAllowed) return;

        async function refetchChecks() {
            await Promise.allSettled([fetchAllChecks()]);
            isFirstLoad.current = false; // Foi alterada a propriedade 'current', não a variável 'isFirstLoad'. Nesse caso não houve o reassign da variável 'isFirstLoad', mas sim a alteração da propriedade 'current' do objeto retornado por useRef. Desse modo, não usando o 'setIsFirstLoad(false)' um setter de estado, evita que o componente seja renderizado novamente sem uma real necessidade.
        }

        refetchChecks();
    }, [credorIdentificationType, mainData]);

    /**
     * Define so valores dos sliders de acordo com os valores
     * de proposta/comissão do oficio carregado
     */
    useEffect(() => {
        if (mainData) {
            setSliderValues({
                proposal:
                    mainData.properties['Proposta Escolhida - Celer'].number ||
                    mainData.properties['(R$) Proposta Mínima - Celer'].number ||
                    0,
                comission:
                    mainData.properties['Comissão - Celer'].number ||
                    mainData.properties['(R$) Comissão Máxima - Celer'].number ||
                    0,
            });

            setAuxValues({
                proposal:
                    mainData.properties['Proposta Escolhida - Celer'].number ||
                    mainData.properties['(R$) Proposta Mínima - Celer'].number ||
                    0,
                commission:
                    mainData.properties['Comissão - Celer'].number ||
                    mainData.properties['(R$) Comissão Mínima - Celer'].number ||
                    0,
            });

            if (proposalRef.current && comissionRef.current && observationRef.current) {
                proposalRef.current.value = numberFormat(
                    mainData.properties['Proposta Escolhida - Celer'].number ||
                    mainData.properties['(R$) Proposta Mínima - Celer'].number ||
                    0,
                );

                comissionRef.current.value = numberFormat(
                    mainData.properties['Comissão - Celer'].number ||
                    mainData.properties['(R$) Comissão Máxima - Celer'].number ||
                    0,
                );

                observationRef.current.value =
                    mainData?.properties?.['Observação']?.rich_text!.length > 0
                        ? mainData.properties['Observação'].rich_text![0].text.content
                        : '';
            }
        }
    }, [mainData]);
    /**
     * Define o tipo de indentificação do credor do ofício
     * que pode ser CPF ou CNPJ
     */
    useEffect(() => {
        if (oficio === null) return;

        // verifica o tipo de identificação do credor e formata para só obter números na string
        const credorIdent =
            oficio.properties['CPF/CNPJ'].rich_text?.[0]?.text?.content?.replace(/\D/g, '') || '';

        setCredorIdentificationType(
            credorIdent.length === 11 ? 'CPF' : credorIdent.length === 14 ? 'CNPJ' : null,
        );
    }, [oficio]);

    /**
     * @ignore - Essa função ainda não é usada
     *
     * Atualiza a cor do slider de acordo com a posição
     *
     * @param {number} proportion - valor da proporção
     * @returns {string} - valor retornado para aplicar cor a um elemento
     */
    const getColor = (proportion: number): string => {
        const red = Math.round(255 * (1 - proportion)); // De vermelho para verde
        const green = Math.round(255 * proportion); // De vermelho para verde
        return `rgb(${red}, ${green}, 0)`; // Cor de transição de vermelho para verde
    };

    /**
     * Gera PDF da Proposta
     */

    const handleGeneratePDF = useReactToPrint({
        contentRef: documentRef,
        documentTitle: 'Proposta',
        onBeforePrint: async () => setLoading(true),
        onAfterPrint: () => setLoading(false),
        preserveAfterPrint: true,
        copyShadowRoots: true,
        onPrintError: (errorLocation, error) => {
            console.error('Erro na geração do PDF:', errorLocation, error);
            setLoading(false);
        },
    });

    const validateStatusLocked =
        mainData?.properties['Status Diligência'].select?.name === 'Due Diligence'.valueOf() ||
        mainData?.properties['Status Diligência'].select?.name === 'Revisão Valor/LOA'.valueOf();

    const validateIfItsLockedWhenStatusDiligenceBeEqual =
        mainData?.properties['Status Diligência'].select?.name === 'Em liquidação' ||
        validateStatusLocked;

    const validateIfItsLockedWhenStatusDiligenceBeDifferent =
        mainData?.properties['Status Diligência'].select?.name !== 'Due Diligence' &&
        mainData?.properties['Status Diligência'].select?.name !== 'Em liquidação' &&
        mainData?.properties['Status Diligência'].select?.name !== 'Revisão Valor/LOA';

    /** teste */

    const handleMultiLoader = () => {
        setShowMultiLoader(true);
        setTimeout(() => {
            console.log("a")
            // setShowMultiLoader(false)
        }, 10000)
    }

    return (
        <>
            <div className="relative col-span-1 gap-5 rounded-md border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark">
                {/* ----> info <----- */}
                <div className="mb-2 flex items-center justify-between">
                    <div className={`flex w-fit items-center justify-center gap-2 opacity-50 pointer-events-none ${(checks.are_docs_complete || checks.is_cedente_complete || checks.is_precatorio_complete) && "!opacity-100 !pointer-events-auto"}`}>
                        {isProposalChanging ? (
                            <AiOutlineLoading className="animate-spin" />
                        ) : (
                            <CustomCheckbox
                                check={
                                    mainData?.properties['Status'].status?.name === 'Proposta aceita'
                                }
                                callbackFunction={handleUpdateStatus}
                            />
                        )}
                        <span className="text-sm font-medium">Proposta Aceita</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={deleteModalLock}
                            className="group flex h-[28px] w-[28px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-transparent bg-slate-100 px-0 py-0 opacity-100 transition-all duration-300 ease-in-out hover:w-[100px] hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-0 dark:bg-slate-700 dark:hover:bg-slate-700"
                            onClick={() => {
                                setOpenConfirmModal(true);
                                setDeleteModalLock(true);
                            }}
                        >
                            {isDeleting ? (
                                <AiOutlineLoading className="animate-spin" />
                            ) : (
                                <>
                                    <BiTrash className=" max-w-4 overflow-hidden opacity-100 transition-width duration-300 group-hover:max-w-0 group-hover:opacity-0" />

                                    <div className=" max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-opacity duration-500 ease-in-out group-hover:max-w-[76px] group-hover:opacity-100">
                                        Excluir Ativo
                                    </div>
                                </>
                            )}
                        </button>

                        <Button
                            title="Atualizar informações do ativo"
                            variant="ghost"
                            className="group flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 px-0 py-0 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                            onClick={handleRefreshCard}
                        >
                            <BiRefresh className={`${isFetchingData && 'animate-spin'}`} />
                        </Button>
                    </div>
                </div>
                <hr className="mb-4 border border-stroke dark:border-strokedark" />
                <div className="grid 2xsm:grid-cols-12 md:grid-cols-8 xl:grid-cols-12">
                    <div className="col-span-12 grid min-w-[248px] gap-3 md:col-span-8 md:min-w-fit xl:col-span-6">
                        <div className="text-xs">
                            <p className="font-medium uppercase text-black dark:text-snow">
                                Nome do Credor:
                            </p>
                            <CRMTooltip
                                text={
                                    mainData?.properties['Credor'].title[0]?.text.content ||
                                    'Não informado'
                                }
                                arrow={false}
                            >
                                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold uppercase md:max-w-[220px]">
                                    {mainData?.properties['Credor'].title[0]?.text.content ||
                                        'Não informado'}
                                </p>
                            </CRMTooltip>
                        </div>

                        <div className="text-xs">
                            <p className="font-medium uppercase text-black dark:text-snow">CPF/CNPJ:</p>
                            <p className="text-sm font-semibold uppercase">
                                {applyMaskCpfCnpj(
                                    mainData?.properties['CPF/CNPJ'].rich_text?.[0]?.text?.content ||
                                    '',
                                ) || 'Não informado'}
                            </p>
                        </div>

                        <div className="text-xs">
                            <p className="font-medium uppercase text-black dark:text-snow">TRIBUNAL</p>
                            <p className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold uppercase">
                                {mainData?.properties['Tribunal'].select?.name || 'Não informado'}
                            </p>
                        </div>

                        <div className="text-xs">
                            <p className="font-medium uppercase text-black dark:text-snow">status:</p>
                            <p className="text-sm font-semibold uppercase">
                                {mainData?.properties['Status'].status?.name || 'Não informado'}
                            </p>
                        </div>
                        <div className="text-xs">
                            <p className="font-medium uppercase text-black dark:text-snow">
                                status diligência:
                            </p>
                            <p className="text-sm font-semibold uppercase">
                                {mainData?.properties['Status Diligência'].select?.name ||
                                    'Não informado'}
                            </p>
                        </div>

                        <div className="flex min-w-fit flex-col">
                            <div className="relative w-full">
                                {mainData?.properties['Status Diligência'].select?.name !==
                                    'Due Diligence' &&
                                    mainData?.properties['Status Diligência'].select?.name !==
                                    'Em liquidação' &&
                                    mainData?.properties['Status Diligência'].select?.name !==
                                    'Revisão Valor/LOA' &&
                                    mainData?.properties['Status'].status?.name === 'Proposta aceita' &&
                                    checks.is_cedente_complete === true &&
                                    checks.is_precatorio_complete === true &&
                                    checks.are_docs_complete === true && (
                                        <span className="span-pulse absolute z-1 h-full w-full rounded-md bg-green-300"></span>
                                    )}

                                <button
                                    onClick={handleLiquidateCard}
                                    className={`${mainData?.properties['Status Diligência'].select?.name.valueOf() !== 'Due Diligence' && mainData?.properties['Status Diligência'].select?.name !== 'Em liquidação' && mainData?.properties['Status Diligência'].select?.name !== 'Revisão Valor/LOA' && mainData?.properties['Status'].status?.name === 'Proposta aceita' && checks.is_cedente_complete === true && checks.is_precatorio_complete === true && checks.are_docs_complete === true ? 'bg-green-400 text-black-2 hover:bg-green-500 hover:text-snow' : 'pointer-events-none cursor-not-allowed bg-slate-100 opacity-50 dark:bg-boxdark-2/50'} relative z-2 my-1 flex w-full items-center justify-center gap-2 rounded-md px-4 py-1 text-sm transition-colors duration-200`}
                                >
                                    {isUpdatingDiligence ? (
                                        <>
                                            <AiOutlineLoading className="h-4 w-4 animate-spin" />
                                            {validateIfItsLockedWhenStatusDiligenceBeDifferent &&
                                                mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita'
                                                ? 'Liquidando...'
                                                : 'Repactuando...'}
                                        </>
                                    ) : (
                                        <>
                                            {validateStatusLocked &&
                                                mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' ? (
                                                <>
                                                    <HiCheck className="h-4 w-4" />
                                                    Liquidado
                                                </>
                                            ) : (
                                                <>
                                                    {mainData?.properties['Status Diligência'].select
                                                        ?.name === 'Repactuação' ? (
                                                        <>
                                                            <HiCheck className="h-4 w-4" />
                                                            Repactuar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HiCheck className="h-4 w-4" />
                                                            Liquidar
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={() => setEditModalId(mainData!.id)}
                                disabled={
                                    checks.isFetching ||
                                    (mainData?.properties['Status'].status?.name ===
                                        'Proposta aceita' &&
                                        validateIfItsLockedWhenStatusDiligenceBeEqual) ||
                                    mainData?.properties['Status Diligência'].select?.name ===
                                    'Em liquidação' ||
                                    (mainData?.properties['Status'].status?.name ===
                                        'Proposta aceita' &&
                                        mainData?.properties['Status Diligência'].select?.name ===
                                        'Juntar Documentos')
                                }
                                className="my-1 flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-1 text-sm transition-colors duration-300 hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70"
                            >
                                <BsPencilSquare />
                                Editar Precatório
                            </button>

                            <button
                                onClick={() => setDocModalInfo(mainData)}
                                className={`${checks.is_cedente_complete !== false ? 'opacity-100' : 'pointer-events-none cursor-not-allowed opacity-50'} my-1 flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-1 text-sm transition-colors duration-300 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70`}
                            >
                                <FaRegFilePdf />
                                Juntar Documentos
                            </button>

                            <button
                                onClick={() => setCedenteModal(mainData)}
                                disabled={
                                    (mainData &&
                                        mainData?.properties['CPF/CNPJ']?.rich_text?.length === 0) ||
                                    undefined
                                }
                                className="my-1 flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-1 text-sm transition-colors duration-300 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70"
                            >
                                {mainData?.properties['Cedente PF'].relation?.[0] ||
                                    mainData?.properties['Cedente PJ'].relation?.[0] ? (
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

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                {checks.isFetching && isFirstLoad.current ? (
                                    <AiOutlineLoading className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        {checks.is_precatorio_complete ? (
                                            <CRMTooltip text="Precatório completo">
                                                <BsCheckCircleFill className="text-green-400" />
                                            </CRMTooltip>
                                        ) : (
                                            <CRMTooltip text="Precatório incompleto">
                                                <IoCloseCircle className="h-5 w-5 text-red" />
                                            </CRMTooltip>
                                        )}
                                    </>
                                )}

                                {checks.isFetching && isFirstLoad.current ? (
                                    <AiOutlineLoading className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        {checks.is_cedente_complete === true && (
                                            <CRMTooltip text="Cedente preenchido">
                                                <BsCheckCircleFill className="text-green-400" />
                                            </CRMTooltip>
                                        )}
                                        {checks.is_cedente_complete === null && (
                                            <CRMTooltip text="Cedente incompleto">
                                                <RiErrorWarningFill className="h-5 w-5 text-amber-300" />
                                            </CRMTooltip>
                                        )}
                                        {checks.is_cedente_complete === false && (
                                            <CRMTooltip text="Cedente não vinculado">
                                                <IoCloseCircle className="h-5 w-5 text-red" />
                                            </CRMTooltip>
                                        )}
                                    </>
                                )}

                                {checks.isFetching && isFirstLoad.current ? (
                                    <AiOutlineLoading className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        {checks.are_docs_complete === true && (
                                            <CRMTooltip text="Documentos preenchidos">
                                                <BsCheckCircleFill className="text-green-400" />
                                            </CRMTooltip>
                                        )}
                                        {checks.are_docs_complete === null && (
                                            <CRMTooltip text="Documentos em análise">
                                                <RiErrorWarningFill className="h-5 w-5 text-amber-300" />
                                            </CRMTooltip>
                                        )}
                                        {checks.are_docs_complete === false && (
                                            <CRMTooltip text="Documentos não vinculados">
                                                <IoCloseCircle className="h-5 w-5 text-red" />
                                            </CRMTooltip>
                                        )}
                                    </>
                                )}
                                {/* TODO: Esse aqui será o check para verificação do anuente quando a implementação for desenvolvida */}
                                {/* <MdOutlineCircle className='w-4 h-4' /> */}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge isANotionPage color={mainData?.properties['Tipo'].select?.color}>
                                    <Badge.Label
                                        label={
                                            mainData?.properties['Tipo'].select?.name ?? 'Não informado'
                                        }
                                    />
                                </Badge>
                                <Badge
                                    isANotionPage
                                    color={mainData?.properties['Esfera'].select?.color}
                                >
                                    <Badge.Label
                                        label={
                                            mainData?.properties['Esfera'].select?.name ??
                                            'Não informado'
                                        }
                                    />
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <ConfirmModal
                        size="lg"
                        isOpen={confirmModal}
                        onClose={() => {
                            setOpenConfirmModal(false);
                            setDeleteModalLock(false);
                        }}
                        onConfirm={() => handleDeleteOficio(mainData!.id)}
                        isLoading={isDeleting}
                    />

                    <div className="col-span-12 mx-2 mt-5 grid gap-5 border-l-0 border-t-2 border-stroke pl-0 pt-5 dark:border-strokedark md:col-span-8 md:mt-0 md:border-l-2 md:border-t-0 md:pl-3 md:pt-5 xl:col-span-6">
                        <div className="relative flex max-h-fit flex-col gap-5 pb-8 sm:pb-0">
                            <div className="flex items-center justify-between gap-6 2xsm:flex-col md:flex-row">
                                <div className="flex w-full flex-1 flex-col items-center gap-4 pb-2 2xsm:pb-0 md:pb-2">
                                    <div className="flex items-center text-sm font-medium">
                                        <p className="w-full text-sm">Proposta:</p>
                                        <input
                                            ref={proposalRef}
                                            type="text"
                                            disabled={
                                                (mainData?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    validateIfItsLockedWhenStatusDiligenceBeEqual) ||
                                                (mainData?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    mainData?.properties['Status Diligência'].select
                                                        ?.name === 'Juntar Documentos') ||
                                                (mainData?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    mainData?.properties['Status Diligência'].select
                                                        ?.name === 'Pendência a Sanar')
                                            }
                                            onBlur={(e) => {
                                                e.target.value = formatCurrency(e.target.value);
                                            }}
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
                                            (mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' &&
                                                validateIfItsLockedWhenStatusDiligenceBeEqual) ||
                                            (mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' &&
                                                mainData?.properties['Status Diligência'].select
                                                    ?.name === 'Juntar Documentos') ||
                                            (mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' &&
                                                mainData?.properties['Status Diligência'].select
                                                    ?.name === 'Pendência a Sanar')
                                        }
                                        min={
                                            mainData?.properties['(R$) Proposta Mínima - Celer']
                                                .number || 0
                                        }
                                        max={
                                            mainData?.properties['(R$) Proposta Máxima - Celer']
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

                            <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                                <div className="flex w-full flex-1 flex-col items-center gap-4">
                                    <div className="flex items-center text-sm font-medium ">
                                        <p className="text-sm">Comissão:</p>
                                        <input
                                            ref={comissionRef}
                                            type="text"
                                            disabled={
                                                (mainData?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    validateIfItsLockedWhenStatusDiligenceBeEqual) ||
                                                (mainData?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    mainData?.properties['Status Diligência'].select
                                                        ?.name === 'Juntar Documentos') ||
                                                (mainData?.properties['Status'].status?.name ===
                                                    'Proposta aceita' &&
                                                    mainData?.properties['Status Diligência'].select
                                                        ?.name === 'Pendência a Sanar')
                                            }
                                            onBlur={(e) => {
                                                e.target.value = formatCurrency(e.target.value);
                                            }}
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
                                            (mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' &&
                                                validateIfItsLockedWhenStatusDiligenceBeEqual) ||
                                            (mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' &&
                                                mainData?.properties['Status Diligência'].select
                                                    ?.name === 'Juntar Documentos') ||
                                            (mainData?.properties['Status'].status?.name ===
                                                'Proposta aceita' &&
                                                mainData?.properties['Status Diligência'].select
                                                    ?.name === 'Pendência a Sanar')
                                        }
                                        min={
                                            mainData?.properties['(R$) Comissão Mínima - Celer']
                                                .number || 0
                                        }
                                        max={
                                            mainData?.properties['(R$) Comissão Máxima - Celer']
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

                            {errorMessage && (
                                <div className="absolute -bottom-4 w-full text-center text-xs text-red">
                                    Valor&#40;res&#41; fora do escopo definido
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                disabled={isProposalButtonDisabled}
                                onClick={saveProposalAndComission}
                                className="h-8 w-full px-2 py-1 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingProposalAndComission ? 'Salvando...' : 'Salvar Oferta'}
                            </Button>
                            <Button
                                isLoading={loading}
                                onClick={() => handleGeneratePDF()}
                                className="h-8 w-full px-2 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Gerar Proposta
                            </Button>
                        </div>
                        {/* Esse componente tem a função apenas de gerar um PDF, por isso hidden */}
                        <div className="hidden">
                            <div ref={documentRef} className="bg-[#F4F4F4]">
                                <PrintPDF
                                    nomeDoCredor={mainData?.properties['Credor'].title[0]?.text.content}
                                    valorDaProposta={
                                        mainData?.properties['Proposta Escolhida - Celer'].number ||
                                        mainData?.properties['(R$) Proposta Mínima - Celer'].number ||
                                        0
                                    }
                                    nomeDoBroker={first_name + ' ' + last_name}
                                    fotoDoBroker={profile_picture}
                                    phone={phone ? phone : null}
                                />
                            </div>
                        </div>

                        {/* separator */}

                        {/* end separator */}

                        {/* ----> observations field <----- */}
                        <div className="h-full w-full">
                            <p className="mb-2">Observações:</p>
                            <div className="relative">
                                <textarea
                                    ref={observationRef}
                                    className="w-full resize-none rounded-md border-stroke placeholder:text-sm dark:border-strokedark dark:bg-boxdark-2/50"
                                    rows={4}
                                    placeholder="Insira uma observação"
                                />
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        handleUpdateObservation(observationRef.current?.value || '')
                                    }
                                    className="absolute bottom-3 right-2 z-2 bg-slate-100 px-1 py-1 text-sm hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70"
                                >
                                    {savingObservation ? (
                                        <AiOutlineLoading className="animate-spin text-lg" />
                                    ) : (
                                        <BiSave className="text-lg" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        {/* ----> end observations field <----- */}
                    </div>
                </div>
                {/* ----> end info <----- */}

                {/* ----> edit info modal <---- */}
                <EditOficioBrokerForm mainData={mainData} />
                {/* ----> end edit info modal <----- */}
            </div>
            {showMultiLoader && (
                <MultiStepLoader
                    loadingStates={multiLoaderSteps.current}
                    duration={1200}
                    reqStatus={proposalReqStatus}
                    reqType={proposalReqType}
                    handleClose={handleCloseLoader}
                    hasEffect={
                        mainData?.properties['Status'].status?.name !== 'Proposta aceita' &&
                        checks.are_docs_complete &&
                        checks.is_cedente_complete &&
                        checks.is_precatorio_complete
                    }
                />
            )}
        </>
    );
};

export default DashbrokersCard;
