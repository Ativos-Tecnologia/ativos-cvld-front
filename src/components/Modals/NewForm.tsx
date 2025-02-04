import { DefaultLayoutContext } from '@/context/DefaultLayoutContext';
import { TableNotionContext } from '@/context/NotionTableContext';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { formatCurrency } from '@/functions/formaters/formatCurrency';
import numberFormat from '@/functions/formaters/numberFormat';
import { CvldFormInputsProps } from '@/types/cvldform';
import { LeadMagnetResposeProps } from '@/types/leadMagnet';
import api from '@/utils/api';
import { AxiosError } from 'axios';
import { Slash } from 'lucide-react';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiCheck, BiHighlight, BiSave, BiX } from 'react-icons/bi';
import { toast } from 'sonner';
import { Button } from '../Button';
import NewFormResultSkeleton from '../Skeletons/NewFormResultSkeleton';
import { PiResize } from 'react-icons/pi';
import { GiResize } from 'react-icons/gi';
import CalcForm from '../Forms/CalcForm';
import { isCPFOrCNPJValid } from '@/functions/verifiers/isCPFOrCNPJValid';
import UseMySwal from '@/hooks/useMySwal';
import { regimeEspecialExceptions } from '@/constants/excecoes-regime-especial';
import { getCurrentFormattedDate } from '@/functions/getCurrentFormattedDate';

