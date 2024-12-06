import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const NewFormResultSkeleton = () => {
    return (
        <div className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2 mb-6'>
                <h2 className='text-lg'>Gerando resultado...</h2>
                <CustomSkeleton type='title' className='h-4' />
                <CustomSkeleton type='title' className='h-4'/>
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
    )
}

export default NewFormResultSkeleton