import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const PFdocsSkeleton = () => {
    return (
        <div className="flex items-center justify-between">

            <div className='flex gap-3 items-center justify-start'>
                {/* Skeleton do botão "Alterar Documento" */}
                <CustomSkeleton className="bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 h-8 w-36 rounded-md" />

                {/* Skeleton do ícone */}
                <CustomSkeleton className="bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 h-8 w-8 rounded-md" />
            </div>

            {/* Skeleton do badge "Aguardando análise" */}
            <CustomSkeleton className="bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 h-8 w-39 rounded-md" />
        </div>
    )
}

export default PFdocsSkeleton