const NewForm = () => {
    const { setSaveInfoToNotion, usersList } = useContext(TableNotionContext);
    const MySwal = UseMySwal();

    // const [CPFOrCNPJValue, setCPFOrCNPJValue] = useState<string>('');
    const [auxValues, setAuxValues] = useState<{ proposal: number; commission: number }>({
        proposal: 0,
        commission: 0,
    });
    const [errorMessage, setErrorMessage] = useState<boolean>(false);
    const [isProposalButtonDisabled, setIsProposalButtonDisabled] = useState<boolean>(true);
    const { modalOpen, setModalOpen } = useContext(DefaultLayoutContext);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [backendResponse, setBackendResponse] = useState<LeadMagnetResposeProps>({
        id: '',
        min_proposal: 0,
        max_proposal: 0,
        min_comission: 0,
        max_comission: 0,
        min_proposal_percent: 0,
        max_proposal_percent: 0,
        memoria_de_calculo_simples: '',
        memoria_de_calculo_rra: '',
    });
    const [showResults, setShowResults] = useState<boolean>(false);
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0,
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
    const { data } = useContext<UserInfoContextType>(UserInfoAPIContext);
    const resultContainerRef = useRef<HTMLDivElement | null>(null);
    const proposalRef = useRef<HTMLInputElement | null>(null);
    const comissionRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<Partial<CvldFormInputsProps>>({
        defaultValues: {
            numero_de_meses: 0,
            gerar_cvld: true,
        }
    });

    // Função para atualizar a proposta e ajustar a comissão proporcionalmente
    const handleProposalSliderChange = (value: string, sliderChange: boolean) => {
        const newProposalSliderValue = parseFloat(value);
        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });

        if (newProposalSliderValue !== auxValues.proposal) {
            setIsProposalButtonDisabled(false);
        } else {
            setIsProposalButtonDisabled(true);
        }

        // Calcular a proporção em relação a proposta e ajustar a comissão
        const proportion =
            (newProposalSliderValue - backendResponse.min_proposal) /
            (backendResponse.max_proposal - backendResponse.min_proposal);

        const newComissionSliderValue =
            backendResponse.max_comission -
            proportion * (backendResponse.max_comission - backendResponse.min_comission);

        setSliderValues((oldValues) => {
            return { ...oldValues, comission: newComissionSliderValue };
        });

        if (comissionRef.current && proposalRef.current) {
            comissionRef.current.value = numberFormat(newComissionSliderValue);
            if (sliderChange) {
                proposalRef.current.value = numberFormat(newProposalSliderValue);
            }
        }
    };

    // Função para atualizar a comissão e ajustar a proposta proporcionalmente
    const handleComissionSliderChange = (value: string, sliderChange: boolean) => {
        const newComissionSliderValue = parseFloat(value);
        setSliderValues((oldValues) => {
            return { ...oldValues, comission: newComissionSliderValue };
        });

        if (newComissionSliderValue !== auxValues.commission) {
            setIsProposalButtonDisabled(false);
        } else {
            setIsProposalButtonDisabled(true);
        }

        // Calcular a proporção em relação a comissão e ajustar a proposta
        const proportion =
            (newComissionSliderValue - backendResponse.min_comission) /
            (backendResponse.max_comission - backendResponse.min_comission);

        const newProposalSliderValue =
            backendResponse.max_proposal -
            proportion * (backendResponse.max_proposal - backendResponse.min_proposal);

        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });

        if (proposalRef.current && comissionRef.current) {
            proposalRef.current.value = numberFormat(newProposalSliderValue);
            if (sliderChange) {
                comissionRef.current.value = numberFormat(newComissionSliderValue);
            }
        }
    };

    // Função para atualizar proposta/comissão com os dados dos inputs
    const changeInputValues = (inputField: string, value: string) => {
        const rawValue = value
            .replace(/R\$\s*/g, '')
            .replaceAll('.', '')
            .replaceAll(',', '.');

        const numericalValue = parseFloat(rawValue);

        switch (inputField) {
            case 'proposal':
                if (
                    numericalValue >= (backendResponse.min_proposal || 0) &&
                    numericalValue <= (backendResponse.max_proposal || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.proposal
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

                if (
                    numericalValue < (backendResponse.min_proposal || 0) ||
                    numericalValue > (backendResponse.max_proposal || 0) ||
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
                    numericalValue >= (backendResponse.min_comission || 0) &&
                    numericalValue <= (backendResponse.max_comission || 0) &&
                    !isNaN(numericalValue) &&
                    numericalValue !== auxValues.commission
                ) {
                    setIsProposalButtonDisabled(false);
                } else {
                    setIsProposalButtonDisabled(true);
                }

                if (
                    numericalValue < (backendResponse.min_comission || 0) ||
                    numericalValue > (backendResponse.max_comission || 0) ||
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

    const onSubmit = async (data: any) => {
        setLoading(true);

        if (resultContainerRef.current) {
            resultContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
        data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
        data.outros_descontos = backendNumberFormat(data.outros_descontos) || 0;
        data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

        if (data.tipo_do_oficio === 'CREDITÓRIO') {

            const formattedDate = getCurrentFormattedDate().split('/').reverse().join('-');
            data.data_requisicao = formattedDate;
        }

        if (data.valor_aquisicao_total) {
            data.percentual_a_ser_adquirido = 1;
        } else {
            data.percentual_a_ser_adquirido = typeof data.percentual_a_ser_adquirido === 'string'
                ? Number(data.percentual_a_ser_adquirido.replace("%", "").replace(",", ".")) / 100
                : data.percentual_a_ser_adquirido / 100;
        }

        if (data.tribunal === 'TRF1' || data.tribunal === 'TRF6') {
            data.nao_incide_selic_no_periodo_db_ate_abril = true;
        }

        if (!data.regime) {
            data.regime = 'GERAL';
        }

        if (data.data_base > '2021-12-01') {
            data.incidencia_juros_moratorios = false;
        }

        if (data.ja_possui_destacamento) {
            data.percentual_de_honorarios = 0;
        } else {
            data.percentual_de_honorarios = typeof data.percentual_de_honorarios === 'string'
                ? Number(data.percentual_de_honorarios.replace("%", "").replace(",", ".")) / 100
                : data.percentual_de_honorarios / 100;
        }

        if (data.gerar_cvld) {
            data.upload_notion = true;
        }

        if (!data.estado_ente_devedor) {
            data.estado_ente_devedor = null;
        }

        if (!data.data_limite_de_atualizacao_check) {

            const formattedDate = getCurrentFormattedDate().split('/').reverse().join('-');
            data.data_limite_de_atualizacao = formattedDate;
        }

        if (data.gerar_cvld) {
            if (!isCPFOrCNPJValid(form.watch('cpf_cnpj') || "")) {
                MySwal.fire({
                    title: 'Ok, Houston...Temos um problema!',
                    text: 'O CPF ou CNPJ inserido é inválido. Por favor, tente novamente.',
                    icon: 'error',
                    showConfirmButton: true,
                });
                return;
            }

            data.cpf_cnpj = form.watch("cpf_cnpj");
        }

        try {
            const response = data.gerar_cvld
                ? await api.post('/api/lead-magnet/save/', data)
                : await api.post('/api/lead-magnet/', data);

            if (response.status === 200 || response.status === 201) {
                if (response.status === 201) {
                    toast.success('Dados salvos no Notion com Sucesso!', {
                        icon: <BiCheck className="fill-green-400 text-lg" />,
                    });
                }
                const results = response.data.result; // pega o resultado da requisição
                setBackendResponse(results);
                setShowResults(true);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.error || 'Erro ao salvar dados no Notion!', {
                    icon: <BiX className="fill-red-500 text-lg" />,
                });
            } else {
                toast.error(String(error));
            }
        } finally {
            setLoading(false);
        }
    };

    const saveProposalAndComission = async () => {
        setSavingProposalAndComission(true);
        const req = await api.patch(`/api/notion-api/broker/negotiation/${backendResponse.id}/`, {
            proposal: sliderValues.proposal,
            commission: sliderValues.comission,
        });

        if (req.status === 202) {
            toast.success('Proposta e comissão salvas com sucesso!', {
                icon: <BiCheck className="fill-green-400 text-lg" />,
            });
        }

        if (req.status === 400) {
            toast.error('Erro ao salvar proposta e comissão!', {
                icon: <BiX className="fill-red-500 text-lg" />,
            });
        }
        setSavingProposalAndComission(false);
    };

    useEffect(() => {
        setSliderValues({
            proposal: backendResponse.min_proposal,
            comission: backendResponse.max_comission,
        });

        setAuxValues({
            proposal: backendResponse.min_proposal,
            commission: backendResponse.max_comission,
        });

        if (proposalRef.current && comissionRef.current) {
            proposalRef.current.value = numberFormat(backendResponse.min_proposal);
            comissionRef.current.value = numberFormat(backendResponse.max_comission);
        }
    }, [backendResponse]);

    const vincularUsuario = form.watch('vincular_usuario');
    useEffect(() => {
        if (vincularUsuario) {
            setSaveInfoToNotion(true);
        } else {
            setSaveInfoToNotion(false);
        }
    }, [setSaveInfoToNotion, vincularUsuario]);

    return (
        <div
            className={`absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black-2/50 ${modalOpen ? 'visible opacity-100' : 'hidden opacity-0'}`}
        >
            <Fade
                className={`transform overflow-hidden transition-all duration-300 ${fullScreen ? 'h-full w-full' : '2xsm:h-[90%] 2xsm:w-11/12 lg:w-10/12 xl:h-4/5'}`}
                damping={0.1}
            >
                <div className="h-full w-full rounded-sm border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark 2xsm:text-sm md:text-base">
                    <div className="mb-10 flex max-h-[15%] gap-2">
                        <div className="flex-1 flex-col flex-wrap items-start justify-between gap-3 pb-0 sm:flex-nowrap">
                            <div className="flex w-full justify-center align-middle">
                                <h2 className="mt-1.5 flex select-none flex-col justify-center font-nexa text-3xl font-normal text-primary antialiased">
                                    Celer
                                </h2>
                                <p className="flex flex-col justify-center text-xs font-semibold text-primary">
                                    <Slash className="-mr-3 mt-1 h-5 w-5 -rotate-45 text-gray-200" />
                                </p>
                                <Image
                                    src="/images/logo/celer-ia-only-logo.svg"
                                    alt="Celer IA Engine"
                                    width={56}
                                    height={50}
                                    className="mt-[6.1px] select-none antialiased"
                                    aria-selected={false}
                                    draggable={false}
                                />
                            </div>
                            <p className="apexcharts-legend-text mt-0 text-center font-rooftop text-sm">
                                Nosso modelo de atualização de valores de precatórios e RPVs
                            </p>
                        </div>
                        <span
                            title={fullScreen ? 'minimizar' : 'maximizar'}
                            onClick={() => setFullScreen(!fullScreen)}
                            className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-600 ${fullScreen ? 'bg-slate-600' : ''}`}
                        >
                            {!fullScreen ? (
                                <GiResize className="text-lg" />
                            ) : (
                                <PiResize className="text-xl" />
                            )}
                        </span>
                        <span
                            title="fechar"
                            onClick={() => setModalOpen(false)}
                            className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-600`}
                        >
                            <BiX className="text-2xl" />
                        </span>
                    </div>

                    <div className="h-[80%] overflow-x-hidden overflow-y-scroll">
                        <div className="grid grid-cols-12 gap-4">
                            {/* form */}
                            <div className="col-span-12 p-3 xl:col-span-6">
                                {/* <div className="col-span-12 mx-auto flex w-full flex-col justify-center">
                  <UpdatePrecatorioButton setStateFunction={setOficioForm} />
                </div> */}
                                <CalcForm
                                    onSubmitForm={onSubmit}
                                    formConfigs={form}
                                    hasDropzone={false}
                                />
                            </div>

                            {/* results */}
                            <div
                                ref={resultContainerRef}
                                className="col-span-12 border-stroke px-4 pb-20 pt-3 dark:border-strokedark xl:col-span-6 xl:border-l"
                            >
                                {loading ? (
                                    <NewFormResultSkeleton />
                                ) : (
                                    <>
                                        {showResults ? (
                                            <div
                                                className={`relative flex flex-col ${form.watch('regime') === 'ESPECIAL' && !regimeEspecialExceptions.includes(form.watch("ente_devedor")!) ? 'pointer-events-none' : ''}`}
                                            >
                                                {form.watch("regime") === "ESPECIAL" && !regimeEspecialExceptions.includes(form.watch("ente_devedor")!) && (
                                                        <div className="absolute flex min-h-full w-full flex-col items-center justify-center bg-slate-700/90">
                                                            <h2 className="text-md w-full p-4 text-center font-satoshi font-medium uppercase">
                                                                Para ativos de regime{' '}
                                                                <span className="underline">
                                                                    especial
                                                                </span>{' '}
                                                                , os valores de proposta e comissão serão reavaliados conforme o ente devedor.
                                                            </h2>
                                                            <h3>
                                                                <span className="text-center text-sm">
                                                                    Contate um consultor Ativos para maiores informações
                                                                </span>
                                                            </h3>
                                                        </div>
                                                    )}
                                                <div className="mb-6 flex flex-col gap-2">
                                                    <h2 className="text-xl font-medium uppercase">
                                                        Tudo pronto!
                                                    </h2>
                                                    <p className="text-sm 2xsm:text-center sm:text-left">
                                                        Abaixo foram gerados os valores mínimos e
                                                        máximos de proposta e comissão. Mova os
                                                        sliders ou use os campos para alterar os
                                                        valores proporcionalmente.
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between gap-5 p-2 2xsm:flex-col sm:mb-4 md:flex-row">
                                                    <div className="flex flex-col md:items-center">
                                                        <h4 className="">Proposta Mínima</h4>
                                                        <span>
                                                            {numberFormat(
                                                                backendResponse.min_proposal,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center gap-1">
                                                        <div className="flex items-center text-sm font-medium">
                                                            <p className="w-full">
                                                                Proposta Atual:
                                                            </p>
                                                            <input
                                                                ref={proposalRef}
                                                                type="text"
                                                                onBlur={(e) => {
                                                                    e.target.value = formatCurrency(
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                                onChange={(e) =>
                                                                    changeInputValues(
                                                                        'proposal',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                className="ml-2 max-w-39 rounded-md border-none bg-gray-100 py-2 pl-1 pr-2 text-center text-sm font-medium text-body focus-visible:ring-body dark:bg-bodydark1/10 dark:text-bodydark dark:focus-visible:ring-snow"
                                                            />
                                                        </div>
                                                        <input
                                                            type="range"
                                                            step="0.01"
                                                            min={backendResponse.min_proposal}
                                                            max={backendResponse.max_proposal}
                                                            value={sliderValues.proposal}
                                                            onChange={(e) =>
                                                                handleProposalSliderChange(
                                                                    e.target.value,
                                                                    true,
                                                                )
                                                            }
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="">Proposta Máxima</h4>
                                                        <span>
                                                            {numberFormat(
                                                                backendResponse.max_proposal,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="my-4 h-px w-full bg-stroke dark:bg-strokedark sm:hidden"></div>

                                                <div className="flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="">Comissão Mínima</h4>
                                                        <span>
                                                            {numberFormat(
                                                                backendResponse.min_comission,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-1 flex-col items-center gap-1">
                                                        <div className="flex items-center text-sm font-medium">
                                                            <p className="">Comissão Atual:</p>
                                                            <input
                                                                ref={comissionRef}
                                                                type="text"
                                                                onBlur={(e) => {
                                                                    e.target.value = formatCurrency(
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                                onChange={(e) =>
                                                                    changeInputValues(
                                                                        'comission',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                className="ml-2 max-w-39 rounded-md border-none bg-gray-100 py-2 pl-1 pr-2 text-center text-sm font-medium text-body focus-visible:ring-body dark:bg-bodydark1/10 dark:text-bodydark dark:focus-visible:ring-snow"
                                                            />
                                                        </div>
                                                        <input
                                                            type="range"
                                                            step="0.01"
                                                            min={backendResponse.min_comission}
                                                            max={backendResponse.max_comission}
                                                            value={sliderValues.comission}
                                                            onChange={(e) =>
                                                                handleComissionSliderChange(
                                                                    e.target.value,
                                                                    true,
                                                                )
                                                            }
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <h4 className="">Comissão Máxima</h4>
                                                        <span>
                                                            {numberFormat(
                                                                backendResponse.max_comission,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* separator */}
                                                <div className="my-6 h-px w-full bg-stroke dark:bg-strokedark"></div>
                                                {/* end separator */}

                                                <div className="flex flex-col">
                                                    {errorMessage && (
                                                        <p className="w-full text-center text-xs font-medium text-red">
                                                            Valor&#40;res&#41; fora do escopo
                                                            definido
                                                        </p>
                                                    )}

                                                    {backendResponse.id && (
                                                        <Button
                                                            disabled={isProposalButtonDisabled}
                                                            onClick={saveProposalAndComission}
                                                            className={`mx-auto mt-4 flex items-center justify-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 ${(form.watch("regime") === "ESPECIAL" && !regimeEspecialExceptions.includes(form.watch("ente_devedor")!)) && "!opacity-0"}`}
                                                        >
                                                            {savingProposalAndComission ? (
                                                                <>
                                                                    Salvando dados...
                                                                    <AiOutlineLoading className="animate-spin text-lg" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Salvar Proposta e Comissão
                                                                    <BiSave className="text-lg text-white" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mx-auto flex w-fit flex-col items-center justify-between gap-5">
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
                                                <span className="select-none text-center text-sm">
                                                    Opa! Parece que ainda não há resultados
                                                    disponíveis.
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        </div>
    );
};

export default NewForm;
