import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const MarketplaceCardSkeleton = () => {
    return (
        <li className='h-65 max-w-full px-0 xsm:min-w-95 xsm:px-2 md:px-3 md:min-w-[350px] lg:px-4 xl:h-65'>
            <div className="2xsm:px-0 xsm:px-4 h-55 max-w-95 overflow-hidden mb-4 bg-gray-400/10 dark:bg-boxdark/60 rounded-md">
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
        </li>
    )
}

export default MarketplaceCardSkeleton