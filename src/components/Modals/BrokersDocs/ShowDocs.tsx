import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BiX } from 'react-icons/bi';
import { FaFileDownload } from 'react-icons/fa';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
}

const DocVisualizer: React.FC<ModalProps> = ({ isOpen, onClose, src }) => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [docName, setDocName] = useState<string>("")

    useEffect(() => {
        setMounted(true);

        // Adiciona listener de tecla ESC para fechar o modal
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    useEffect(() => {
        const docNameSplitted = src.split('/');
        setDocName(docNameSplitted[docNameSplitted.length - 1]);
    }, [src])

    if (!isOpen || !mounted) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-9999 bg-black-2/80 justify-center">
            {/* header */}
            <div className="flex items-center bg-black-2 justify-between py-2 px-5">

                <p
                    title={docName}
                    className='text-white text-ellipsis overflow-hidden whitespace-nowrap 2xsm:max-w-75 md:max-w-100 xl:max-w-270'
                >
                    {docName}
                </p>

                <div className='flex items-center gap-4'>
                    <Link
                        title='Baixar documento'
                        href={src}
                        target="_blank"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-300 hover:bg-slate-700"
                    >
                        <FaFileDownload className="text-xl text-white" />
                    </Link>

                    <button
                        title='fechar'
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-700 transition-colors duration-300"
                    >
                        <BiX className="text-xl text-white" />
                    </button>
                </div>
            </div>

            {/* doc container */}
            <div
                className='py-10 overflow-y-auto 2xsm:px-5 md:px-20'
                style={{ height: 'calc(100vh - 48px)' }}
            >
                <Suspense fallback={<p>Carregando documento...</p>}>
                    <img src={src} width={500} height={600} className='mx-auto' />
                </Suspense>
            </div>
        </div>,
        document.body
    );
};

export default DocVisualizer;