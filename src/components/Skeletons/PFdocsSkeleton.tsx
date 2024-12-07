import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const PFdocsSkeleton = () => {
    return (
        <div className="flex items-center justify-between">

            <div className='flex gap-3 items-center justify-start'>
                {/* Skeleton do botão "Alterar Documento" */}
                <CustomSkeleton type='title' className="h-8 w-36 rounded-md" />

                {/* Skeleton do ícone */}
                <CustomSkeleton type='content' className="h-8 w-8 rounded-md" />
            </div>

            {/* Skeleton do badge "Aguardando análise" */}
            <CustomSkeleton type='title' className="h-8 w-39 rounded-md" />
        </div>
    )
}

export default PFdocsSkeleton