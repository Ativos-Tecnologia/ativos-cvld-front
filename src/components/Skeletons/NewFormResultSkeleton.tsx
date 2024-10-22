import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const NewFormResultSkeleton = () => {
    return (
        <div className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2 mb-6'>
                <h2 className='text-lg'>Gerando resultado...</h2>
                <CustomSkeleton className='h-4' />
                <CustomSkeleton className='h-4'/>
            </div>

            <div className='flex gap-2'>
                <div className='flex flex-col basis-30 gap-2'>
                    <CustomSkeleton className='h-5' />
                    <CustomSkeleton className='h-5' />
                </div>
                <div className='flex items-center flex-1 justify-center'>
                    <CustomSkeleton className='h-5' />
                </div>
                <div className='flex flex-col basis-30 gap-2'>
                    <CustomSkeleton className='h-5' />
                    <CustomSkeleton className='h-5' />
                </div>
            </div>

            <div className='flex gap-2'>
                <div className='flex flex-col basis-30 gap-2'>
                    <CustomSkeleton className='h-5' />
                    <CustomSkeleton className='h-5' />
                </div>
                <div className='flex items-center flex-1 justify-center'>
                    <CustomSkeleton className='h-5' />
                </div>
                <div className='flex flex-col basis-30 gap-2'>
                    <CustomSkeleton className='h-5' />
                    <CustomSkeleton className='h-5' />
                </div>
            </div>
        </div>
    )
}

export default NewFormResultSkeleton