'use client'
import React, { useEffect } from 'react'
import { AiFillHome } from 'react-icons/ai';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {

    useEffect(() => {
        console.log(error)
    }, [error])

    return (
        // <div className='bg-gray h-screen flex flex-col items-center justify-center'>
        //     <div className='w-150 bg-snow shadow-2 rounded-md p-5 flex flex-col items-center justify-center'>
        //         <h1 className='text-3xl text-center mb-5 font-bold'>
        //             OOOPS!
        //         </h1>
        //         <Image
        //             src={'/images/illustration/illustration-01.svg'}
        //             alt='mulher perto de uma placa de erro'
        //             width={300}
        //             height={300}
        //         />
        //         <p className='my-5 text-center'>
        //             {error.message}
        //         </p>
        //         <button
        //             onClick={() => reset()}
        //             className='px-3 py-2 bg-blue-700 hover:bg-blue-800 transition-colors duration-200 rounded-md text-snow'
        //         >
        //             Tente novamente
        //         </button>
        //     </div>
        // </div>
        <div className='h-screen flex flex-col items-center justify-center bg-snow'>

            <div className='grid grid-cols-2 gap-5'>
                <div className='col-span-1'>
                    <img
                        src={'/images/illustration/illustration-01.svg'}
                        alt='meme do the office'
                        className='w-full'
                    />
                </div>
                <div className='col-span-1 flex flex-col items-center pt-10'>
                    <h1 className='text-3xl text-center mb-5 font-bold'>
                        OOOPS!
                    </h1>
                    <p className='text-center'>
                        {error.message}
                    </p>
                    <p className='mb-5'>
                        Contate o administrador para mais informações.
                    </p>
                    <button
                        onClick={reset}
                        className='flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 transition-colors duration-200 rounded-md text-snow'
                    >
                        <AiFillHome />
                        Voltar para home
                    </button>
                </div>
            </div>

        </div>
    )
}
