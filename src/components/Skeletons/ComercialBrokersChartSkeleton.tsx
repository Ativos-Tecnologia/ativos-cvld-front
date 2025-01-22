import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const ComercialBrokersChartSkeleton = () => {
  return (
    <div className='grid gap-5 w-full'>
        <CustomSkeleton type='title' className='w-[250px] h-8' />

        <div className='grid gap-3'>
            <CustomSkeleton type='content' className='w-full h-80' />
            <div className='flex items-center justify-center gap-4'>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
                <CustomSkeleton type='title' className='w-28 h-5'/>
            </div>
        </div>
    </div>
  )
}

export default ComercialBrokersChartSkeleton