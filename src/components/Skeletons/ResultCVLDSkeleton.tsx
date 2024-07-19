import React from 'react';

type SkeletonProps = 'width' | 'height';

const ResultCVLDSkeleton = () => {

    const setRandomWidth = (option: SkeletonProps) => {
        switch (option) {
            case 'width':
                return Math.floor(Math.random() * (350 - 220 + 1) + 220);;
            case 'height':
                return Math.floor(Math.random() * (22 - 14 + 1) + 14);
            default:
                break;
        }
    }

    return (
        <div className="p-[30px] flex flex-col gap-2 w-[463px] animate-pulse bg-white shadow-default dark:bg-boxdark">
            <div className="pb-4">
                <div className="w-[250px] h-[22px] bg-slate-200 mb-2 rounded-md dark:bg-slate-300"></div>
                <div className="w-[150px] h-[22px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
            </div>
            <div className="flex flex-col gap-2">
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
                <div style={{
                    width: `${setRandomWidth('width')}px`
                }} className="h-[14px] bg-slate-200 rounded-md dark:bg-slate-300"></div>
            </div>
        </div>
    )
}

export default ResultCVLDSkeleton
