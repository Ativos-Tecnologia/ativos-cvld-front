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
            <div className='2xsm:col-span-2 lg:col-span-1 grid gap-4 bg-gray-200 dark:bg-slate-800/70 rounded-md p-5'>

                {/* header */}
                <CustomSkeleton type='title' className='h-6 w-25 rounded-md' />

                {/* body */}
                <div className='grid grid-cols-6 2xsm:gap-8 md:gap-4 lg:gap-8 xl:gap-4'>
                    {/* preview wrapper */}
                    <div className='2xsm:col-span-6 md:col-span-3 lg:col-span-6 xl:col-span-3 grid gap-4'>
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
                    <div className='2xsm:col-span-6 md:col-span-3 md:place-items-end lg:col-span-6 lg:place-items-center xl:col-span-3 flex flex-col gap-3'>
                        <CustomSkeleton
                            type="content"
                            className='w-full md:max-w-44 lg:max-w-48 h-7 rounded-md'
                        />
                        <CustomSkeleton
                            type="content"
                            className='w-full md:max-w-44 lg:max-w-48 h-7 rounded-md'
                        />
                        <CustomSkeleton
                            type="content"
                            className='w-full md:max-w-44 lg:max-w-48 h-7 rounded-md'
                        />
                        <CustomSkeleton
                            type="content"
                            className='w-full md:max-w-44 lg:max-w-48 h-7 rounded-md'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardDocsSkeleton;
