import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const AutomatedProposalSkeleton = () => {
    return (
        <div className='flex flex-col 2xsm:p-10 md:my-20 gap-5'>
            <div>
                <h2 className="uppercase text-snow mb-3 text-xl">Aguarde um instante enquanto geramos o cálculo...</h2>
                <CustomSkeleton type='title' className='h-5 w-125' />
            </div>
            <div className='mt-10 grid gap-10 text-bodydark'>
                <div className='flex gap-2'>
                    <div className='flex flex-col basis-30 gap-2'>
                        <CustomSkeleton type='content' className='h-5' />
                        <CustomSkeleton type='content' className='h-5' />
                    </div>
                    <div className='flex items-center flex-1 justify-center'>
                        <CustomSkeleton type='content' className='h-5' />
                    </div>
                    <div className='flex flex-col basis-30 gap-2'>
                        <CustomSkeleton type='content' className='h-5' />
                        <CustomSkeleton type='content' className='h-5' />
                    </div>
                </div>

                <div className='flex gap-2'>
                    <div className='flex flex-col basis-30 gap-2'>
                        <CustomSkeleton type='content' className='h-5' />
                        <CustomSkeleton type='content' className='h-5' />
                    </div>
                    <div className='flex items-center flex-1 justify-center'>
                        <CustomSkeleton type='content' className='h-5' />
                    </div>
                    <div className='flex flex-col basis-30 gap-2'>
                        <CustomSkeleton type='content' className='h-5' />
                        <CustomSkeleton type='content' className='h-5' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AutomatedProposalSkeleton