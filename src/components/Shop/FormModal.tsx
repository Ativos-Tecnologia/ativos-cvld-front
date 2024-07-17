"use client"
import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { ShopProps } from '.';
import InputMask from 'react-input-mask';

export type ShopFormProps = {
    full_name: string,
    adress: string,
    CPF: string,
    adress_number: string,
    neighborhood: string,
    postal_code: string,
    city: string,
    state: string
}

const FormModal = ({ data, currentStep, changeStep, setData }: {
    data: ShopProps | undefined,
    currentStep: number,
    changeStep: (step: number) => void,
    setData: React.Dispatch<React.SetStateAction<any>>,
}) => {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm<ShopFormProps>();

    const onSubmit = (formData: ShopFormProps) => {
        setData((prevData: ShopProps) => ({
            ...prevData,
            user_info: formData
        }))
        changeStep(currentStep + 1);
    }

    const searchCEP = async (cep: string) => {

        try {
            const req = fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
            const res = await req;
            const cepData = await res.json();
            setValue('postal_code', `${cepData.cep?.slice(0, 5)}-${cepData.cep?.slice(5)}`);
            setValue('adress', cepData.street);
            setValue('neighborhood', cepData.neighborhood);
            setValue('city', cepData.city);
            setValue('state', cepData.state);
        } catch (error) {
            console.table('API indisponível no momento. Tente novamente mais tarde.')
        }

    }

    React.useEffect(() => {
        if (data?.user_info) {
            setValue('full_name', data.user_info.full_name);
            setValue('adress', data.user_info.adress);
            setValue('CPF', data.user_info.CPF)
            setValue('adress_number', data.user_info.adress_number);
            setValue('neighborhood', data.user_info.neighborhood);
            setValue('postal_code', data.user_info.postal_code);
            setValue('city', data.user_info.city);
            setValue('state', data.user_info.state);
        }
    }, [data])

    return (
        <React.Fragment>
            <h1 className='text-2xl font-bold text-center mb-10'>
                Preencha as informações para a compra
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 max-w-203 max-h-90 mx-auto px-3 overflow-y-auto'>
                <div className='flex gap-4 2xsm:flex-col md:flex-row'>
                    <label htmlFor="full_name" className='relative grid flex-1 gap-1'>
                        <span className='text-meta-5'>Nome completo *</span>
                        <Controller
                            name='full_name'
                            control={control}
                            rules={
                                { required: true }
                            }
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='text'
                                    placeholder='Ex: Carlos Antônio da Silva'
                                    className={`${errors.full_name ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 rounded-lg shadow-1 focus:ring-0 dark:bg-slate-600 dark:text-snow`}
                                />
                            )}
                        />
                        {errors.full_name && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="postal-code" className='relative grid gap-1'>
                        <span className='text-meta-5'>CEP *</span>
                        <Controller
                            name='postal_code'
                            control={control}
                            defaultValue=""
                            rules={
                                {
                                    required: 'CEP é obrigatório',
                                    // pattern: {
                                    //     value: /^\d{5}-\d{3}$/,
                                    //     message: "CEP inválido"
                                    // }
                                }
                            }
                            render={({ field }) => (
                                <InputMask
                                    {...field}
                                    type='text'
                                    mask="99999-999"
                                    onBlur={(e) => searchCEP(e.target.value)}
                                    placeholder='Ex: 12345-678'
                                    className={`${errors.postal_code ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 rounded-lg shadow-1 dark:bg-slate-600 dark:text-snow`}
                                />
                            )}
                        />
                        {errors.postal_code && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                </div>
                <div className='flex gap-4 2xsm:flex-col md:flex-row'>
                    <label htmlFor="adress" className='relative grid flex-1 gap-1'>
                        <span className='text-meta-5'>Endereço de cobrança *</span>
                        <Controller
                            name='adress'
                            control={control}
                            rules={
                                { required: true }
                            }
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='text'
                                    placeholder='Ex: Rua da Alegria'
                                    className={`${errors.adress ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 rounded-lg shadow-1 focus:ring-0 dark:bg-slate-600 dark:text-snow`}
                                />
                            )}
                        />
                        {errors.adress && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="CPF" className='relative grid gap-1 select-none'>
                        <span className='text-meta-5'>CPF</span>
                        <Controller
                            name='CPF'
                            control={control}
                            rules={{
                                required: 'CPF é obrigatório',
                                pattern: {
                                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                    message: "CPF inválido"
                                }
                            }}
                            // disabled={true}
                            defaultValue='113.633.374-67'
                            render={({ field }) => (
                                <InputMask
                                    {...field}
                                    type='text'
                                    mask="999.999.999-99"
                                    readOnly
                                    className={`${errors.CPF ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 opacity-70 cursor-not-allowed rounded-lg shadow-1 dark:bg-slate-600 dark:text-snow`}
                                />
                            )}
                        />
                        {errors.CPF && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="adress_number" className='relative grid gap-1'>
                        <span className='text-meta-5'>Número *</span>
                        <Controller
                            name='adress_number'
                            control={control}
                            rules={
                                { required: true }
                            }
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='text'
                                    placeholder='Ex: 123'
                                    className={`${errors.adress_number ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 rounded-lg shadow-1 focus:ring-0 dark:bg-slate-600 dark:text-snow`}
                                />
                            )}
                        />
                        {errors.adress_number && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                </div>
                <div className='flex gap-4 2xsm:flex-col md:flex-row'>
                    <label htmlFor="neighborhood" className='relative grid 2xsm:w-full md:w-3/5 gap-1'>
                        <span className='text-meta-5'>Bairro</span>
                        <Controller
                            name='neighborhood'
                            control={control}
                            rules={
                                { required: true }
                            }
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='text'
                                    placeholder='Ex: Centro'
                                    className={`${errors.neighborhood ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 rounded-lg shadow-1 focus:ring-0 dark:bg-slate-600 dark:text-snow`}
                                />
                            )}
                        />
                        {errors.neighborhood && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <div className='2xsm:grid 2xsm:grid-cols-2 gap-2 md:flex md:grid-cols-none'>
                        <label htmlFor="city" className='relative grid gap-1'>
                            <span className='text-meta-5'>Cidade *</span>
                            <Controller
                                name='city'
                                control={control}
                                rules={
                                    { required: true }
                                }
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type='text'
                                        placeholder='Ex: São Paulo'
                                        className={`${errors.city ? 'border-red' : 'border-slate-300'} w-full placeholder:text-slate-400 rounded-lg shadow-1 focus:ring-0 dark:bg-slate-600 dark:text-snow`}
                                    />
                                )}
                            />
                            {errors.city && (
                                <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                    campo obrigatório
                                </span>
                            )}
                        </label>
                        <label htmlFor="state" className='relative grid gap-1'>
                            <span className='text-meta-5'>Estado *</span>
                            <Controller
                                name='state'
                                control={control}
                                rules={
                                    { required: true }
                                }
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type='text'
                                        placeholder='Ex: SP'
                                        className={`${errors.state ? 'border-red' : 'border-slate-300'} placeholder:text-slate-400 rounded-lg shadow-1 w-full focus:ring-0 dark:bg-slate-600 dark:text-snow`}
                                    />
                                )}
                            />
                            {errors.state && (
                                <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                    campo obrigatório
                                </span>
                            )}
                        </label>
                    </div>
                </div>
                <div className='flex gap-3 items-center 2xsm:justify-center md:justify-end'>
                    <button id='back-btn' onClick={() => {
                        changeStep(currentStep - 1)
                    }} className='flex items-center gap-1 py-2 px-3 rounded-md hover:bg-slate-200 dark:hover:text-gray-500 transition-all duration-200'>
                        <BiChevronLeft />
                        <span>Voltar</span>
                    </button>
                    <button id='next-btn' className='flex items-center text-snow gap-1 py-2 px-3 rounded-md bg-[#3147d9] hover:bg-[#172789] transition-all duration-200'>
                        <span>Avançar</span>
                        <BiChevronRight />
                    </button>
                </div>
            </form>
        </React.Fragment>
    )
}

export default FormModal