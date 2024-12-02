"use client"
import numberFormat from '@/functions/formaters/numberFormat'
import React, { useContext, useEffect, useRef, useState } from 'react'
import CustomCheckbox from '../CrmUi/Checkbox';
import { BiCheck, BiSave, BiTrash, BiX } from 'react-icons/bi';
import { BsCheckCircleFill, BsPencilSquare } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa';
import { Button } from '../Button';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import { toast } from 'sonner';
import { formatCurrency } from '@/functions/formaters/formatCurrency';
import { AiOutlineLoading, } from 'react-icons/ai';
import { useMutation } from '@tanstack/react-query';
import { IoCloseCircle } from 'react-icons/io5';
import CRMTooltip from '../CrmUi/Tooltip';
import { GrDocumentUser } from 'react-icons/gr';
import { BrokersContext } from '@/context/BrokersContext';
import { RiErrorWarningFill } from 'react-icons/ri';
import { applyMaskCpfCnpj } from '@/functions/formaters/maskCpfCnpj';
import { IdentificationType } from '../Modals/BrokersCedente';
import { Fade } from 'react-awesome-reveal';
import ConfirmModal from '../CrmUi/ConfirmModal';
import Badge from '../CrmUi/ui/Badge/Badge';
import EditOficioBrokerForm from '../Forms/EditOficioBrokerForm';
import { HiCheck } from 'react-icons/hi';
import confetti from 'canvas-confetti'
import UseMySwal from '@/hooks/useMySwal';
import { GeneralUIContext } from '@/context/GeneralUIContext';
import { TbReportMoney } from 'react-icons/tb';

export type ChecksProps = {
    is_precatorio_complete: boolean | null;
    is_cedente_complete: boolean | null;
    are_docs_complete: boolean | null;
    isFetching: boolean;
}

