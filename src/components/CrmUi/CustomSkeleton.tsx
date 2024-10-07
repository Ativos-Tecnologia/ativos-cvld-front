import React from 'react';
import { cn } from "@/lib/utils";

const CustomSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative w-full h-full bg-gray-400/10 rounded-md overflow-hidden before:content-[''] dark:before:bg-gray-400/10 before:bg-snow/30 before:w-[50%] before:h-full before:absolute before:top-0 before:left-0 before:blur before:-translate-x-100 before:animate-skeleton-pass", className)}></div>
    )
}

export default CustomSkeleton