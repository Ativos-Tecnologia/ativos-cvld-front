"use client";

import React from 'react'
import { BiCheck, BiChevronRight, BiX } from 'react-icons/bi';
import { ShopProps } from '.';

const availablesPlans = [
  {
    type: 'BÁSICO',
    title: '1º GRAU',
    price: 'R$50',
    offer: {
      state: false,
      text: 'none'
    },
    features: [
      '50 créditos',
      '10 cálculos',
      'Suporte Básico'
    ]
  },
  {
    type: 'PREMIUM',
    title: 'TRIBUNAL',
    price: 'R$197',
    offer: {
      state: true,
      text: '-21% OFF'
    },
    features: [
      '100 créditos',
      '20 cálculos',
      'Suporte Padrão'
    ]
  },
  {
    type: 'EMPRESARIAL',
    title: 'SUPERIOR',
    price: 'R$739',
    offer: {
      state: true,
      text: '-26% OFF'
    },
    features: [
      '1000 créditos',
      '200 cálculos',
      'Suporte Prioritário'
    ]
  },
  {
    type: 'MELHOR ESCOLHA',
    title: 'SUPREMO',
    price: 'R$1.600',
    offer: {
      state: true,
      text: '-36% OFF'
    },
    features: [
      '2500 créditos',
      '500 cálculos',
      'Suporte Dedicado'
    ]
  }
];

const PricingModal = ({ setData, changeStep, currentStep }: {
  setData: React.Dispatch<React.SetStateAction<any>>,
  changeStep: (i: number) => void,
  currentStep: number
}) => {

  return (
    <React.Fragment>
      <div className='flex flex-col items-center justify-center gap-3 mb-10'>
        <h1 className='font-bold text-2xl text-center'>
        Escolha um pacote de créditos
        </h1>
        {/* <p className='text-xl max-w-100 text-center'>
          pacotes com preços para equipes de todos os tamanhos
        </p> */}
      </div>
      <div className='flex justify-center gap-3 h-90 xl:h-100 flex-wrap 2xsm:overflow-y-auto '>
        {/* card */}
        {availablesPlans.map((plan, index) => (
          <React.Fragment key={index}>
            {plan.type !== 'MELHOR ESCOLHA' ? (
              <div className='w-70 h-fit flex flex-col xl:flex-1 gap-11 rounded-md bg-white border border-stroke dark:bg-boxdark-2 dark:border-strokedark shadow-3 px-3 py-6'>
                <div className='relative grid gap-2 pb-3 border-b border-stroke'>
                  <span className='py-1 px-2 rounded-full bg-[#3147d9] w-fit text-xs text-snow'>
                    {plan.type}
                  </span>
                  <h2 className='text-2xl font-semibold text-gray-500 dark:text-white'>
                    {plan.title}
                  </h2>
                  {plan.offer.state && (
                    <div className='absolute -bottom-8 right-3 w-17 h-17 rounded-full bg-[#f00211] flex flex-col items-center justify-center text-snow font-semibold rotate-12 shadow-2'>
                      <span>{plan.offer.text.split(' ')[0]}</span>
                      <span>{plan.offer.text.split(' ')[1]}</span>
                      <div className='absolute w-24 h-0.5 -rotate-45 rounded-md bg-[#880f17]'></div>
                    </div>
                  )}
                </div>
                <ul className='flex flex-col gap-3'>
                  {plan.features.map((feature, index) => (
                    <li className='flex items-center gap-4' key={index}>
                      <BiCheck className='w-6 h-6 text-meta-3' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className='flex items-center justify-between border-t border-stroke pt-3'>
                  <div>
                    <span className='text-xl font-bold text-gray-500 dark:text-white'>{plan.price},00 </span>
                    {/* <span className='text-xs'>/ pacote</span> */}
                  </div>
                  <button onClick={() => {
                    changeStep(currentStep + 1);
                    setData((prevData: ShopProps) => ({
                      ...prevData,
                      plan: plan
                    }))
                  }} className='flex gap-1 items-center justify-center bg-[#3147d9] hover:bg-[#172789] py-2 px-3 rounded-full text-snow transition-all duration-200'>
                    <span className='text-sm font-semibold'>COMPRAR</span>
                    <BiChevronRight className='w-5 h-5' />
                  </button>
                </div>
              </div>
            ) : (
              <div className='w-70 h-fit flex flex-col xl:flex-1 gap-11 rounded-md bg-white border border-stroke dark:bg-boxdark-2 dark:border-strokedark shadow-3 px-3 py-6'>
                <div className='relative grid gap-2 pb-3 border-b border-stroke'>
                  <span className='py-1 px-2 rounded-full bg-[#f00211] w-fit text-xs text-snow'>
                    {plan.type}
                  </span>
                  <h2 className='text-2xl font-semibold text-gray-500 dark:text-white'>
                    {plan.title}
                  </h2>
                  {plan.offer.state && (
                    <div className='absolute -bottom-8 right-3 w-17 h-17 rounded-full bg-[#f00211] flex flex-col items-center justify-center text-snow font-semibold rotate-12'>
                      <span>{plan.offer.text.split(' ')[0]}</span>
                      <span>{plan.offer.text.split(' ')[1]}</span>
                      <div className='absolute w-24 h-0.5 -rotate-45 rounded-md bg-[#880f17]'></div>
                    </div>
                  )}
                </div>
                <ul className='flex flex-col gap-3'>
                  {plan.features.map((feature, index) => (
                    <li className='flex items-center gap-4' key={index}>
                      <BiCheck className='w-6 h-6 text-meta-3' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className='flex items-center justify-between border-t border-stroke pt-3'>
                  <div>
                    <span className='text-lg font-bold text-gray-500 dark:text-white'>{plan.price},00 </span>
                    {/* <span className='text-xs'>/ pacote</span> */}
                  </div>
                  <button onClick={() => {
                    changeStep(currentStep + 1);
                    setData((prevData: ShopProps) => ({
                      ...prevData,
                      plan: plan
                    }))
                  }} className='flex gap-1 items-center justify-center bg-[#f00211] hover:bg-[#b4212b] py-2 px-3 rounded-full text-snow transition-all duration-200'>
                    <span className='text-sm font-semibold'>COMPRAR</span>
                    <BiChevronRight className='w-5 h-5' />
                  </button>
                </div>
              </div>
            )}

          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  )
}

export default PricingModal