const DashbrokersCard = ({ oficio, setEditModalId }:
    {
        oficio: NotionPage,
        setEditModalId: React.Dispatch<React.SetStateAction<string | null>>
    }
) => {

    /* ====> context imports <==== */
    const { fetchCardData, setCedenteModal, deleteModalLock,
        isFetchAllowed, setIsFetchAllowed, setDeleteModalLock,
        setDocModalInfo, fetchDetailCardData, specificCardData,
        setSpecificCardData, selectedUser
    } = useContext(BrokersContext);

    /* ====> value states <==== */
    const [auxValues, setAuxValues] = useState<{ proposal: number, commission: number }>({
        proposal: 0,
        commission: 0
    });
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdatingDiligence, setIsUpdatingDiligence] = useState<boolean>(false);
    const [savingObservation, setSavingObservation] = useState<boolean>(false);
    const [isProposalButtonDisabled, setIsProposalButtonDisabled] = useState<boolean>(true);
    const [isProposalChanging, setIsProposalChanging] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const [credorIdentificationType, setCredorIdentificationType] = useState<IdentificationType>(null);
    const [confirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [checks, setChecks] = useState<ChecksProps>({
        is_precatorio_complete: false,
        is_cedente_complete: false,
        are_docs_complete: false,
        isFetching: false
    });

    const { theme } = useContext(GeneralUIContext);
    const swal = UseMySwal();

    /* ====> refs <==== */
    const proposalRef = useRef<HTMLInputElement | null>(null);
    const comissionRef = useRef<HTMLInputElement | null>(null);
    const observationRef = useRef<HTMLTextAreaElement | null>(null);
    const proposalRangeRef = useRef<HTMLInputElement | null>(null);
    const isFirstLoad = useRef(true); // referência: 'isFirstLoad' sempre apontará para o mesmo objeto retornado por useRef

    //* ====> Principal Data <==== */
    const [mainData, setMainData] = useState<NotionPage | null>(null);

    // Função responsável por fazer fetch em todos os estados dos checks
    const fetchAllChecks = async () => {

        setChecks((old) => (
            {
                ...old,
                isFetching: true
            }
        ));

        const cedenteType = credorIdentificationType === "CPF" ? "Cedente PF" : "Cedente PJ";

        const idCedente = mainData?.properties[cedenteType].relation?.[0] ?
            mainData.properties[cedenteType].relation?.[0].id :
            null;

        try {

            const req = credorIdentificationType === "CPF" ?
                await api.get(`/api/checker/pf/complete/precatorio/${mainData?.id}/cedente/${idCedente}/`) :
                await api.get(`/api/checker/pj/complete/precatorio/${mainData?.id}/cedente/${idCedente}/`);

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

        switch (inputField) {
            case "proposal":

                if (
                    numericalValue >= (oficio.properties["(R$) Proposta Mínima - Celer"].number || 0) &&
                    numericalValue <= (oficio.properties["(R$) Proposta Máxima - Celer"].number || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.proposal
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

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
                    numericalValue >= (oficio.properties["(R$) Comissão Mínima - Celer"].number || 0) &&
                    numericalValue <= (oficio.properties["(R$) Comissão Máxima - Celer"].number || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.commission
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

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
        setIsFetchAllowed(false);
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
            setAuxValues({
                proposal: sliderValues.proposal,
                commission: sliderValues.comission
            })
            setIsProposalButtonDisabled(true);
            fetchDetailCardData(mainData!.id);
        }

        if (req.status === 400) {
            toast.error('Erro ao salvar proposta e comissão!', {
                icon: <BiX className="text-lg fill-red-500" />
            });
        }
        setIsFetchAllowed(true);
        setSavingProposalAndComission(false);
    };

    const updateObservation = useMutation({
        mutationFn: async (message: string) => {
            const req = await api.patch(`api/notion-api/update/${mainData?.id}/`, {
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
                await api.patch(`api/notion-api/broker/accept-proposal/${mainData?.id}/`) :
                await api.patch(`api/notion-api/broker/decline-proposal/${mainData?.id}/`);
            return req.status
        },
        onMutate: async () => {
            setIsFetchAllowed(false);
            setIsProposalChanging(true);
        },
        onError: async () => {
            setIsFetchAllowed(true);
            toast.error('Erro ao modificar proposta! Contate a Ativos para verificar o motivo.', {
                icon: <BiX className="text-lg fill-red-500" />
            });
        },
        onSuccess: async () => {
            setIsFetchAllowed(true);
            await fetchDetailCardData(mainData!.id);
            if (
                mainData?.properties["Status"].status?.name !== "Proposta aceita" &&
                checks.are_docs_complete && checks.is_cedente_complete && checks.is_precatorio_complete
            ) {
                confetti({
                    spread: 180,
                    particleCount: 300,
                    origin: {
                        y: 0.5
                    }
                });
                swal.fire({
                    icon: "success",
                    iconColor: "#00b809",
                    title: "Proposta aceita!",
                    text: "Verifique o status da diligência para mais informações.",
                    color: `${theme === "light" ? "#64748B" : "#AEB7C0"}`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1a56db",
                    backdrop: false,
                    background: `${theme === "light" ? "#FFF" : "#24303F"}`,
                    showCloseButton: true,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = swal.stopTimer;
                        toast.onmouseleave = swal.resumeTimer;
                    }
                })
            } else if (mainData?.properties["Status"].status?.name !== "Proposta aceita" &&
                (!checks.are_docs_complete || !checks.is_cedente_complete || !checks.is_precatorio_complete)
            ) {
                swal.fire({
                    icon: "info",
                    // iconColor: "#00b809",
                    title: "Proposta aceita!",
                    text: "Porém ainda há pontos pendentes para a conclusão da diligência.",
                    color: `${theme === "light" ? "#64748B" : "#AEB7C0"}`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1a56db",
                    backdrop: false,
                    background: `${theme === "light" ? "#FFF" : "#24303F"}`,
                    showCloseButton: true,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = swal.stopTimer;
                        toast.onmouseleave = swal.resumeTimer;
                    }
                })
            } else if (mainData?.properties["Status"].status?.name === "Proposta aceita") {
                swal.fire({
                    icon: "warning",
                    // iconColor: "#e63f66",
                    title: "Proposta cancelada!",
                    text: "Você pode registrar o motivo no campo de observação.",
                    color: `${theme === "light" ? "#64748B" : "#AEB7C0"}`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1a56db",
                    backdrop: false,
                    background: `${theme === "light" ? "#FFF" : "#24303F"}`,
                    showCloseButton: true,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = swal.stopTimer;
                        toast.onmouseleave = swal.resumeTimer;
                    }
                })
            }
        },
        onSettled: () => {
            setIsProposalChanging(false);
        }
    });

    const deleteOficio = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(
                "api/notion-api/page/bulk-action/visibility/",
                {
                    page_ids: [id],
                    archived: true,
                },
            );

            if (response.status !== 202) {
                throw new Error("Houve um erro ao excluir o ofício");
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
            toast.success("Ofício deletado!", {
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
            await fetchCardData(selectedUser ?? undefined)
        },
        onSettled: () => {
            setIsDeleting(false);
            setDeleteModalLock(false);
            setIsFetchAllowed(true);
        }
    });

    const handleUpdateObservation = async (message: string) => {
        await updateObservation.mutateAsync(message)
    };

    const handleUpdateStatus = async () => {
        const status = mainData?.properties["Status"].status?.name === "Proposta aceita" ? "Negociação em Andamento" : "Proposta aceita";
        await proposalTrigger.mutateAsync(status);
    }

    const handleLiquidateCard = async () => {

        setIsFetchAllowed(false);
        setIsUpdatingDiligence(true);

        try {
            const response = await api.patch(
                `api/notion-api/update/${mainData!.id}/`,
                {
                    "Status Diligência": {
                        select: {
                            name: "Due Diligence",
                        },
                    },
                },
            );

            if (response.status === 202) {
                setIsFetchAllowed(true);
                await fetchCardData(selectedUser ?? undefined)
                swal.fire({
                    icon: "success",
                    iconColor: "#00b809",
                    title: "Agora é com a gente!",
                    text: "O ativo foi enviado para o processo de liquidação.",
                    color: `${theme === "light" ? "#64748B" : "#AEB7C0"}`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1a56db",
                    backdrop: false,
                    background: `${theme === "light" ? "#FFF" : "#24303F"}`,
                    showCloseButton: true,
                    timer: 5000,
                    timerProgressBar: true
                })
                confetti({
                    spread: 180,
                    particleCount: 300,
                    origin: {
                        y: 0.5
                    }
                });

            }

        } catch (error) {

            toast.error('Erro ao atualizar o status!', {
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
            setIsUpdatingDiligence(false);
        }
    }

    const handleDeleteOficio = async (id: string) => {
        await deleteOficio.mutateAsync(id);
        setOpenConfirmModal(false);
    }

    useEffect(() => {

        if (specificCardData !== null && specificCardData.id === mainData!.id) {
            setMainData(specificCardData);
        } else {
            setMainData(oficio);
        }

    }, [oficio, specificCardData])

    useEffect(() => {
        if (credorIdentificationType === null || !isFetchAllowed) return;

        async function refetchChecks() {
            await Promise.allSettled([
                fetchAllChecks()
            ])
            isFirstLoad.current = false; // Foi alterada a propriedade 'current', não a variável 'isFirstLoad'. Nesse caso não houve o reassign da variável 'isFirstLoad', mas sim a alteração da propriedade 'current' do objeto retornado por useRef. Desse modo, não usando o 'setIsFirstLoad(false)' um setter de estado, evita que o componente seja renderizado novamente sem uma real necessidade.
        }

        refetchChecks();

    }, [credorIdentificationType, mainData]);

    useEffect(() => {

        if (mainData) {
            setSliderValues({
                proposal: mainData.properties["Proposta Escolhida - Celer"].number || mainData.properties["(R$) Proposta Mínima - Celer"].number || 0,
                comission: mainData.properties["Comissão - Celer"].number || mainData.properties["(R$) Comissão Máxima - Celer"].number || 0
            });

            setAuxValues({
                proposal: mainData.properties["Proposta Escolhida - Celer"].number || mainData.properties["(R$) Proposta Mínima - Celer"].number || 0,
                commission: mainData.properties["Comissão - Celer"].number || mainData.properties["(R$) Comissão Mínima - Celer"].number || 0
            });

            if (proposalRef.current && comissionRef.current && observationRef.current) {

                proposalRef.current.value = numberFormat(mainData.properties["Proposta Escolhida - Celer"].number || mainData.properties["(R$) Proposta Mínima - Celer"].number || 0)

                comissionRef.current.value = numberFormat(mainData.properties["Comissão - Celer"].number || mainData.properties["(R$) Comissão Máxima - Celer"].number || 0);

                observationRef.current.value = mainData?.properties?.["Observação"]?.rich_text!.length > 0 ? mainData.properties["Observação"].rich_text![0].text.content : "";

            }
        }

    }, [mainData]);

    useEffect(() => {
        if (oficio === null) return;

        // verifica o tipo de identificação do credor e formata para só obter números na string
        const credorIdent = oficio.properties["CPF/CNPJ"].rich_text![0].text.content.replace(/\D/g, '');

        setCredorIdentificationType(credorIdent.length === 11 ? "CPF" : credorIdent.length === 14 ? "CNPJ" : null);
    }, [oficio]);

    const getColor = (proportion: number) => {
        const red = Math.round(255 * (1 - proportion)); // De vermelho para verde
        const green = Math.round(255 * proportion); // De vermelho para verde
        return `rgb(${red}, ${green}, 0)`; // Cor de transição de vermelho para verde
    };

    return (
        <div className="relative col-span-1 gap-5 bg-white dark:bg-boxdark p-5 rounded-md border border-stroke dark:border-strokedark">
            {/* ----> info <----- */}
            <div className='flex justify-between items-center mb-2'>
                <div className='flex gap-2 items-center justify-center w-fit' >
                    {isProposalChanging ? (
                        <AiOutlineLoading className='animate-spin' />
                    ) : (
                        <CustomCheckbox
                            check={mainData?.properties["Status"].status?.name === "Proposta aceita"}
                            callbackFunction={handleUpdateStatus}
                        />
                    )}
                    <span className='text-sm font-medium'>Proposta Aceita</span>
                </div>

                <Button
                    variant="ghost"
                    disabled={deleteModalLock}
                    className="group flex items-center opacity-100 disabled:opacity-0 disabled:pointer-events-none justify-center overflow-hidden rounded-full px-0 py-0 w-[28px] h-[28px] hover:w-[100px] bg-slate-500 dark:bg-slate-700 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer ease-in-out"
                    onClick={() => {
                        setOpenConfirmModal(true);
                        setDeleteModalLock(true);
                    }}
                >
                    {isDeleting ? (
                        <AiOutlineLoading className='animate-spin' />
                    ) : (
                        <>
                            <Fade className="group-hover:hidden">
                                <BiTrash className='text-white' />
                            </Fade>
                            <Fade className="hidden group-hover:block whitespace-nowrap text-sm">
                                <div className='text-white'>
                                    Excluir Ativo
                                </div>
                            </Fade>
                        </>
                    )}
                </Button>
            </div>
            <hr className='border border-stroke dark:border-strokedark mb-4' />
            <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-6 grid gap-3 min-w-[248px] md:min-w-fit">
                    <div className='text-xs'>
                        <p className='text-black dark:text-snow uppercase font-medium'>Nome do Credor:</p>
                        <CRMTooltip
                            text={mainData?.properties["Credor"].title[0]?.text.content || "Não informado"}
                            arrow={false}
                        >
                            <p className='md:max-w-[220px] text-ellipsis overflow-hidden whitespace-nowrap uppercase text-sm font-semibold'>
                                {mainData?.properties["Credor"].title[0]?.text.content || "Não informado"}
                            </p>
                        </CRMTooltip>
                    </div>

                    <div className='text-xs'>
                        <p className='text-black dark:text-snow uppercase font-medium'>CPF/CNPJ:</p>
                        <p className='uppercase text-sm font-semibold'>{applyMaskCpfCnpj(mainData?.properties["CPF/CNPJ"].rich_text![0].text.content || "") || "Não informado"}</p>
                    </div>

                    <div className='text-xs'>
                        <p className='text-black dark:text-snow uppercase font-medium'>TRIBUNAL</p>
                        <p className='max-w-[220px] text-ellipsis overflow-hidden whitespace-nowrap uppercase text-sm font-semibold'>
                            {mainData?.properties["Tribunal"].select?.name || "Não informado"}
                        </p>
                    </div>

                    <div className='text-xs'>
                        <p className='text-black dark:text-snow uppercase font-medium'>status:</p>
                        <p className='uppercase text-sm font-semibold'>{mainData?.properties["Status"].status?.name || "Não informado"}</p>
                    </div>
                    <div className='text-xs'>
                        <p className='text-black dark:text-snow uppercase font-medium'>status diligência:</p>
                        <p className='uppercase text-sm font-semibold'>{mainData?.properties["Status Diligência"].select?.name || "Não informado"}</p>
                    </div>

                    <div className='flex flex-col min-w-fit'>

                        <div className='relative w-full'>

                            {(mainData?.properties["Status Diligência"].select?.name !== "Due Diligence" && mainData?.properties["Status"].status?.name === "Proposta aceita" && checks.is_cedente_complete === true && checks.is_precatorio_complete === true && checks.are_docs_complete === true) && (
                                <span className='absolute z-1 w-full h-full rounded-md bg-green-300 span-pulse'></span>
                            )}

                            <button
                                onClick={handleLiquidateCard}
                                className={`${(mainData?.properties["Status Diligência"].select?.name !== "Due Diligence" && mainData?.properties["Status"].status?.name === "Proposta aceita" && checks.is_cedente_complete === true && checks.is_precatorio_complete === true && checks.are_docs_complete === true) ? "bg-green-400 text-black-2 hover:bg-green-500 hover:text-snow" : "opacity-50 bg-slate-100 dark:bg-boxdark-2/50 cursor-not-allowed pointer-events-none"} relative z-20 flex w-full items-center justify-center gap-2 my-1 py-1 px-4 rounded-md transition-colors duration-200 text-sm`}
                            >

                                {isUpdatingDiligence ? (
                                    <>
                                        <AiOutlineLoading className='w-4 h-4 animate-spin' />
                                        Liquidando...
                                    </>
                                ) : <>
                                    {(mainData?.properties["Status Diligência"].select?.name === "Due Diligence" && mainData?.properties["Status"].status?.name === "Proposta aceita") ? (
                                        <>
                                            <HiCheck className='w-4 h-4' />
                                            Liquidado
                                        </>
                                    ) : (
                                        <>
                                            <TbReportMoney className='w-4 h-4' />
                                            Liquidar
                                        </>
                                    )}
                                </>}
                            </button>

                        </div>

                        <button
                            onClick={() => setEditModalId(mainData!.id)}
                            className='flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm'>
                            <BsPencilSquare />
                            Editar Precatório
                        </button>

                        <button
                            onClick={() => setDocModalInfo(mainData)}
                            className={`${checks.is_cedente_complete !== false ? "opacity-100" : "opacity-50 cursor-not-allowed pointer-events-none"} flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm`}>
                            <FaRegFilePdf />
                            Juntar Documentos
                        </button>

                        <button
                            onClick={() => setCedenteModal(mainData)}
                            className='flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm'>
                            {(mainData?.properties["Cedente PF"].relation?.[0] || mainData?.properties["Cedente PJ"].relation?.[0]) ? (
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


                    <div className="flex items-center gap-2 justify-between">
                        <div className='flex items-center gap-2'>

                            {(checks.isFetching && isFirstLoad.current) ? (
                                <AiOutlineLoading className='w-4 h-4 animate-spin' />
                            ) : (
                                <>
                                    {(checks.is_precatorio_complete) ? (
                                        <CRMTooltip text="Precatório completo">
                                            <BsCheckCircleFill className='text-green-400' />
                                        </CRMTooltip>
                                    ) : (
                                        <CRMTooltip text="Precatório incompleto">
                                            <IoCloseCircle className="text-red w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                </>
                            )}

                            {(checks.isFetching && isFirstLoad.current) ? (
                                <AiOutlineLoading className='w-4 h-4 animate-spin' />
                            ) : (
                                <>
                                    {(checks.is_cedente_complete === true) && (
                                        <CRMTooltip text="Cedente preenchido">
                                            <BsCheckCircleFill className='text-green-400' />
                                        </CRMTooltip>
                                    )}
                                    {(checks.is_cedente_complete === null) && (
                                        <CRMTooltip text="Cedente incompleto">
                                            <RiErrorWarningFill className="text-amber-300 w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                    {(checks.is_cedente_complete === false) && (
                                        <CRMTooltip text="Cedente não vinculado">
                                            <IoCloseCircle className="text-red w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                </>
                            )}

                            {(checks.isFetching && isFirstLoad.current) ? (
                                <AiOutlineLoading className='w-4 h-4 animate-spin' />
                            ) : (
                                <>
                                    {(checks.are_docs_complete === true) && (
                                        <CRMTooltip text="Documentos preenchidos">
                                            <BsCheckCircleFill className='text-green-400' />
                                        </CRMTooltip>
                                    )}
                                    {(checks.are_docs_complete === null) && (
                                        <CRMTooltip text="Documentos em análise">
                                            <RiErrorWarningFill className="text-amber-300 w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                    {(checks.are_docs_complete === false) && (
                                        <CRMTooltip text="Documentos não vinculados">
                                            <IoCloseCircle className="text-red w-5 h-5" />
                                        </CRMTooltip>
                                    )}
                                </>
                            )}
                            {/* TODO: Esse aqui será o check para verificação do anuente quando a implementação for desenvolvida */}
                            {/* <MdOutlineCircle className='w-4 h-4' /> */}
                        </div>
                        <div className='flex items-center gap-2'>
                            <Badge isANotionPage color={mainData?.properties["Tipo"].select?.color}>
                                <Badge.Label label={mainData?.properties["Tipo"].select?.name ?? 'Não informado'} />
                            </Badge>
                            <Badge isANotionPage color={mainData?.properties["Esfera"].select?.color}>
                                <Badge.Label label={mainData?.properties["Esfera"].select?.name ?? 'Não informado'} />
                            </Badge>
                        </div>
                    </div>
                </div>

                <ConfirmModal
                    size='lg'
                    isOpen={confirmModal}
                    onClose={() => { setOpenConfirmModal(false); setDeleteModalLock(false) }}
                    onConfirm={() => handleDeleteOficio(mainData!.id)}
                    isLoading={isDeleting}
                />

                <div className="mx-2 col-span-12 md:col-span-6 grid gap-5 border-t-2 md:border-t-0 pt-5 md:pt-0 mt-5 md:mt-0 border-l-0 md:border-l-2 border-stroke dark:border-strokedark pl-0 md:pl-3">
                    <div className='relative flex flex-col gap-5 max-h-fit pb-8 sm:pb-0'>

                        <div className="flex items-center justify-between gap-6 2xsm:flex-col md:flex-row">
                            <div className="flex flex-1 flex-col items-center gap-4 pb-2 2xsm:pb-0 md:pb-2 w-full">
                                <div className="text-sm font-medium flex items-center">
                                    <p className="w-full text-sm">Proposta:</p>
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
                                    // ref={proposalRangeRef}
                                    type="range"
                                    step="0.01"
                                    min={mainData?.properties["(R$) Proposta Mínima - Celer"].number || 0}
                                    max={mainData?.properties["(R$) Proposta Máxima - Celer"].number || 0}
                                    value={sliderValues.proposal}
                                    onChange={e => handleProposalSliderChange(e.target.value, true)}
                                    className="w-full range-slider"
                                />

                            </div>
                        </div>

                        <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                            <div className="flex flex-1 flex-col items-center gap-4 w-full">
                                <div className="text-sm font-medium flex items-center ">
                                    <p className="text-sm">Comissão:</p>
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
                                    min={mainData?.properties["(R$) Comissão Mínima - Celer"].number || 0}
                                    max={mainData?.properties["(R$) Comissão Máxima - Celer"].number || 0}
                                    value={sliderValues.comission}
                                    onChange={e => handleComissionSliderChange(e.target.value, true)}
                                    className="w-full range-slider-reverse"
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
                                variant='ghost'
                                onClick={() => handleUpdateObservation(observationRef.current?.value || "")}
                                className='absolute z-2 bottom-3 right-2 py-1 text-sm px-1 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70'>
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
            <EditOficioBrokerForm
                mainData={mainData}
            />
            {/* ----> end edit info modal <----- */}
        </div>
    )
}

export default DashbrokersCard
