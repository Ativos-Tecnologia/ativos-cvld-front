import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton';


/**
 * Componente que renderiza o skeleton
 * do componente de card dos documentos
 * do cendente (view broker)
 * 
 * @returns {JSX.Element} - Componente Renderizado
 */
const CardDocsSkeleton = (): JSX.Element => {
    return (
        <>
            {/* wrapper */}
            <div className='col-span-1 grid gap-4 bg-gray-200 dark:bg-slate-800/70 rounded-md p-5'>

                {/* header */}
                <CustomSkeleton type='title' className='h-6 w-25 rounded-md' />

                {/* body */}
                <div className='grid grid-cols-5 gap-4'>
                    {/* preview wrapper */}
                    <div className='col-span-3 grid gap-4'>
                        <CustomSkeleton
                            type='title'
                            className='w-[165px] h-50 rounded-md mx-auto'
                        />
                        <CustomSkeleton
                            type='content'
                            className='h-7 w-[165px] rounded-md mx-auto'
                        />
                    </div>

                    {/* actions */}
                    <div className='col-span-2 flex flex-col gap-3'>
                        <CustomSkeleton
                            type="content"
                            className='w-full h-7 rounded-md'
                        />
                        <CustomSkeleton
                            type="content"
                            className='w-full h-7 rounded-md'
                        />
                        <CustomSkeleton
                            type="content"
                            className='w-full h-7 rounded-md'
                        />
                        <CustomSkeleton
                            type="content"
                            className='w-full h-7 rounded-md'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardDocsSkeleton;
