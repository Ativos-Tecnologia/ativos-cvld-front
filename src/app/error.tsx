'use client';
import React, { useEffect } from 'react';
import { AiFillHome } from 'react-icons/ai';
import illustration from '../../public/images/illustration/illustration-01.svg';
import Image from 'next/image';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-snow dark:bg-boxdark">
            <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                    <Image src={illustration} alt="meme do the office" className="w-full" />
                </div>
                <div className="col-span-1 flex flex-col items-center pt-10">
                    <h1 className="mb-5 text-center text-3xl font-bold">OOOPS, ALGO DEU ERRADO!</h1>
                    <div className="flex gap-2">
                        <span className="text-center font-medium italic">tipo:</span>
                        <span className="text-center font-light italic text-black-2 dark:text-white">
                            {error.name}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-center font-medium italic">erro:</span>
                        <span className="text-center font-light italic text-black-2 dark:text-white">
                            {error.message}
                        </span>
                    </div>
                    <p className="my-5">Contate o administrador para mais informações.</p>
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-snow transition-colors duration-200 hover:bg-blue-800"
                    >
                        <AiFillHome />
                        Voltar para home
                    </button>
                </div>
            </div>
        </div>
    );
}
