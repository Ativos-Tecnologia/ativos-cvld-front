/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Form } from '@/components/ui/form';
import { estados } from '@/constants/estados';
import { estadoCivil } from '@/constants/estado-civil';
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
import { BiInfoCircle, BiSave, BiSolidCalculator, BiSolidCoinStack, BiX } from 'react-icons/bi';
import { BsCalendar2HeartFill, BsPencilSquare } from 'react-icons/bs';
import { CgArrowsH, CgSearchLoading } from 'react-icons/cg';
import { FaBalanceScale, FaIdCard, FaMapMarkedAlt, FaRegFilePdf } from 'react-icons/fa';
import { FaBuilding, FaBuildingColumns, FaLink, FaUser } from 'react-icons/fa6';
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi';
import { GrDocumentText, GrDocumentUser, GrMoney } from 'react-icons/gr';
import { IoIosPaper } from 'react-icons/io';
import { IoCalendar, IoDocumentTextSharp, IoGlobeOutline } from 'react-icons/io5';
import { LuClipboardCheck, LuCopy, LuHandshake } from 'react-icons/lu';
import { MdOutlineArchive, MdOutlineDownloading } from 'react-icons/md';
import { TbMoneybag, TbStatusChange } from 'react-icons/tb';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Button } from '../Button';
import RentabilityChart from '../Charts/RentabilityChart';
import { CelerInputField } from '../CrmUi/InputFactory';
import CRMTooltip from '../CrmUi/Tooltip';
import CelerInputFormField from '../Forms/CustomFormField';
import LifeCycleStep from '../LifeCycleStep';
import BrokerModal, { IdentificationType } from '../Modals/BrokersCedente';
import DocForm from '../Modals/BrokersDocs';
import JuridicoDetailsSkeleton from '../Skeletons/JuridicoDetailsSkeleton';
import { SelectItem } from '../ui/select';
import verifyRequiredInputsToDue from '@/functions/juridico/verifyRequiredInputsToDue';
import { AxiosError } from 'axios';
import { TiArrowBack, TiArrowForward } from 'react-icons/ti';

type JuridicoDetailsProps = {
    id: string;
};

type InputErrorTypes =
    | 'Revisão de Due Diligence'
    | 'Pré-Due Ativo'
    | 'Revisão Valor/LOA'
    | 'Pré-Due Cedente'
    | 'Due em Andamento';

