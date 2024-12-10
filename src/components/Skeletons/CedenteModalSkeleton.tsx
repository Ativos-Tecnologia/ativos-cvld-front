import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const CedenteModalSkeleton = () => {
  return (
    <div className='flex flex-col gap-1 mb-8'>
        <CustomSkeleton type='content' className='h-6 w-55 rounded-md mb-1' />
        <CustomSkeleton type="title" className='h-9 w-full rounded-md' />
    </div>
  )
}

export default CedenteModalSkeleton
