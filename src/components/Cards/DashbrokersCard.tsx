import numberFormat from '@/functions/formaters/numberFormat'
import React, { useEffect, useRef, useState } from 'react'
import CustomCheckbox from '../CrmUi/Checkbox';
import { BiCheck, BiSave, BiX } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa';
import { Button } from '../Button';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import { toast } from 'sonner';
import { formatCurrency } from '@/functions/formaters/formatCurrency';

const DashbrokersCard = ({ oficio }: { oficio: NotionPage }) => {

    /* ====> value states <==== */
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0,
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
    const proposalRef = useRef<HTMLInputElement | null>(null);
    const comissionRef = useRef<HTMLInputElement | null>(null);
    console.log(oficio)

    // Função para atualizar a proposta e ajustar a comissão proporcionalmente
    const handleProposalSliderChange = (
        value: string,
        sliderChange: boolean
    ) => {

        // seta o valor do slide como o valor atual
        const newProposalSliderValue = parseFloat(value);
        setSliderValues((oldValues) => {
            return { ...oldValues, proposal: newProposalSliderValue };
        });

        // Calcular a proporção em relação a proposta e ajustar a comissão
        const proportion =
            (newProposalSliderValue - (oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0)) /
            ((oficio.properties["(R$) Proposta Máxima - Celer"].formula?.number || 0) - (oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0));

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
            (oficio.properties["(R$) Proposta Máxima - Celer"].formula?.number || 0) - proportion * ((oficio.properties["(R$) Proposta Máxima - Celer"].formula?.number || 0) - (oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0));

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
        switch (inputField) {
            case "proposal":
                setSliderValues(old => {
                    return {
                        ...old,
                        proposal: parseFloat(rawValue)
                    }
                });
                handleProposalSliderChange(rawValue, false);
                break;
            case "comission":
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

    useEffect(() => {

        setSliderValues({
            proposal: oficio.properties["Proposta Escolhida - Celer"].number || oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0,
            comission: oficio.properties["Comissão - Celer"].number || oficio.properties["(R$) Comissão Máxima - Celer"].number || 0,
        });

        if (proposalRef.current && comissionRef.current) {

            proposalRef.current.value = numberFormat(oficio.properties["Proposta Escolhida - Celer"].number || oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0)

            comissionRef.current.value = numberFormat(oficio.properties["Comissão - Celer"].number || oficio.properties["(R$) Comissão Máxima - Celer"].number || 0);

        }

    }, [oficio]);

    return (
        <div className="col-span-1 grid gap-5 bg-white dark:bg-boxdark p-5 rounded-md border border-stroke dark:border-strokedark">
            {/* ----> info <----- */}
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5 flex flex-1 flex-col gap-3">
                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>Nome do Credor:</p>
                        <p
                            title={oficio.properties["Credor"].title[0]?.text.content || "Não informado"}
                            className='max-w-[277px] text-ellipsis overflow-hidden whitespace-nowrap'
                        >
                            {oficio.properties["Credor"].title[0]?.text.content || "Não informado"}
                        </p>
                    </div>

                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>CPF/CNPJ:</p>
                        <p>{oficio.properties["CPF/CNPJ"].rich_text![0].text.content || "Não informado"}</p>
                    </div>

                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>TRIBUNAL</p>
                        <p
                            title={oficio.properties["Tribunal"].select?.name || "Não informado"}
                            className='max-w-[215px] text-ellipsis overflow-hidden whitespace-nowrap'
                        >
                            {oficio.properties["Tribunal"].select?.name || "Não informado"}
                        </p>
                    </div>

                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>esfera:</p>
                        <p>{oficio.properties["Esfera"].select?.name || "Não informado"}</p>
                    </div>

                    <button className='flex items-center justify-center gap-2 my-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300 text-sm'>
                        <FaRegFilePdf />
                        Juntar Documento
                    </button>

                    <div className="flex items-center gap-4 justify-between">
                        <div className='flex items-center gap-2'>
                            <BsCheckCircleFill className='text-green-400' />
                            <BsCheckCircleFill className='text-green-400' />
                            <BsCheckCircleFill className='text-green-400' />
                        </div>

                        <div className='py-1 px-2 bg-purple-600 uppercase rounded-md text-snow font-medium text-xs'>
                            precatório
                        </div>
                    </div>

                </div>

                {/* ----> divider <---- */}
                <div className='col-span-1 max-h-full w-[1px] bg-stroke dark:bg-slate-600 ml-6'></div>
                {/* ----> end divider <---- */}

                <div className="col-span-6 flex flex-col gap-5">
                    <div className='flex justify-between'>
                        <Button
                            onClick={saveProposalAndComission}
                            className='py-1 px-2 h-fit text-sm font-medium'>
                            {savingProposalAndComission ? "Salvando..." : "Salvar Proposta/Comissão"}
                        </Button>
                        <div className='flex gap-1 items-center justify-center w-fit ml-auto'>
                            <CustomCheckbox />
                            <span className='text-sm font-medium'>Proposta Aceita</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 max-h-fit'>
                        <div className="flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                            <div className="flex flex-1 flex-col items-center gap-1">
                                <div className="text-sm font-medium flex items-center">
                                    <p className="w-full">Proposta Atual:</p>
                                    <input
                                        ref={proposalRef}
                                        type="text"
                                        onBlur={e => {
                                            e.target.value = formatCurrency(e.target.value)
                                        }}
                                        onChange={e => changeInputValues("proposal", e.target.value)}
                                        className="max-w-39 text-center rounded-md border-none pr-2 pl-1 ml-2 py-2 text-sm font-medium text-body focus-visible:ring-body dark:focus-visible:ring-snow dark:bg-bodydark1/10 dark:text-bodydark bg-gray-100"
                                    />
                                </div>
                                <input
                                    type="range"
                                    step="0.01"
                                    min={oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0}
                                    max={oficio.properties["(R$) Proposta Máxima - Celer"].formula?.number || 0}
                                    value={sliderValues.proposal}
                                    onChange={e => handleProposalSliderChange(e.target.value, true)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                            <div className="flex flex-1 flex-col items-center gap-1">
                                <div className="text-sm font-medium flex items-center">
                                    <p className="">Comissão Atual:</p>
                                    <input
                                        ref={comissionRef}
                                        type="text"
                                        onBlur={e => {
                                            e.target.value = formatCurrency(e.target.value)
                                        }}
                                        onChange={e => changeInputValues("comission", e.target.value)}
                                        className="max-w-39 text-center rounded-md border-none pr-2 pl-1 ml-2 py-2 text-sm font-medium text-body focus-visible:ring-body dark:focus-visible:ring-snow dark:bg-bodydark1/10 dark:text-bodydark bg-gray-100"
                                    />
                                </div>
                                <input
                                    type="range"
                                    step="0.01"
                                    min={oficio.properties["(R$) Comissão Mínima - Celer"].number || 0}
                                    max={oficio.properties["(R$) Comissão Máxima - Celer"].number || 0}
                                    value={sliderValues.comission}
                                    onChange={e => handleComissionSliderChange(e.target.value, true)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ----> observations field <----- */}
                    <div className='w-full h-full'>
                        <p className='mb-2'>Observações:</p>
                        <div className='relative'>
                            <textarea
                                className='w-full rounded-md placeholder:text-sm border-stroke dark:border-strokedark dark:bg-boxdark-2/50 resize-none'
                                rows={4}
                                placeholder='Insira uma observação'
                            />
                            <Button className='absolute z-2 bottom-3 right-2 py-1 text-sm px-2'>
                                <BiSave className="text-lg" />
                            </Button>
                        </div>
                    </div>
                    {/* <div className='flex items-center justify-center'>
                        <button
                            title='Inserir uma observação'
                            className='flex items-center justify-center gap-2 py-1 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70 rounded-md transition-colors duration-300'>
                            <BiPlus className='text-xl' />
                            Observação
                        </button>
                    </div> */}
                    {/* ----> end observations field <----- */}
                </div>
            </div>
            {/* ----> end info <----- */}
        </div>
    )
}

export default DashbrokersCard
