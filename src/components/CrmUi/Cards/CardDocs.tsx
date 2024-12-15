import { cn } from '@/lib/utils'
import React, { HTMLAttributes } from 'react';

//CSS import
import './cardStyle.css'
import { LuFileX2 } from 'react-icons/lu';

const CardDocs = ({ children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
    return (
        <div {...props} className={cn('col-span-1 grid gap-4 bg-white shadow-6 dark:bg-boxdark-2 rounded-md p-5', props.className)}>
            {children}
        </div>
    )
};

const CardDocsHeader = ({ children, ...props }: HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => {
    return (
        <h2 {...props} className={cn('font-medium', props.className)}>{children}</h2>
    )
};

const CardDocsBody = ({ children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
    return (
        <div {...props} className={cn("grid grid-cols-5 gap-4", props.className)}>
            {children}
        </div>
    )
};

const CardDocsDocPreviewWrapper = ({ children, ...props }: HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
}) => {
    return (
        <div {...props} className={cn('col-span-3 grid gap-4 border-r border-stroke dark:border-boxdark', props.className)}>
            {children}
        </div>
    )
};

const CardDocsPreview = ({ url, ...props }: { url: string } & HTMLAttributes<HTMLDivElement>) => {

    const splitType = url.split(".");
    const docType = splitType[splitType.length - 1].toLowerCase();

    const splitName = url.split("/");
    const docName = splitName[splitName.length - 1].toLowerCase().replaceAll("%", " ");

    return (
        <div
            {...props}
            className={cn("doc-preview group border border-zinc-200 dark:border-boxdark", props.className)}
        >
            {url && (
                <>
                    <img
                        src={docType !== "pdf" ? url : "/images/pdf.svg"}
                        alt='imagem do arquivo'
                        className='w-full h-full'
                    />

                    {/* triangle */}
                    <div className={`absolute z-1 -top-0.5 right-0 w-0 h-0 border-t-[40px] border-t-transparent border-r-[40px] ${docType !== "pdf" ? "border-r-[#a7a7a7]" : "border-r-[#cc4b4c]"} rotate-90`} />

                    {/* hover effect */}
                    <div
                        onClick={props.onClick}
                        className='absolute w-full h-full flex flex-col gap-5 items-center justify-center text-snow text-sm bg-black-2/70 transition-opacity duration-300 group-hover:opacity-100 opacity-0 cursor-pointer'
                    >
                        <p className='max-w-[150px] break-words line-clamp-3'>
                            {docName.toUpperCase()}
                        </p>
                        <p className='font-medium'>Clique para visualizar</p>
                    </div>
                </>
            )} 
            
            {!url && (
                <>
                    {/* triangle */}
                    <div className={`absolute z-1 -top-0.5 right-0 w-0 h-0 border-t-[40px] border-t-transparent border-r-[40px] border-r-body dark:border-r-bodydark rotate-90`} />

                    <LuFileX2 className="text-8xl mx-auto m-auto" />
                </>
            )}
        </div>
    )
};

const CardDocsActions = ({ children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
    return (
        <div {...props} className={cn("col-span-2 flex flex-col gap-3", props.className)}>
            {children}
        </div>
    )
}

CardDocs.Header = CardDocsHeader;
CardDocs.Body = CardDocsBody;
CardDocs.DocPreviewWrapper = CardDocsDocPreviewWrapper;
CardDocs.Preview = CardDocsPreview;
CardDocs.Actions = CardDocsActions;

export default CardDocs;
