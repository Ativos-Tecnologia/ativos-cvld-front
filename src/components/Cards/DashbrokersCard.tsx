import numberFormat from '@/functions/formaters/numberFormat'
import React, { useEffect, useState } from 'react'
import CustomCheckbox from '../CrmUi/Checkbox';
import { BiPlus } from 'react-icons/bi';
import { BsCheckCircleFill, BsFillPatchCheckFill } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa';

const DashbrokersCard = () => {

    /* ====> value states <==== */
    const [proposalValue, setProposalValue] = useState({ min: 15000, max: 30000 });
    const [comissionValue, setComissionValue] = useState({ min: 7500, max: 9500 });
    const [sliderValues, setSliderValues] = useState({
        proposal: 0,
        comission: 0,
    });

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

    useEffect(() => {
        setSliderValues({
            proposal: proposalValue.min,
            comission: comissionValue.max,
        });
    }, [proposalValue, comissionValue]);

    return (
        <div className="col-span-1 grid gap-5 bg-white dark:bg-boxdark p-5 rounded-md border border-stroke dark:border-strokedark">
            {/* ----> info <----- */}
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5 flex flex-1 flex-col gap-3">
                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>Nome do Credor:</p>
                        <p
                            title='Título'
                            className='max-w-[215px] text-ellipsis overflow-hidden whitespace-nowrap'
                        >
                            Luiz Inado da Silva Maciel
                        </p>
                    </div>

                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>CPF/CNPJ:</p>
                        <p>113.633.374-67</p>
                    </div>

                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>TRIBUNAL</p>
                        <p
                            title='Título'
                            className='max-w-[215px] text-ellipsis overflow-hidden whitespace-nowrap'
                        >
                            Tribunal Regional Federal 1
                        </p>
                    </div>

                    <div>
                        <p className='text-black dark:text-snow uppercase font-medium'>esfera:</p>
                        <p>FEDERAL</p>
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
                    <div className='flex gap-1 items-center justify-center w-fit ml-auto'>
                        <CustomCheckbox />
                        <span className='text-sm font-medium'>Proposta Aceita</span>
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
                                    min={proposalValue.min}
                                    max={proposalValue.max}
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
                                    min={comissionValue.min}
                                    max={comissionValue.max}
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
                        <textarea
                            className='w-full rounded-md placeholder:text-sm border-stroke dark:border-strokedark dark:bg-boxdark-2/50 resize-none'
                            rows={4}
                            placeholder='Insira uma observação'
                        />
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
