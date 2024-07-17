import React from 'react'
import { RiCheckboxBlankCircleFill, RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from 'react-icons/ri'

const Steps = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className='relative py-3 flex justify-between lg:w-full xl:w-203 mx-auto mb-5 '>
            {/* line beyond the steps */}
            <div className='absolute top-1/2 w-11/12 h-px bg-slate-400'></div>
            {/* steps */}
            <div className='relative flex 2xsm:flex-col 2xsm:max-w-25 md:w-max z-1 items-center gap-2 px-2 bg-snow dark:bg-boxdark'>
                {currentStep > 1 ? <RiCheckboxCircleFill className='fill-green-500' /> : <RiCheckboxBlankCircleFill className='fill-[#3147d9]' />}
                <span className={`${currentStep > 1 && 'text-green-500'} 2xsm:text-center 2xsm:text-sm 2xsm:leading-none`}>Escolha do pacote</span>
            </div>
            <div className='relative flex 2xsm:flex-col 2xsm:max-w-25 z-1 items-center gap-2 px-2 2xsm:px-3 bg-snow dark:bg-boxdark'>
                {currentStep < 2 && <RiCheckboxBlankCircleLine />}
                {currentStep === 2 && <RiCheckboxBlankCircleFill className='fill-[#3147d9]' />}
                {currentStep > 2 && <RiCheckboxCircleFill className='fill-green-500' />}
                <span className={`${currentStep > 2 && 'text-green-500'} 2xsm:text-center 2xsm:text-sm  2xsm:leading-none`}>Informações do pedido</span>
            </div>
            <div className='relative flex 2xsm:flex-col 2xsm:max-w-25 z-1 items-center gap-2 px-2 bg-snow dark:bg-boxdark'>
                {currentStep < 3 && <RiCheckboxBlankCircleLine />}
                {currentStep === 3 && <RiCheckboxBlankCircleFill className='fill-[#3147d9]' />}
                {currentStep > 3 && <RiCheckboxCircleFill className='fill-green-500' />}
                <span className={`${currentStep > 3 && 'text-green-500'} 2xsm:text-center 2xsm:text-sm 2xsm:leading-none`}>Revise seu pedido</span>
            </div>
        </div>
    )
}

export default Steps