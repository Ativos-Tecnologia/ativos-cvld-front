"use client"
import React from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Controller, useForm } from 'react-hook-form';
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
    state: string,
    country: string,
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

    React.useEffect(() => {
        if (data?.user_info) {
            setValue('full_name', data.user_info.full_name);
            setValue('adress', data.user_info.adress);
            setValue('CPF', data.user_info.CPF || '')
            setValue('adress_number', data.user_info.adress_number);
            setValue('neighborhood', data.user_info.neighborhood);
            setValue('postal_code', data.user_info.postal_code);
            setValue('city', data.user_info.city);
            setValue('state', data.user_info.state);
            setValue('country', data.user_info.country);
        }
    }, [data])

    return (
        <React.Fragment>
            <h1 className='text-2xl text-gray-500 font-bold text-center mb-10'>
                Preencha as informações para a compra
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 max-w-203 max-h-90 mx-auto px-3 text-black overflow-y-auto'>
                <div className='flex gap-4 2xsm:flex-col md:flex-row'>
                    <label htmlFor="full_name" className='relative grid flex-1 gap-1'>
                        <span>Nome completo *</span>
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
                                    className={`${errors.full_name ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.full_name && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="adress" className='relative grid flex-1 gap-1'>
                        <span>Endereço de cobrança *</span>
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
                                    className={`${errors.adress ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.adress && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                </div>
                <div className='flex gap-4 2xsm:flex-col md:flex-row'>
                    <label htmlFor="CPF" className='relative grid gap-1 select-none'>
                        <span>CPF</span>
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
                                    className={`${errors.CPF ? 'border-red' : 'border-slate-300'} opacity-70 cursor-not-allowed rounded-lg shadow-1 text-black-2`}
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
                        <span>Número *</span>
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
                                    className={`${errors.adress_number ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.adress_number && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="neighborhood" className='relative grid w-full gap-1'>
                        <span>Bairro</span>
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
                                    className={`${errors.neighborhood ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.neighborhood && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                </div>
                <div className='flex gap-4 2xsm:flex-col md:flex-row'>
                    <label htmlFor="postal-code" className='relative grid gap-1'>
                        <span>CEP *</span>
                        <Controller
                            name='postal_code'
                            control={control}
                            rules={
                                { required: true }
                            }
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='text'
                                    className={`${errors.postal_code ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 focus:ring-0 text-black-2`}

                                />
                            )}
                        />
                        {errors.postal_code && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="city" className='relative grid gap-1'>
                        <span>Cidade *</span>
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
                                    className={`${errors.city ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.city && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="state" className='relative grid w-full gap-1'>
                        <span>Estado *</span>
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
                                    className={`${errors.state ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 w-full focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.state && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                    <label htmlFor="country" className='relative grid w-full gap-1' >
                        <span>País *</span>
                        <Controller
                            name='country'
                            control={control}
                            rules={
                                { required: true }
                            }
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='text'
                                    className={`${errors.country ? 'border-red' : 'border-slate-300'} rounded-lg shadow-1 w-full focus:ring-0 text-black-2`}
                                />
                            )}
                        />
                        {errors.country && (
                            <span className='absolute -bottom-4.5 left-1 text-red text-xs'>
                                campo obrigatório
                            </span>
                        )}
                    </label>
                </div>
                <div className='flex gap-3 items-center justify-end'>
                    <button onClick={() => {
                        changeStep(currentStep - 1)
                    }} className='flex items-center gap-1 py-2 px-3 rounded-md hover:bg-slate-200 transition-all duration-200'>
                        <BiChevronLeft />
                        <span>Voltar</span>
                    </button>
                    <button className='flex items-center text-snow gap-1 py-2 px-3 rounded-md bg-[#3147d9] hover:bg-[#172789] transition-all duration-200'>
                        <span>Avançar</span>
                        <BiChevronRight />
                    </button>
                </div>
            </form>
        </React.Fragment>
    )
}

export default FormModal