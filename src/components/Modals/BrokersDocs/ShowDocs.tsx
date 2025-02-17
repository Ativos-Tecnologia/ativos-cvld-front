import Image from 'next/image';
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
    const [docName, setDocName] = useState<string>('');

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
    }, [src]);

    if (!isOpen || !mounted) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-9999 justify-center bg-black-2/80">
            {/* header */}
            <div className="flex items-center justify-between bg-black-2 px-5 py-2">
                <p
                    title={docName}
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-white 2xsm:max-w-75 md:max-w-100 xl:max-w-270"
                >
                    {docName}
                </p>

                <div className="flex items-center gap-4">
                    <Link
                        title="Baixar documento"
                        href={src}
                        target="_blank"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-300 hover:bg-slate-700"
                    >
                        <FaFileDownload className="text-xl text-white" />
                    </Link>

                    <button
                        title="fechar"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 hover:bg-slate-700"
                    >
                        <BiX className="text-xl text-white" />
                    </button>
                </div>
            </div>

            {/* doc container */}
            <div
                className="overflow-y-auto py-10 2xsm:px-5 md:px-20"
                style={{ height: 'calc(100vh - 48px)' }}
            >
                <Suspense fallback={<p>Carregando documento...</p>}>
                    <Image src={src} width={500} height={600} className="mx-auto" alt="" />
                </Suspense>
            </div>
        </div>,
        document.body,
    );
};

export default DocVisualizer;
