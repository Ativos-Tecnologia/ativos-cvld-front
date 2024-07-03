import React from 'react'
import { RiCheckboxBlankCircleFill, RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from 'react-icons/ri'

const Steps = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className='relative p-3 flex justify-between w-203 mx-auto mb-5'>
            {/* line beyond the steps */}
            <div className='absolute top-1/2 w-11/12 h-px bg-slate-400'></div>
            {/* steps */}
            <div className='relative flex z-1 items-center gap-2 px-2 bg-[#f1f1f1]'>
                {currentStep > 0 ? <RiCheckboxCircleFill className='fill-green-500' /> : <RiCheckboxBlankCircleFill className='fill-[#3147d9]' />}

                <span className={`${currentStep > 0 && 'text-green-500'}`}>Escolha do pacote</span>
            </div>
            <div className='relative flex z-1 items-center gap-2 px-2 bg-[#f1f1f1]'>
                {currentStep < 1 && <RiCheckboxBlankCircleLine />}
                {currentStep === 1 && <RiCheckboxBlankCircleFill className='fill-[#3147d9]' />}
                {currentStep > 1 && <RiCheckboxCircleFill className='fill-green-500' />}
                <span>Informações</span>
            </div>
            <div className='relative flex z-1 items-center gap-2 px-2 bg-[#f1f1f1]'>
                <RiCheckboxBlankCircleLine />
                <span>Revise seu pedido</span>
            </div>
        </div>
    )
}

export default Steps