export const LegalDetails = ({ id }: JuridicoDetailsProps) => {
    const {
        data: { first_name, user },
    } = useContext<UserInfoContextType>(UserInfoAPIContext);

    const { cedenteModal, setCedenteModal, docModalInfo, setDocModalInfo } =
        useContext(BrokersContext);

    const [credorIdentificationType, setCredorIdentificationType] =
        useState<IdentificationType>(null);
    const [requiredInputsErrorType, setRequiredInputsErrorType] = useState<InputErrorTypes | null>(
        null,
    );
    const [vlData, setVlData] = useState<IWalletResponse>({
        id: '',
        valor_investido: 0,
        valor_projetado: 0,
        previsao_de_pgto: '',
        rentabilidade_anual: 0,
        data_de_aquisicao: '',
        result: [
            {
                data_atualizacao: '',
                valor_principal: 0,
                valor_juros: 0,
                valor_inscrito: 0,
                valor_bruto_atualizado_final: 0,
                valor_liquido_disponivel: 0,
            },
        ],
    });
    const [linkCopied, setLinkCopied] = useState<boolean>(false);
    const [observation, setObservation] = useState<string>('');
    const [formData, setFormData] = useState<Record<string, any> | null>(null);
    const [happenedRecalculation, setHappenedRecalculation] = useState<boolean>(false);
    const [recalculationData, setRecalculationData] = useState<any>(null);
    const [isLoadingRecalculation, setIsLoadingRecalculation] = useState<boolean>(false);
    const [loadingUpdateState, setLoadingUpdateState] = useState<string | null>(null);
    const [editLock, setEditLock] = useState<boolean>(false);
    const [disabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
    const [sliderError, setSliderError] = useState<boolean>(false);
    const [sliderValues, setSliderValues] = useState({
        rentabilidade: 0,
        desembolso: 0,
    });
    const [statusDiligence, setStatusDiligence] = useState<string>('');

    const swal = UseMySwal();
    const { globalQueryClient } = useContext(ReactGlobalQueryContext);

    /* refs */
    const rentabilidadeSlideRef = useRef<HTMLInputElement>(null);
    const desembolsoSlideRef = useRef<HTMLInputElement>(null);
    const linkDueInputRef = useRef<HTMLInputElement>(null);

    const handleCession = () => {
        /** code here */
    };

    async function fetchData() {
        const response = await api.get(`/api/notion-api/list/page/${id}/`);
        return response.data;
    }
    async function fetchCedenteData(cedenteId: string) {
        if (!cedenteId) return;
        const response = await api.get(`/api/notion-api/list/page/${cedenteId}/`);
        return response.data;
    }

    const { data, isLoading, refetch } = useQuery<NotionPage>({
        queryKey: ['page', id],
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
            formData.percentual_a_ser_adquirido = String(formData.percentual_a_ser_adquirido);
            formData.percentual_a_ser_adquirido =
                Number(formData.percentual_a_ser_adquirido.replace(',', '.')) / 100;
        }

        if (!formData.ja_possui_destacamento) {
            formData.percentual_de_honorarios = String(formData.percentual_de_honorarios);
            formData.percentual_de_honorarios =
                Number(String(formData.percentual_de_honorarios?.replace(',', '.'))) / 100;
        } else {
            formData.percentual_de_honorarios = 0;
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

    /**
     * @description
     * Essa função é utilizada para lidar com a mudança no campo de identificação (CPF/CNPJ)
     *
     * @param {string} value - Valor do campo de identificação
     * @param {string} page_id - ID da página do Notion
     * @returns {Promise<void>}
     */
    const handleChangeIdentification = async (
        value: string,
        page_id: string,
        fieldName: string,
    ): Promise<void> => {
        if (value.length === 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length === 14) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }

        await updateDataRichTextMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    /**
     * @description
     * Essa função é utilizada para lidar com a mudança no campo de NPU
     *
     * @param {string} value - Valor do campo de NPU
     * @param {string} fieldName - Tipo do campo de NPU (ex: 'NPU')
     * @param {string} page_id - ID da página do Notion
     * @returns {Promise<void>}
     */
    const handleChangeNpu = async (
        value: string,
        page_id: string,
        fieldName: string,
    ): Promise<void> => {
        value = value.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/, '$1-$2.$3.$4.$5.$6');

        await updateDataRichTextMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    const handleUpdateEmissaoProcesso = async (
        value: string,
        page_id: string,
        fieldName: string,
    ) => {
        const check = value === 'SIM' ? true : false;

        await updateDataCheckboxMutation.mutateAsync({
            value: check,
            page_id,
            fieldName,
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

        setSliderValues({
            rentabilidade: newRentabilidade,
            desembolso: newDesembolso,
        });

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

        setSliderValues({
            rentabilidade: newRentabilidade,
            desembolso: newDesembolso,
        });

        if (rentabilidadeSlideRef.current && desembolsoSlideRef.current) {
            desembolsoSlideRef.current.value = numberFormat(newDesembolso);
            if (fromSlider) {
                rentabilidadeSlideRef.current.value = `${(newRentabilidade * 100).toFixed(2).replace('.', ',')}%`;
            }
        }
    };

    const handleSaveValues = async () => {
        setLoadingUpdateState('formValues');
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
            setLoadingUpdateState(null);
        }
    };

    const handleUpdatePrevisaoDePagamento = async (value: string, page_id: string) => {
        await previsaoDePagamentoMutation.mutateAsync({
            page_id,
            value,
        });
    };

    const handleCopyDueLink = () => {
        if (linkDueInputRef.current) {
            setLinkCopied(true);
            const value = linkDueInputRef.current.value;
            navigator.clipboard.writeText(value);
            navigator.vibrate(200);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    const handleRepactuacao = () => {
        swal.fire({
            title: 'Repactuação',
            text: 'Deseja mesmo Enviar para Repactuação?',
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
                            name: 'Repactuação',
                        },
                    },
                });
                if (response.status !== 202) {
                    swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao enviar para Repactuação',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }

                refetch();

                swal.fire({
                    title: 'Registro Salvo.',
                    text: 'O Oficio seguiu para a Repactuação.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    const handleUpdateDuePhase = async (phase: string, fieldsCheck?: (boolean | undefined)[]) => {
        const requiredInputsCheck = fieldsCheck
            ? fieldsCheck.every((value) => value === true)
            : true;
        if (requiredInputsCheck) {
            swal.fire({
                title: 'Mudança de Etapa',
                text: 'Deseja enviar ofício para ' + phase + '?',
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
                                name: phase,
                            },
                        },
                    });
                    if (response.status !== 202) {
                        swal.fire({
                            title: 'Erro',
                            text: 'Houve um erro ao enviar para ' + phase,
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                    }

                    refetch();

                    swal.fire({
                        title: 'Registro Salvo.',
                        text: 'O Oficio seguiu para a ' + phase,
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
            setRequiredInputsErrorType(
                data?.properties['Status Diligência'].select?.name as InputErrorTypes,
            );
        }
    };

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
                    'Status Diligência': {
                        select: {
                            name: 'Informar arquivamento',
                        },
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
                text: 'Deseja mesmo alterar para Due em Andamento?',
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
            setRequiredInputsErrorType('Due em Andamento');
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
            setRequiredInputsErrorType('Revisão de Due Diligence');
        }
    };

    // TODO: Funções de handle que serão dinâmicas para um determinado grupo
    // de campos do notion ficarão abaixo
    const handleUpdateDataCheckbox = async (value: boolean, page_id: string, fieldName: string) => {
        await updateDataCheckboxMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    const handleUpdateDataSelect = async (value: string, page_id: string, fieldName: string) => {
        await updateDataSelectMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    const handleUpdateDataUrl = async (value: string, page_id: string, fieldName: string) => {
        await updateDataUrlMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    const handleUpdateDataTitle = async (value: string, page_id: string, fieldName: string) => {
        await updateDataTitleMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    const handleUpdateDataRichText = async (value: string, page_id: string, fieldName: string) => {
        await updateDataRichTextMutation.mutateAsync({
            value,
            page_id,
            fieldName,
        });
    };

    // ----> Mutations <-----

    // TODO: mutations que serão dinâmicas para um determinado grupo
    // de campos do notion ficarão abaixo
    const updateDataCheckboxMutation = useMutation({
        mutationFn: async (paramsObj: { value: boolean; page_id: string; fieldName: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                [paramsObj.fieldName]: {
                    checkbox: paramsObj.value,
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState(paramsObj.fieldName);
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (prev: any) => {
                return {
                    ...prev,
                    properties: {
                        ...prev?.properties,
                        [paramsObj.fieldName]: {
                            ...prev?.properties[paramsObj.fieldName],
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
                text: `Houve um erro ao atualizar o check de ${paramsObj.fieldName.replace('?', '')}`,
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
                text: `${paramsObj.fieldName.replace('?', '')} atualizado com sucesso!`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: (data, error, paramsObj) => {
            setEditLock(false);
            setLoadingUpdateState(null);
        },
    });

    const updateDataSelectMutation = useMutation({
        mutationFn: async (paramsObj: { value: string; page_id: string; fieldName: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                [paramsObj.fieldName]: {
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
        onMutate: async (paramsObj) => {
            setLoadingUpdateState(paramsObj.fieldName);
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (prev: any) => {
                return {
                    ...prev,
                    properties: {
                        ...prev?.properties,
                        [paramsObj.fieldName]: {
                            ...prev?.properties[paramsObj.fieldName],
                            select: {
                                ...prev?.properties[paramsObj.fieldName]?.select,
                                name: paramsObj.value,
                            },
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
                text: `Houve um erro ao atualizar o campo de ${paramsObj.fieldName.replace('?', '')}`,
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
                text: `${paramsObj.fieldName.replace('?', '')} atualizado com sucesso!`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState(null);
        },
    });

    const updateDataUrlMutation = useMutation({
        mutationFn: async (paramsObj: {
            value: string | null;
            page_id: string;
            fieldName: string;
        }) => {
            if (paramsObj.value === '') {
                paramsObj.value = null;
            }

            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                [paramsObj.fieldName]: {
                    url: paramsObj.value,
                },
            });

            if (response.status !== 202) {
                throw new Error('houve um erro ao salvar os dados no notion');
            }

            return response.data;
        },
        onMutate: async (paramsObj) => {
            setLoadingUpdateState(paramsObj.fieldName);
            setEditLock(true);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (prev: any) => {
                return {
                    ...prev,
                    properties: {
                        ...prev?.properties,
                        [paramsObj.fieldName]: {
                            ...prev?.properties[paramsObj.fieldName],
                            url: paramsObj.value,
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
                text: `Houve um erro ao atualizar o campo ${paramsObj.fieldName}`,
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
                text: `${paramsObj.fieldName} atualizado com sucesso`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
            refetch();
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState(null);
        },
    });

    const updateDataTitleMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string; fieldName: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                [paramsObj.fieldName]: {
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
            setLoadingUpdateState(paramsObj.fieldName);
            const prevData = globalQueryClient.getQueryData(['page', id]);
            globalQueryClient.setQueryData(['page', id], (prev: any) => {
                return {
                    ...prev,
                    properties: {
                        ...prev?.properties,
                        [paramsObj.fieldName]: {
                            ...prev?.properties[paramsObj.fieldName],
                            title: [
                                {
                                    ...prev?.properties[paramsObj.fieldName]?.title,
                                    text: {
                                        ...prev?.properties[paramsObj.fieldName]?.title?.text,
                                        content: paramsObj.value,
                                    },
                                },
                            ],
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
                text: `Houve um erro ao atualizar o campo ${paramsObj.fieldName}`,
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
                text: `${paramsObj.fieldName} atualizado com sucesso`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState(null);
        },
    });

    const updateDataRichTextMutation = useMutation({
        mutationFn: async (paramsObj: { page_id: string; value: string; fieldName: string }) => {
            const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
                [paramsObj.fieldName]: {
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
            setLoadingUpdateState(paramsObj.fieldName);
            setEditLock(true);
        },
        onError: (error, paramsObj) => {
            swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                text: `Houve um erro ao atualizar o campo ${paramsObj.fieldName}`,
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
                text: `${paramsObj.fieldName} atualizadas com sucesso`,
                position: 'bottom-right',
                showConfirmButton: false,
            });
            refetch();
        },
        onSettled: () => {
            setEditLock(false);
            setLoadingUpdateState(null);
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
            setLoadingUpdateState('Previsão de Pagamento');
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
            setLoadingUpdateState(null);
            setEditLock(false);
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
                rentabilidade: data?.properties['Rentabilidade Anual'].number || 0,
                desembolso: data?.properties['Nova Fórmula do Desembolso'].formula?.number || 0,
            });

            setObservation(data?.properties['Observação']?.rich_text?.[0]?.text?.content || '');
        }
    }, [data]);

    const fetchUpdatedVL = async (oficio: NotionPage) => {
        // Essa função recebe um objeto do tipo NotionPage e retorna um objeto do tipo IWalletResponse com os valores atualizados
        try {
            const response = await api.post('/api/extrato/wallet/', {
                oficio,
                from_today: data?.properties['Data de aquisição do precatório'].date?.start
                    ? false
                    : true,
            });
            setVlData(response.data);
            // refetch();
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    useEffect(() => {
        if (data) {
            fetchUpdatedVL(data);
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

    if (!data) {
        return <JuridicoDetailsSkeleton />;
    }

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-end justify-end rounded-md">
                <Breadcrumb
                    customIcon={<FaBalanceScale className="h-[32px] w-[32px]" />}
                    altIcon="Espaço de trabalho do time jurídico"
                    pageName="Jurídico / Detalhes"
                    title={`Olá, ${first_name}`}
                />
            </div>
            <LifeCycleStep status={data?.properties['Status Diligência'].select?.name ?? 'ops'} />
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
                                onSubmit={(_, value) => handleUpdateDataTitle(value, id, 'Credor')}
                                isLoading={loadingUpdateState === 'Credor'}
                                disabled={editLock}
                            />
                        </div>

                        <div className="w-full 2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                                onSubmit={(_, value) =>
                                    handleChangeIdentification(value, id, 'CPF/CNPJ')
                                }
                                isLoading={loadingUpdateState === 'CPF/CNPJ'}
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
                                <div className="grid min-w-40 md:col-span-3 lg:col-span-2 xl:col-span-1">
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
                                            handleUpdateEmissaoProcesso(
                                                value,
                                                id,
                                                'Certidões emitidas',
                                            )
                                        }
                                        isLoading={loadingUpdateState === 'Certidões emitidas'}
                                        disabled={editLock}
                                        className="w-full"
                                    >
                                        <SelectItem value="SIM">Sim</SelectItem>
                                        <SelectItem value="NÃO">Não</SelectItem>
                                    </CelerInputField>

                                    {!data?.properties['Certidões emitidas']?.checkbox &&
                                        requiredInputsErrorType === 'Revisão de Due Diligence' && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Preenchimento obrigatório
                                            </p>
                                        )}
                                </div>

                                <div className="grid min-w-40 md:col-span-3 lg:col-span-2 xl:col-span-1">
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
                                            handleUpdateEmissaoProcesso(
                                                value,
                                                id,
                                                'Possui processos?',
                                            )
                                        }
                                        isLoading={loadingUpdateState === 'Possui processos?'}
                                        disabled={editLock}
                                        className="w-full"
                                    >
                                        <SelectItem value="SIM">Sim</SelectItem>
                                        <SelectItem value="NÃO">Não</SelectItem>
                                    </CelerInputField>

                                    {!data?.properties['Possui processos?']?.checkbox &&
                                        requiredInputsErrorType === 'Revisão de Due Diligence' && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Preenchimento obrigatório
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
                                            handleUpdateDataSelect(
                                                value,
                                                credorIdentificationType === 'CPF'
                                                    ? cedenteDataPF?.id!
                                                    : socioData?.id!,
                                                'Estado Civil',
                                            )
                                        }
                                        isLoading={loadingUpdateState === 'Estado Civil'}
                                        required
                                        disabled={editLock}
                                    >
                                        {estadoCivil.map((item, index) => (
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
                                        requiredInputsErrorType === 'Revisão de Due Diligence' && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Preenchimento obrigatório
                                            </p>
                                        )}

                                    {credorIdentificationType === 'CNPJ' &&
                                        !socioData?.properties['Estado Civil']?.select?.name &&
                                        requiredInputsErrorType === 'Revisão de Due Diligence' && (
                                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                                Preenchimento obrigatório
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
                                isLoading={loadingUpdateState === 'NPU (Originário)'}
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
                                isLoading={loadingUpdateState === 'NPU (Precatório)'}
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
                                onSubmit={(_, value) =>
                                    handleUpdateDataRichText(value, id, 'Juízo')
                                }
                                isLoading={loadingUpdateState === 'Juizo'}
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
                                onSubmit={(_, value) =>
                                    handleUpdateDataSelect(value, id, 'Ente Devedor')
                                }
                                isLoading={loadingUpdateState === 'Ente Devedor'}
                                disabled={editLock}
                            />
                        </div>
                        <div
                            className={`2xsm:col-span-4 md:col-span-2 xl:col-span-1 ${data?.properties['Esfera'].select?.name === 'FEDERAL' && 'hidden'}`}
                        >
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
                                    handleUpdateDataSelect(value, id, 'Estado do Ente Devedor')
                                }
                                isLoading={loadingUpdateState === 'Estado do Ente Devedor'}
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

                    <section id="info_valores" className="rounded-md bg-white p-4 dark:bg-boxdark">
                        <form onSubmit={form.handleSubmit(onSubmitForm)}>
                            <div className="grid grid-cols-4 gap-6 3xl:grid-cols-5">
                                {/* tipo */}
                                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                                    <CelerInputFormField
                                        control={form.control}
                                        name="tipo_do_oficio"
                                        label="Tipo"
                                        fieldType={InputFieldVariant.SELECT}
                                        defaultValue={data?.properties['Tipo'].select?.name ?? ''}
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
                                        defaultValue={data?.properties['Esfera'].select?.name ?? ''}
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
                                        defaultValue={data?.properties['Valor Juros'].number ?? 0}
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
                                            data?.properties['Data do Recebimento'].date?.start ??
                                            ''
                                        }
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <hr className="mt-6 border border-stroke dark:border-strokedark" />

                            <div className="mt-6 grid gap-6 md:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-5">
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
                                                Data de atualização não pode ser menor que a data da
                                                requisição
                                            </span>
                                        )}
                                </div>

                                <div className="col-span-4">
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

                                <div className="col-span-4">
                                    <h3 className="text-sm font-medium text-bodydark2 2xsm:text-center md:text-left">
                                        Atenção: A atualização dos valores, datas, percentuais etc
                                        implica na modificação do valor líquido do ativo. Caso o
                                        status do ativo será alterado para Repactuação, ele
                                        retornará para o broker para re-negociação.
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
                                                : recalculationData.result.net_mount_to_be_assigned,
                                        )}
                                    </span>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-center 2xsm:flex-col 2xsm:gap-3 lg:flex-row lg:gap-6">
                                <Button
                                    type="submit"
                                    variant="success"
                                    isLoading={isLoadingRecalculation}
                                    disabled={!isFormModified}
                                    className="flex items-center gap-3 rounded-md px-4 py-2 text-sm uppercase disabled:opacity-50 disabled:hover:bg-green-500 2xsm:w-full md:w-fit"
                                >
                                    <BiSolidCalculator className="h-4 w-4" />
                                    <span className="font-medium">Recalcular</span>
                                </Button>

                                {data?.properties['Memória de Cálculo Ordinário'].url && (
                                    <Link
                                        href={data?.properties['Memória de Cálculo Ordinário'].url}
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 rounded-md bg-blue-600 px-4 py-2 text-sm uppercase text-snow transition-colors duration-300 hover:bg-blue-700 2xsm:w-full md:w-fit"
                                    >
                                        <GrDocumentText className="h-4 w-4" />
                                        <span className="font-medium">
                                            Memória de Cálculo Simples
                                        </span>
                                    </Link>
                                )}

                                {data?.properties['Memória de Cálculo RRA'].url && (
                                    <Link
                                        href={data?.properties['Memória de Cálculo RRA'].url}
                                        target="_blank"
                                        referrerPolicy="no-referrer"
                                        className="flex items-center justify-center gap-3 rounded-md bg-blue-600 px-4 py-2 text-sm uppercase text-snow transition-colors duration-300 hover:bg-blue-700 2xsm:w-full md:w-fit"
                                    >
                                        <GrDocumentText className="h-4 w-4" />
                                        <span className="font-medium">Memória de Cálculo RRA</span>
                                    </Link>
                                )}
                            </div>
                        </form>
                    </section>
                </div>
            </Form>

            <section id="due_diligence" className="form-inputs-container">
                <div className="col-span-4 text-bodydark2 3xl:col-span-5">
                    <h2 className="mb-2 font-medium">Due Diligence</h2>
                    <p className="text-sm">Qualquer pessoa com o link poderá acessar o documento</p>
                </div>
                <div className="col-span-4 flex gap-2 2xsm:flex-col md:flex-row md:items-center 3xl:col-span-5">
                    <CelerInputField
                        name="link_due_diligence"
                        ref={linkDueInputRef}
                        fieldType={InputFieldVariant.INPUT}
                        placeholder="Digite o link"
                        isLoading={loadingUpdateState === 'Link de Due Diligence'}
                        defaultValue={
                            data?.properties['Link de Due Diligence']?.url || 'Sem link disponível'
                        }
                        className="2xsm:wfull !h-10 md:w-100"
                        onSubmit={(_, value) =>
                            handleUpdateDataUrl(value, id, 'Link de Due Diligence')
                        }
                    />

                    <Button
                        disabled={!data?.properties['Link de Due Diligence']?.url || editLock}
                        className="mt-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                            window.open(data?.properties['Link de Due Diligence']?.url, '_blank')
                        }
                    >
                        <FaLink />
                        Visualizar Due
                    </Button>

                    <Button
                        disabled={!data?.properties['Link de Due Diligence']?.url || editLock}
                        className={`mt-2 disabled:cursor-not-allowed disabled:opacity-50 ${linkCopied && '!bg-green-500 !text-snow hover:!bg-green-600'}`}
                        onClick={() => handleCopyDueLink()}
                    >
                        {linkCopied ? (
                            <>
                                <LuClipboardCheck />
                                <p>Link Copiado!</p>
                            </>
                        ) : (
                            <>
                                <LuCopy />
                                Copiar
                            </>
                        )}
                    </Button>
                </div>
            </section>

            {statusDiligence === 'Revisão Valor/LOA' && (
                <section
                    id="revisao_preco_pagamento"
                    className="rounded-md bg-white p-4 dark:bg-boxdark"
                >
                    <h3 className="mb-8 font-medium text-bodydark2">
                        Revisão de Preço e Tempo de Pagamento
                    </h3>

                    <div className="flex gap-6">
                        <div>
                            <CelerInputField
                                name="preenchimento_oficio_requisitorio"
                                fieldType={InputFieldVariant.CHECKBOX}
                                checked={data?.properties['Preenchimento Correto'].checkbox}
                                label="Preenchimento de acordo com o Oficio Requisitorio"
                                isLoading={loadingUpdateState === 'Preenchimento Correto'}
                                disabled={editLock}
                                onValueChange={(_, value) =>
                                    handleUpdateDataCheckbox(value, id, 'Preenchimento Correto')
                                }
                                required
                                className="text-sm font-medium"
                            />
                            {!data?.properties['Preenchimento Correto'].checkbox &&
                                requiredInputsErrorType === 'Revisão Valor/LOA' && (
                                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        Preenchimento obrigatório
                                    </p>
                                )}
                        </div>

                        <div>
                            <CelerInputField
                                name="memoria_calculo"
                                fieldType={InputFieldVariant.CHECKBOX}
                                checked={data?.properties['Memória de Cálculo'].checkbox}
                                label="Memória de cálculo de acordo com o ofício"
                                isLoading={loadingUpdateState === 'Memória de Cálculo'}
                                disabled={editLock}
                                onValueChange={(_, value) =>
                                    handleUpdateDataCheckbox(value, id, 'Memória de Cálculo')
                                }
                                required
                                className="text-sm font-medium"
                            />
                            {!data?.properties['Memória de Cálculo'].checkbox &&
                                requiredInputsErrorType === 'Revisão Valor/LOA' && (
                                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        Preenchimento obrigatório
                                    </p>
                                )}
                        </div>
                    </div>
                </section>
            )}

            {statusDiligence === 'Pré-Due Ativo' && (
                <section id="pre_due_ativo" className="rounded-md bg-white p-4 dark:bg-boxdark">
                    <h3 className="mb-8 max-w-sm font-medium text-bodydark2">
                        Revisão do Ativo Pré-Due
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <CelerInputField
                                name="autos_do_ativo_check"
                                fieldType={InputFieldVariant.CHECKBOX}
                                checked={
                                    data?.properties['Autos do Ativo Judicial Baixado'].checkbox
                                }
                                label="Autos do Ativo Judicial Baixado"
                                isLoading={loadingUpdateState === 'Autos do Ativo Judicial Baixado'}
                                disabled={editLock}
                                onValueChange={(_, value) =>
                                    handleUpdateDataCheckbox(
                                        value,
                                        id,
                                        'Autos do Ativo Judicial Baixado',
                                    )
                                }
                                required
                                className="text-sm font-medium"
                            />
                            {!data?.properties['Autos do Ativo Judicial Baixado'].checkbox &&
                                requiredInputsErrorType === 'Pré-Due Ativo' && (
                                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        Preenchimento obrigatório
                                    </p>
                                )}
                        </div>

                        <hr className="border border-stroke dark:border-strokedark" />

                        <div>
                            <CelerInputField
                                name="possiu_recurso"
                                fieldType={InputFieldVariant.SELECT}
                                label={`Há algum recurso ?`}
                                defaultValue={
                                    data?.properties['Há algum recurso?'].select?.name || ''
                                }
                                onValueChange={(_, value) =>
                                    handleUpdateDataSelect(value, id, 'Há algum recurso?')
                                }
                                isLoading={loadingUpdateState === 'Há algum recurso?'}
                                disabled={editLock}
                                required
                                className="max-w-[230px]"
                            >
                                <SelectItem value="Não">Não</SelectItem>
                                <SelectItem value="Sim sobre o valor total">
                                    Sim, sobre o valor total
                                </SelectItem>
                                <SelectItem value="Sim sobre o valor parcial">
                                    Sim, sobre o valor parcial
                                </SelectItem>
                            </CelerInputField>
                            {!data?.properties['Há algum recurso?'].select?.name &&
                                requiredInputsErrorType === 'Pré-Due Ativo' && (
                                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        Preenchimento obrigatório
                                    </p>
                                )}
                        </div>
                    </div>
                </section>
            )}

            {statusDiligence === 'Pré-Due Cedente' && (
                <section id="pre_due_cedente" className="rounded-md bg-white p-4 dark:bg-boxdark">
                    <h3 className="mb-8 max-w-sm font-medium text-bodydark2">
                        Revisão do Cedente Pré-Due
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <CelerInputField
                                name="certidao_receita_federal"
                                fieldType={InputFieldVariant.CHECKBOX}
                                checked={data?.properties['Certidão Receita Federal/PGFN'].checkbox}
                                label="Certidão Receita Federal/PGFN"
                                isLoading={loadingUpdateState === 'Certidão Receita Federal/PGFN'}
                                disabled={editLock}
                                onValueChange={(_, value) =>
                                    handleUpdateDataCheckbox(
                                        value,
                                        id,
                                        'Certidão Receita Federal/PGFN',
                                    )
                                }
                                required
                                className="text-sm font-medium"
                            />
                            {!data?.properties['Certidão Receita Federal/PGFN'].checkbox &&
                                requiredInputsErrorType === 'Pré-Due Cedente' && (
                                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        Preenchimento obrigatório
                                    </p>
                                )}
                        </div>

                        {data?.properties['Esfera'].select?.name !== 'FEDERAL' && (
                            <div>
                                <CelerInputField
                                    name="certidao_ente_devedor"
                                    fieldType={InputFieldVariant.CHECKBOX}
                                    checked={data?.properties['Certidão do Ente Devedor'].checkbox}
                                    label="Certidão do Ente Devedor"
                                    isLoading={loadingUpdateState === 'Certidão do Ente Devedor'}
                                    disabled={editLock}
                                    onValueChange={(_, value) =>
                                        handleUpdateDataCheckbox(
                                            value,
                                            id,
                                            'Certidão do Ente Devedor',
                                        )
                                    }
                                    required
                                    className="text-sm font-medium"
                                />
                                {!data?.properties['Certidão do Ente Devedor'].checkbox &&
                                    requiredInputsErrorType === 'Pré-Due Cedente' && (
                                        <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                            Preenchimento obrigatório
                                        </p>
                                    )}
                            </div>
                        )}

                        <div>
                            <CelerInputField
                                name="relatorio_resumido_processual"
                                fieldType={InputFieldVariant.CHECKBOX}
                                checked={data?.properties['Relatório Resumido Processual'].checkbox}
                                label="Relatório Resumido Processual"
                                isLoading={loadingUpdateState === 'Relatório Resumido Processual'}
                                disabled={editLock}
                                onValueChange={(_, value) =>
                                    handleUpdateDataCheckbox(
                                        value,
                                        id,
                                        'Relatório Resumido Processual',
                                    )
                                }
                                required
                                className="text-sm font-medium"
                            />
                            {!data?.properties['Relatório Resumido Processual'].checkbox &&
                                requiredInputsErrorType === 'Pré-Due Cedente' && (
                                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                                        Preenchimento obrigatório
                                    </p>
                                )}
                        </div>
                    </div>
                </section>
            )}

            <section
                id="precatorio_detalhes"
                className="grid gap-6 rounded-md bg-white p-4 dark:bg-boxdark"
            >
                <h3 className="font-medium text-bodydark2">Detalhes do precatório</h3>
                <div className="grid grid-cols-4 gap-6 3xl:grid-cols-5">
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                        <CelerInputField
                            name="vl_com_reservas"
                            fieldType={InputFieldVariant.INPUT}
                            label="Valor Líquido"
                            defaultValue={numberFormat(
                                data.properties['Valor Líquido (Com Reserva dos Honorários)']
                                    ?.formula?.number || 0,
                            )}
                            iconSrc={<GiReceiveMoney className="self-center" />}
                            iconAlt="money"
                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                            disabled={true}
                        />
                    </div>

                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                        <CelerInputField
                            name="custo_total"
                            fieldType={InputFieldVariant.INPUT}
                            label="Custo total do Precatório (absoluto)"
                            defaultValue={numberFormat(
                                (data.properties['Comissão - Celer'].number || 0) +
                                    (data.properties['Proposta Escolhida - Celer'].number || 0),
                            )}
                            iconSrc={<GiReceiveMoney className="self-center" />}
                            iconAlt="money"
                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                            disabled={true}
                        />
                    </div>
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                        <CelerInputField
                            name="loa"
                            fieldType={InputFieldVariant.INPUT}
                            label="LOA"
                            defaultValue={data?.properties['LOA']?.number || 'Sem LOA cadastrada'}
                            iconSrc={<IoCalendar className="self-center" />}
                            iconAlt="calendar"
                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                            disabled={true}
                        />
                    </div>
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                        <CelerInputField
                            name="spread"
                            fieldType={InputFieldVariant.INPUT}
                            label="Spread"
                            defaultValue={numberFormat(
                                (data.properties['Nova Fórmula do Desembolso'].formula?.number ||
                                    0) -
                                    (data.properties['Comissão - Celer'].number || 0) -
                                    (data.properties['Proposta Escolhida - Celer'].number || 0),
                            )}
                            iconSrc={<GiTakeMyMoney className="self-center" />}
                            iconAlt="money"
                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                            disabled={true}
                        />
                    </div>
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                        <CelerInputField
                            name="valor_liquido_cedido"
                            fieldType={InputFieldVariant.INPUT}
                            label="Valor Líquido a ser Cedido"
                            defaultValue={numberFormat(
                                data?.properties['Valor Líquido a ser cedido']?.formula?.number ||
                                    0,
                            )}
                            iconSrc={<GiPayMoney className="self-center" />}
                            iconAlt="money"
                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                            disabled={true}
                        />
                    </div>
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
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
                    <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                        <CelerInputField
                            name="valor_dos_honorarios_nao_destacados"
                            fieldType={InputFieldVariant.INPUT}
                            label="Valor dos Honorários"
                            defaultValue={numberFormat(
                                data?.properties['Honorários não destacados']?.formula?.number || 0,
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
                        isLoading={loadingUpdateState === 'Cálculo Revisado'}
                        onValueChange={(_, value) =>
                            handleUpdateDataCheckbox(value, id, 'Cálculo Revisado')
                        }
                        className="text-sm font-medium"
                    />
                </div>
            </section>

            {statusDiligence !== 'Revisão Valor/LOA' &&
                statusDiligence !== 'Pré-Due Ativo' &&
                statusDiligence !== 'Pré-Due Cedente' && (
                    <section id="valores_grafico">
                        <div className="grid gap-4 2xsm:grid-cols-2 md:gap-6 xl:grid-cols-12 2xl:gap-7.5">
                            {/*
          Deve ser feita uma verificação em "Data de aquisição do precatório" para que o gráfico seja exibido ou não - situação em que o precatório ainda não foi adquirido. Caso não tenha sido adquirido, o gráfico não deve ser exibido, ficando apenas uma div opaca com a mensagem "Gráfico de rentabilidade indisponível".
          */}
                            <div className="col-span-8 3xl:col-span-8">
                                <RentabilityChart data={vlData} />
                            </div>
                            <div className=" flex flex-col gap-6 rounded-md bg-white p-4 dark:bg-boxdark 2xsm:col-span-8 xl:col-span-4 3xl:col-span-4">
                                <h2 className="text-xl font-medium">Rentabilidade x Desembolso</h2>

                                <div className="flex flex-col gap-5 px-5">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">Rentabilidade Anual</span>
                                            <CelerInputField
                                                ref={rentabilidadeSlideRef}
                                                name="rentabilidade_anual"
                                                fieldType={InputFieldVariant.INPUT}
                                                iconSrc={
                                                    <CRMTooltip text="Insira um valor e pressione ENTER para modificar">
                                                        <BiInfoCircle className="cursor-pointer" />
                                                    </CRMTooltip>
                                                }
                                                defaultValue={`${(sliderValues.rentabilidade * 100).toFixed(2).replace('.', ',')}%`}
                                                className="w-25 text-right font-medium"
                                                onSubmit={(_, value) =>
                                                    handleChangeRentabilidadeSlider(value)
                                                }
                                                disabled={editLock}
                                            />
                                        </div>
                                        <input
                                            onChange={(e) =>
                                                handleChangeRentabilidadeSlider(
                                                    e.target.value,
                                                    true,
                                                )
                                            }
                                            type="range"
                                            min={0}
                                            max={2}
                                            step={0.01}
                                            className="range-slider w-full disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
                                            value={sliderValues.rentabilidade}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-5 px-5">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">Desembolso</span>
                                            <CelerInputField
                                                ref={desembolsoSlideRef}
                                                name="desembolso"
                                                fieldType={InputFieldVariant.INPUT}
                                                iconSrc={
                                                    <CRMTooltip text="Insira um valor e pressione ENTER para modificar">
                                                        <BiInfoCircle className="cursor-pointer" />
                                                    </CRMTooltip>
                                                }
                                                defaultValue={
                                                    numberFormat(sliderValues.desembolso) || '0,00'
                                                }
                                                className="max-w-40 text-right font-medium"
                                                onSubmit={(_, value) =>
                                                    handleChangeDesembolsoSlider(value)
                                                }
                                                disabled={editLock}
                                            />
                                        </div>
                                        <input
                                            onChange={(e) =>
                                                handleChangeDesembolsoSlider(e.target.value, true)
                                            }
                                            type="range"
                                            min={
                                                data &&
                                                handleDesembolsoVsRentabilidade(2, data).desembolso
                                            }
                                            max={
                                                (data &&
                                                    data.properties['Valor Projetado'].number) ||
                                                0
                                            }
                                            step={0.01}
                                            className="range-slider w-full disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
                                            value={sliderValues.desembolso}
                                        />
                                    </div>
                                </div>

                                <Button
                                    disabled={disabledSaveButton}
                                    onClick={handleSaveValues}
                                    className="mx-auto w-fit text-sm uppercase"
                                >
                                    {loadingUpdateState === 'formValues' && (
                                        <AiOutlineLoading className="animate-spin" />
                                    )}
                                    <span className="font-medium">Salvar Valores</span>
                                </Button>

                                {sliderError && (
                                    <span className="text-center text-xs font-medium uppercase text-red-500 dark:text-red-400">
                                        Valores fora do escopo permitido!
                                    </span>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-1">
                                        <CelerInputField
                                            name="valor_projetado"
                                            fieldType={InputFieldVariant.INPUT}
                                            label="Valor Projetado"
                                            defaultValue={numberFormat(
                                                data?.properties['Valor Projetado']?.number || 0,
                                            )}
                                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <CelerInputField
                                            name="previsao_de_pgto"
                                            fieldType={InputFieldVariant.DATE}
                                            label="Previsão de pagamento"
                                            defaultValue={dateFormater(
                                                data?.properties['Previsão de pagamento']?.date
                                                    ?.start,
                                            )}
                                            className="w-full disabled:text-boxdark disabled:dark:text-white"
                                            onSubmit={(_, value) =>
                                                handleUpdatePrevisaoDePagamento(value, id)
                                            }
                                        />
                                    </div>

                                    <hr className="col-span-2 border border-stroke dark:border-strokedark" />

                                    <div className="col-span-2 flex items-center gap-5">
                                        <CelerInputField
                                            name="espelho_oficio_check"
                                            fieldType={InputFieldVariant.CHECKBOX}
                                            label="Espelho do Ofício"
                                            defaultValue={
                                                data?.properties['Espelho do ofício'].checkbox
                                            }
                                            checked={data?.properties['Espelho do ofício'].checkbox}
                                            className="text-sm font-medium"
                                            onValueChange={(_, value) =>
                                                handleUpdateDataCheckbox(
                                                    value,
                                                    id,
                                                    'Espelho do ofício',
                                                )
                                            }
                                            isLoading={loadingUpdateState === 'Espelho do ofício'}
                                            required
                                            disabled={editLock}
                                        />
                                        {!data?.properties['Espelho do ofício']?.checkbox &&
                                            requiredInputsErrorType ===
                                                'Revisão de Due Diligence' && (
                                                <p className="text-xs text-red-500 dark:text-red-400">
                                                    Preenchimento obrigatório
                                                </p>
                                            )}
                                    </div>

                                    {data?.properties['Esfera'].select?.name !== 'FEDERAL' && (
                                        <div className="col-span-2 flex items-center gap-5">
                                            <CelerInputField
                                                name="espelho_oficio_check"
                                                fieldType={InputFieldVariant.CHECKBOX}
                                                label="Estoque de Precatórios Baixado"
                                                defaultValue={
                                                    data?.properties[
                                                        'Estoque de Precatórios Baixado'
                                                    ].checkbox
                                                }
                                                checked={
                                                    data?.properties[
                                                        'Estoque de Precatórios Baixado'
                                                    ].checkbox
                                                }
                                                className="text-sm font-medium"
                                                onValueChange={(_, value) =>
                                                    handleUpdateDataCheckbox(
                                                        value,
                                                        id,
                                                        'Estoque de Precatórios Baixado',
                                                    )
                                                }
                                                isLoading={
                                                    loadingUpdateState ===
                                                    'Estoque de Precatórios Baixado'
                                                }
                                                required
                                                disabled={editLock}
                                            />
                                            {!data?.properties['Estoque de Precatórios Baixado']
                                                ?.checkbox &&
                                                requiredInputsErrorType ===
                                                    'Revisão de Due Diligence' && (
                                                    <p className="text-xs text-red-500 dark:text-red-400">
                                                        Preenchimento obrigatório
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

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
                            onClick={() => handleUpdateDataRichText(observation, id, 'Observação')}
                            className="absolute bottom-3 right-2 z-2 bg-slate-100 px-1 py-1 text-sm hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70"
                        >
                            <BiSave className="text-lg" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* <DetalhesActionButtons
        data={data}
        refetch={refetch}
      /> */}

            <div className="flex items-center justify-center gap-6 rounded-md bg-white p-4 dark:bg-boxdark 2xsm:flex-col md:flex-row">
                {statusDiligence !== 'Pendência a Sanar' && (
                    <Button
                        variant="danger"
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                        onClick={() => handlePendencia()}
                    >
                        <BiX className="h-4 w-4" />
                        <span>Pendencia a Sanar</span>
                    </Button>
                )}

                <Button
                    variant="danger"
                    className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                    onClick={() => handleArchiving()}
                >
                    <MdOutlineArchive className="h-4 w-4" />
                    <span>Arquivar</span>
                </Button>

                {statusDiligence === 'Revisão Valor/LOA' ||
                    statusDiligence === 'Pré-Due Cedente' ||
                    (statusDiligence === 'Pré-Due Ativo' && (
                        <Button
                            variant="info"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                            onClick={() => handleRepactuacao()}
                        >
                            <CgArrowsH className="h-4 w-4" />
                            <span>Repactuação</span>
                        </Button>
                    ))}

                {statusDiligence === 'Revisão Valor/LOA' && (
                    <Button
                        variant="success"
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase disabled:pointer-events-none disabled:opacity-50 2xsm:w-full md:w-fit"
                        onClick={() =>
                            handleUpdateDuePhase('Pré-Due Ativo', [
                                data?.properties['Preenchimento Correto'].checkbox,
                                data?.properties['Memória de Cálculo'].checkbox,
                            ])
                        }
                    >
                        <TiArrowForward className="h-4 w-4" />
                        <span>Seguir para Pré-Due Ativo</span>
                    </Button>
                )}

                {statusDiligence === 'Pré-Due Ativo' && (
                    <>
                        <Button
                            variant="warning"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                            onClick={() => handleUpdateDuePhase('Revisão Valor/LOA')}
                        >
                            <TiArrowBack className="h-4 w-4" />
                            <span>Voltar para Revisão de Preço e Tempo</span>
                        </Button>

                        <Button
                            variant="success"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase disabled:pointer-events-none disabled:opacity-50 2xsm:w-full md:w-fit"
                            onClick={() =>
                                handleUpdateDuePhase('Pré-Due Cedente', [
                                    data?.properties['Autos do Ativo Judicial Baixado'].checkbox,
                                    data?.properties['Há algum recurso?'].select?.name
                                        ? true
                                        : false,
                                ])
                            }
                        >
                            <TiArrowForward className="h-4 w-4" />
                            <span>Seguir para Pré-Due Cedente</span>
                        </Button>
                    </>
                )}

                {statusDiligence === 'Pré-Due Cedente' && (
                    <>
                        <Button
                            variant="warning"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                            onClick={() => handleUpdateDuePhase('Pré-Due Ativo')}
                        >
                            <TiArrowBack className="h-4 w-4" />
                            <span>Voltar para Pré-Due do Ativo</span>
                        </Button>

                        <Button
                            variant="success"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase disabled:pointer-events-none disabled:opacity-50 2xsm:w-full md:w-fit"
                            onClick={() => handleUpdateDuePhase('Due Diligence')}
                        >
                            <TiArrowForward className="h-4 w-4" />
                            <span>Seguir para Due Diligence</span>
                        </Button>
                    </>
                )}

                {(statusDiligence === 'Repactuação' || statusDiligence === 'Pendência a Sanar') && (
                    <Button
                        variant="info"
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                        onClick={() => handleDueAndamento()}
                    >
                        <MdOutlineDownloading className="h-4 w-4" />
                        <span>Pendencia Sanada</span>
                    </Button>
                )}

                {(statusDiligence === 'Due Diligence' ||
                    statusDiligence === 'Due em Andamento') && (
                    <Button
                        variant="warning"
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                        onClick={() => handleRevisaoDueDiligence()}
                    >
                        <CgSearchLoading className="h-4 w-4" />
                        <span>Revisão de Due Diligence</span>
                    </Button>
                )}

                {statusDiligence === 'Due Diligence' && (
                    <Button
                        variant="success"
                        className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                        onClick={() => handleUpdateDuePhase('Due em Andamento')}
                    >
                        <TiArrowForward className="h-4 w-4" />
                        <span>Enviar para Due em Andamento</span>
                    </Button>
                )}

                {statusDiligence === 'Due em Andamento' ||
                    (statusDiligence === 'Revisão de Due Diligence' && (
                        <Button
                            variant="success"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                            onClick={() => handleDueDiligence()}
                        >
                            <BiSolidCoinStack className="h-4 w-4" />
                            <span>Enviar para Liquidação</span>
                        </Button>
                    ))}

                {statusDiligence === 'Em cessão' && (
                    <>
                        <Button
                            variant="success"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                            onClick={() => handleCessao()}
                        >
                            <BiSolidCoinStack className="h-4 w-4" />
                            <span>Enviar pra Registro de Cessão</span>
                        </Button>
                    </>
                )}

                {statusDiligence === 'Em liquidação' && (
                    <>
                        <Button
                            variant="warning"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase 2xsm:w-full md:w-fit"
                            onClick={() =>
                                handleUpdateDataSelect(
                                    'Revisão de Due Diligence',
                                    id,
                                    'Status Diligência',
                                )
                            }
                        >
                            {loadingUpdateState === 'Revisão de Due Diligence' ? (
                                <AiOutlineLoading className="h-4 w-4 animate-spin" />
                            ) : (
                                <TbStatusChange className="h-4 w-4" />
                            )}
                            <span>Retornar para revisão de Due</span>
                        </Button>

                        <Button
                            disabled
                            variant="info"
                            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium uppercase disabled:pointer-events-none disabled:opacity-50 2xsm:w-full md:w-fit"
                            onClick={() => handleCession()}
                        >
                            <BiSolidCoinStack className="h-4 w-4" />
                            <span>Marcar Cessão</span>
                        </Button>
                    </>
                )}
            </div>

            {cedenteModal !== null && <BrokerModal />}
            {docModalInfo !== null && <DocForm />}
        </div>
    );
};
