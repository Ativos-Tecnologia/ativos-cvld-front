import React from 'react';
import { cn } from "@/lib/utils";

const skeletonTypes = {
    "title": "bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 before:bg-snow/30",
    "content": "bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 before:bg-snow/30"
}

const CustomSkeleton = ({ className, type = "title", ...props }: React.HTMLAttributes<HTMLDivElement> & { 
    className?: string,
    type: keyof typeof skeletonTypes
}) => {
    return (
        <div {...props} className={cn(`relative w-full h-full rounded-md overflow-hidden ${skeletonTypes[type]} before:content-[''] before:w-[50%] before:h-full before:absolute before:top-0 before:left-0 before:blur before:-translate-x-100 before:animate-skeleton-pass`, className)}></div>
    )
}

export default CustomSkeleton