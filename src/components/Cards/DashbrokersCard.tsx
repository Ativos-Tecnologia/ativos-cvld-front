import numberFormat from '@/functions/formaters/numberFormat'
import React, { useEffect, useState } from 'react'
import CustomCheckbox from '../CrmUi/Checkbox';
import { BiCheck, BiSave, BiX } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa';
import { Button } from '../Button';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import { toast } from 'sonner';

const DashbrokersCard = ({ oficio }: { oficio: NotionPage }) => {

    /* ====> value states <==== */
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0,
    });
    const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);

    // Função para atualizar a proposta e ajustar a comissão proporcionalmente
    const handleProposalSliderChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {

        // seta o valor do slide como o valor atual
        const newProposalSliderValue = parseFloat(e.target.value);
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
    };

    // Função para atualizar a comissão e ajustar a proposta proporcionalmente
    const handleComissionSliderChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {

        // seta o valor da slider como o atual
        const newComissionSliderValue = parseFloat(e.target.value);
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
    };

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
            comission: oficio.properties["(R$) Comissão Máxima - Celer"].number || 0,
        });
    }, [oficio]);

    console.log(oficio);

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
                            {/* <div className="relative flex flex-col items-center">
                                <h4 className="">Proposta Mínima</h4>
                                <span>{numberFormat(15000)}</span>
                            </div> */}
                            <div className="flex flex-1 flex-col items-center gap-1">
                                <span className="text-sm font-medium">
                                    Proposta Atual: {numberFormat(sliderValues.proposal)}
                                </span>
                                <input
                                    type="range"
                                    step="0.01"
                                    min={oficio.properties["(R$) Proposta Mínima - Celer"].formula?.number || 0}
                                    max={oficio.properties["(R$) Proposta Máxima - Celer"].formula?.number || 0}
                                    value={sliderValues.proposal}
                                    onChange={handleProposalSliderChange}
                                    className="w-full"
                                />
                            </div>
                            {/* <div className="flex flex-col items-center">
                                <h4 className="">Proposta Máxima</h4>
                                <span>{numberFormat(proposalValue.max)}</span>
                            </div> */}
                        </div>

                        <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                            {/* <div className="flex flex-col items-center">
                                <h4 className="">Comissão Mínima</h4>
                                <span>{numberFormat(comissionValue.min)}</span>
                            </div> */}
                            <div className="flex flex-1 flex-col items-center gap-1">
                                <span className="text-sm font-medium">
                                    Comissão Atual: {numberFormat(sliderValues.comission)}
                                </span>
                                <input
                                    type="range"
                                    step="0.01"
                                    min={oficio.properties["(R$) Comissão Mínima - Celer"].number || 0}
                                    max={oficio.properties["(R$) Comissão Máxima - Celer"].number || 0}
                                    value={sliderValues.comission}
                                    onChange={handleComissionSliderChange}
                                    className="w-full"
                                />
                            </div>
                            {/* <div className="flex flex-col items-center">
                                <h4 className="">Comissão Máxima</h4>
                                <span>{numberFormat(comissionValue.max)}</span>
                            </div> */}
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
