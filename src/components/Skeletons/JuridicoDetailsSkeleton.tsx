import CustomSkeleton from '../CrmUi/CustomSkeleton'

const JuridicoDetailsSkeleton = () => {
    return (
        <div className="flex flex-col w-full gap-5">
            <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-boxdark p-5 rounded-md">
                <div className="flex items-center gap-3">
                    <CustomSkeleton type='title' className='w-8 h-10' />
                    <CustomSkeleton type='title' className='w-35 h-10' />
                </div>
                <CustomSkeleton type='title' className='w-15 h-10' />
            </div>

            <div className="flex items-center justify-center dark:bg-boxdark bg-white rounded-md p-4">
                <CustomSkeleton type='title' className='w-2/6 h-18' />
            </div>

            <div className='grid grid-cols-4 3xl:grid-cols-5 gap-6 p-4 rounded-md bg-white dark:bg-boxdark'>
                <div className='flex flex-col gap-2 xl:col-span-2'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-full h-9' />
                </div>
                <div className='flex flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-80 h-9' />
                </div>
            </div>

            <div className='col-span-4 w-full rounded-md bg-white dark:bg-boxdark'>
                <div className='col-span-4 w-full'>
                    <CustomSkeleton type='title' className='text-bodydark2 font-medium' />
                </div>
                <div className='flex gap-4'>
                    <CustomSkeleton type='content' className='m-5 w-40 h-6' />
                    <CustomSkeleton type='content' className='m-5 w-40 h-6' />
                </div>
                
                <div className='flex px-5 flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-80 h-8' />
                </div>
                <div className='flex gap-4'>
                    <CustomSkeleton type='content' className='m-5 w-30 h-8' />
                    <CustomSkeleton type='content' className='m-5 w-30 h-8' />
                </div>
            </div>


            <div className='grid grid-cols-4 3xl:grid-cols-5 gap-6 p-4 rounded-md bg-white dark:bg-boxdark'>
                <div className='flex flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-full h-9' />
                </div>
                <div className='flex flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-full h-9' />
                </div>
                <div className='flex flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-full h-9' />
                </div>
                <div className='flex flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-full h-9' />
                </div>
                <div className='flex flex-col gap-2 xl:col-span-1'>
                    <CustomSkeleton type='title' className='w-28 h-5' />
                    <CustomSkeleton type='content' className='w-full h-9' />
                </div>
            </div>

            <div className='w-full rounded-md bg-white dark:bg-boxdark flex flex-col gap-6 p-4'>
                <CustomSkeleton type='content' className='w-39 h-6' />
                <CustomSkeleton type='content' className='w-80 h-10' />
            </div>

            <div className='bg-white dark:bg-boxdark rounded-md p-4'>
                <div className='grid grid-cols-4 3xl:grid-cols-5 gap-6 mb-8'>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                    <div className='flex flex-col gap-2 xl:col-span-1'>
                        <CustomSkeleton type='title' className='w-28 h-5' />
                        <CustomSkeleton type='content' className='w-full h-9' />
                    </div>
                </div>

                <div className='grid grid-cols-4 3xl:grid-cols-5 gap-6 mt-8'>
                    <div className='col-span-2 3xl:col-span-3 grid grid-cols-2 gap-6'>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                        <div className='col-span-1'>&nbsp;</div>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                        <div className='col-span-1'>&nbsp;</div>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                        <div className='col-span-1'>&nbsp;</div>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                        <div className='col-span-1'>&nbsp;</div>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                        <div className='col-span-1'>&nbsp;</div>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                        <div className='col-span-1'>&nbsp;</div>
                        <CustomSkeleton type='content' className='col-span-1 h-5' />
                    </div>
                    <div className='col-span-2 3xl:col-span-2 flex flex-col gap-6'>
                        <CustomSkeleton type='title' className='w-80 h-7' />
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center justify-between'>
                                <CustomSkeleton type='title' className='w-20 h-6' />
                                <CustomSkeleton type='content' className='w-33 h-11' />
                            </div>
                            <CustomSkeleton type='content' className='w-full h-3' />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center justify-between'>
                                <CustomSkeleton type='title' className='w-20 h-6' />
                                <CustomSkeleton type='content' className='w-33 h-11' />
                            </div>
                            <CustomSkeleton type='content' className='w-full h-3' />
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-center gap-6 mt-8'>
                    <CustomSkeleton type='content' className='w-30 h-6' />
                    <CustomSkeleton type='content' className='w-30 h-6' />
                </div>

                <div className='flex items-center justify-center gap-6 mt-8'>
                    <CustomSkeleton type='content' className='w-35 h-9' />
                    <CustomSkeleton type='content' className='w-35 h-9' />
                    <CustomSkeleton type='content' className='w-35 h-9' />
                </div>
            </div>

        </div>
    )
}

export default JuridicoDetailsSkeleton