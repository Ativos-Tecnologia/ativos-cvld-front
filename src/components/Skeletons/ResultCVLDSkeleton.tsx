import React from 'react';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

type SkeletonProps = 'width' | 'height';

const ResultCVLDSkeleton = () => {

    const setRandomWidth = (option: SkeletonProps) => {
        switch (option) {
            case 'width':
                return Math.floor(Math.random() * (290 - 220 + 1) + 220);
            case 'height':
                return Math.floor(Math.random() * (22 - 14 + 1) + 14);
            default:
                break;
        }
    }

    return (
        <div className="p-[30px] flex flex-col rounded gap-2 col-span-12 xl:col-span-4 bg-white shadow-default dark:bg-boxdark">
            <div className="pb-4">
                <CustomSkeleton
                    type='title'
                    className="w-[250px] h-[22px] mb-2 rounded-md"
                />
                <CustomSkeleton
                    type='title'
                    className="w-[150px] h-[22px] rounded-md"
                />
            </div>
            <div className="flex flex-col gap-2">
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
                <CustomSkeleton
                    type='content'
                    style={{
                        width: `${setRandomWidth('width')}px`
                    }}
                    className="h-[14px]"
                />
            </div>
        </div>
    )
}

export default ResultCVLDSkeleton
