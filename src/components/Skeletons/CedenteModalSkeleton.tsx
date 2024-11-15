import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const CedenteModalSkeleton = () => {
  return (
    <div className='flex flex-col gap-1 mb-8'>
        <CustomSkeleton className='h-6 w-55 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded-md mb-1' />
        <CustomSkeleton className='h-9 w-full bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 rounded-md' />
    </div>
  )
}

export default CedenteModalSkeleton
