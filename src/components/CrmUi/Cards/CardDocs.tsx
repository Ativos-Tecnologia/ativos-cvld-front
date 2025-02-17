import React, { HTMLAttributes } from 'react';
import Image from 'next/image';
import pdfImage from '../../../../public/images/pdf.svg';
import { cn } from '@/lib/utils';

//CSS import
import './cardStyle.css';
import { LuFileX2 } from 'react-icons/lu';

const CardDocs = ({
    children,
    ...props
}: HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
    return (
        <div
            {...props}
            className={cn(
                'grid gap-4 rounded-md bg-white p-5 shadow-6 dark:bg-boxdark 2xsm:col-span-2 lg:col-span-1',
                props.className,
            )}
        >
            {children}
        </div>
    );
};

const CardDocsHeader = ({
    children,
    ...props
}: HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => {
    return (
        <h2 {...props} className={cn('font-medium', props.className)}>
            {children}
        </h2>
    );
};

const CardDocsBody = ({
    children,
    ...props
}: HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
    return (
        <div
            {...props}
            className={cn(
                'grid grid-cols-6 2xsm:gap-8 md:gap-4 lg:gap-8 xl:gap-4',
                props.className,
            )}
        >
            {children}
        </div>
    );
};

const CardDocsDocPreviewWrapper = ({
    children,
    ...props
}: HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
}) => {
    return (
        <div
            {...props}
            className={cn(
                'grid gap-4 2xsm:col-span-6 md:col-span-3 lg:col-span-6 xl:col-span-3 xl:border-r xl:border-stroke xl:dark:border-form-strokedark',
                props.className,
            )}
        >
            {children}
        </div>
    );
};

const CardDocsPreview = ({ url, ...props }: { url: string } & HTMLAttributes<HTMLDivElement>) => {
    const splitType = url.split('.');
    const docType = splitType[splitType.length - 1].toLowerCase();

    const splitName = url.split('/');
    const docName = splitName[splitName.length - 1].toLowerCase().replaceAll('%', ' ');

    return (
        <div
            {...props}
            className={cn(
                'doc-preview group border border-zinc-200 dark:border-boxdark',
                props.className,
            )}
        >
            {url && (
                <>
                    <Image
                        src={docType !== 'pdf' ? url : pdfImage}
                        alt="imagem do arquivo"
                        className="h-full w-full"
                    />

                    {/* triangle */}
                    <div
                        className={`absolute -top-0.5 right-0 z-1 h-0 w-0 border-r-[40px] border-t-[40px] border-t-transparent ${docType !== 'pdf' ? 'border-r-[#a7a7a7]' : 'border-r-[#cc4b4c]'} rotate-90`}
                    />

                    {/* hover effect */}
                    <div
                        onClick={(e) => {
                            if (docType !== 'pdf') {
                                props.onClick;
                            } else {
                                e.stopPropagation();
                            }
                        }}
                        className="absolute flex h-full w-full cursor-pointer flex-col items-center justify-center gap-5 bg-black-2/70 text-sm text-snow opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                        <p className="line-clamp-3 max-w-[150px] break-words">
                            {docName.toUpperCase()}
                        </p>
                        {docType !== 'pdf' && <p className="font-medium">Clique para visualizar</p>}
                    </div>
                </>
            )}

            {!url && (
                <>
                    {/* triangle */}
                    <div
                        className={`absolute -top-0.5 right-0 z-1 h-0 w-0 rotate-90 border-r-[40px] border-t-[40px] border-r-body border-t-transparent dark:border-r-bodydark`}
                    />

                    <LuFileX2 className="m-auto mx-auto text-8xl" />
                </>
            )}
        </div>
    );
};

const CardDocsActions = ({
    children,
    ...props
}: HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => {
    return (
        <div
            {...props}
            className={cn(
                'flex flex-col gap-3 2xsm:col-span-6 md:col-span-3 md:place-items-end lg:col-span-6 lg:place-items-center xl:col-span-3',
                props.className,
            )}
        >
            {children}
        </div>
    );
};

CardDocs.Header = CardDocsHeader;
CardDocs.Body = CardDocsBody;
CardDocs.DocPreviewWrapper = CardDocsDocPreviewWrapper;
CardDocs.Preview = CardDocsPreview;
CardDocs.Actions = CardDocsActions;

export default CardDocs;
