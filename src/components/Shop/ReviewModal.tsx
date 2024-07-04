import React from 'react'
import { ShopProps } from '.'
import { BiChevronLeft, BiChevronRight, BiDollarCircle } from 'react-icons/bi'

const ReviewModal = ({ data, currentStep, changeStep }: {
    data: ShopProps | undefined,
    currentStep: number,
    changeStep: (step: number) => void
}) => {

    return (
        <React.Fragment>
            <h1 className='text-2xl font-bold text-center text-gray-500 mb-3'>
                Confira as informações
            </h1>
            <div className='flex h-90 mx-auto p-3 text-black overflow-y-auto'>
                <div className='flex flex-col gap-4 justify-between w-1/3 py-3 pr-10 pl-5 border-r border-slate-300'>
                    <h2 className='text-xl font-bold text-gray-500'>
                        Informações do Pacote
                    </h2>
                    <ul className='flex flex-col gap-2 border-y border-stroke py-8'>
                        <li className='flex justify-between items-center'>
                            <span className='bg-snow font-bold text-gray-500'>nome do pacote </span>
                            <span className='bg-snow'>{data?.plan.title.toLowerCase()}</span>
                        </li>
                        <li className='flex justify-between'>
                            <span className='font-bold text-gray-500'>{data?.plan.features[0].split(' ')[1]}</span>
                            <span className='flex gap-0.5 items-center'>
                                {data?.plan.features[0].split(' ')[0]}
                                <BiDollarCircle className="w-4 h-4 text-yellow-300" />
                            </span>
                        </li>
                        <li className='flex justify-between'>
                            <span className='font-bold text-gray-500'>qntd de {data?.plan.features[1].split(' ')[1]}</span>
                            <span>{data?.plan.features[1].split(' ')[0]}x</span>
                        </li>
                        <li className='flex justify-between'>
                            <span className='font-bold text-gray-500'>tipo do {data?.plan.features[2].split(' ')[0].toLowerCase()}</span>
                            <span>{data?.plan.features[2].split(' ')[1].toLowerCase()}</span>
                        </li>
                    </ul>

                    <div className=''>
                        <h2 className='font-medium'>
                            Total
                        </h2>
                        <span className='text-2xl font-bold text-gray-500'>
                            {data?.plan.price},00
                        </span>
                    </div>
                </div>
                <div className='flex flex-col justify-between w-2/3 py-3 pr-5 pl-10'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-500 mb-4'>
                            Informações do Cliente
                        </h2>
                        <ul className='grid gap-2 grid-cols-2 border-y border-stroke py-8'>
                            {/* {data?.user_info && (
                                <React.Fragment>
                                    {Reflect.ownKeys(data?.user_info).map((key: any) => (
                                        <li>
                                            <span className='font-bold text-gray-500 mr-2'>
                                                {String(key)}:
                                            </span>
                                            <span>
                                                {(data.user_info as any)[key as keyof typeof data.user_info]}
                                            </span>
                                        </li>
                                    ))}
                                </React.Fragment>
                            )} */}
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    Nome:
                                </span>
                                <span>
                                    {data?.user_info.full_name}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    Endereço de cobrança:
                                </span>
                                <span>
                                    {data?.user_info.adress}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    Número:
                                </span>
                                <span>
                                    {data?.user_info.adress_number}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    Bairro:
                                </span>
                                <span>
                                    {data?.user_info.neighborhood}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    CPF:
                                </span>
                                <span>
                                    {data?.user_info.CPF}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    CEP:
                                </span>
                                <span>
                                    {data?.user_info.postal_code}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    Cidade:
                                </span>
                                <span>
                                    {data?.user_info.city}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    Estado:
                                </span>
                                <span>
                                    {data?.user_info.state}
                                </span>
                            </li>
                            <li>
                                <span className='font-bold text-gray-500 mr-2'>
                                    País:
                                </span>
                                <span>
                                    {data?.user_info.country}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className='flex gap-3 items-center justify-end'>
                        <button onClick={() => {
                            changeStep(currentStep - 1)
                        }} className='flex items-center gap-1 py-2 px-3 rounded-md hover:bg-slate-200 transition-all duration-200'>
                            <BiChevronLeft />
                            <span>Voltar</span>
                        </button>
                        <button onClick={() => {
                            changeStep(currentStep + 1)
                        }} className='flex items-center text-snow gap-1 py-2 px-3 rounded-md bg-green-400 hover:bg-green-500 transition-all duration-200'>
                            <span>Finalizar</span>
                            <BiChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ReviewModal
