import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const MarketplaceSmallCardSkeleton = () => {
    return (
        <li className=' max-w-full'>
            <div className="bg-gray-400/15 dark:bg-gray-400/10 rounded-md h-full">
                <div
                    className='relative group p-2 cursor-pointer h-full'
                >
                    <div className='flex items-center justify-between h-12'>
                        <CustomSkeleton className='w-10 h-10 rounded-full' />
                        <CustomSkeleton className='w-30 h-7.5' />
                    </div>

                    {/* info */}
                    <div className='mt-5.5 flex flex-col gap-1.5'>
                        <CustomSkeleton className='h-5 w-full' />
                        <CustomSkeleton className='h-5 w-full' />
                    </div>
                    {/* end info */}

                </div>
            </div>
        </li>
    )
}

export default MarketplaceSmallCardSkeleton
