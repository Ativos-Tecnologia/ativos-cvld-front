import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const MarketplaceCardSkeleton = () => {
    return (
        <div className='h-65'>
            <div className="px-4 h-55 font-nexa max-w-95 overflow-hidden mb-4 bg-gray-400/10 dark:bg-boxdark/60 rounded-md">
                <div
                    className='relative group cursor-pointer p-4 h-full bg-center bg-cover flex flex-col justify-between'
                >
                    {/* icon */}
                    <CustomSkeleton className='w-10 h-10 rounded-full' />
                    {/* end icon */}

                    {/* info */}
                    <div className='w-full flex flex-col gap-2'>
                        <CustomSkeleton className='h-5 w-50' />
                        <CustomSkeleton className='h-6 w-30' />
                    </div>
                    {/* end info */}

                </div>
            </div>
        </div>
    )
}

export default MarketplaceCardSkeleton