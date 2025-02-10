import UseMySwal from '@/hooks/useMySwal';
import api from '@/utils/api';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { GlowingEffect } from '../Effects/Glowing';
import { convertToBase64 } from '@/utils/pdf';
import '/src/css/animations/glow-effect.css';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    setStateFunction: React.Dispatch<React.SetStateAction<any>>;
}

export const UpdatePrecatorioButton: React.FC<SubmitButtonProps> = ({
    setStateFunction,
    children,
    ...props
}) => {
    const {
        register,
        formState: { errors },
    } = useForm();

    const [oficio, setOficio] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);

    const progressBarRef = useRef<HTMLDivElement>(null)

    const loadOficio = async (pdf: any) => {
        setLoading(true);

        const interval = setInterval(() => {
            if (progressBarRef.current) {
                const currentWidthInPixels = progressBarRef.current.offsetWidth;
                const parentWidthInPixels = progressBarRef.current.parentElement!.offsetWidth;
                const currentPercentage = (currentWidthInPixels / parentWidthInPixels) * 100;
                const newPercentage = currentPercentage + 1;
                progressBarRef.current.style.width = `${newPercentage}%`;
            }
        }, 300);

        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pdfBase64: pdf }),
            });

            if (response.status === 200) {
                swal.fire({
                    title: 'Ofício carregado com sucesso',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    position: 'bottom-right',
                    confirmButtonText: 'Ok',
                });
                progressBarRef.current!.style.backgroundColor = "#0e9f6e";
                progressBarRef.current!.style.width = "100%";
                setOficio(await response.json().then((data) => data));
                clearInterval(interval)
            }
        } catch (error: any) {
            swal.fire({
                title: 'Erro ao carregar ofício',
                text: error.message,
                icon: 'error',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                position: 'bottom-right',
                confirmButtonText: 'Ok',
            });
            progressBarRef.current!.style.backgroundColor = "#cc4b4c";
        } finally {
            setLoading(false);
            setInterval(() => {
                if (progressBarRef.current) {
                    progressBarRef.current.style.backgroundColor = "#212c39";
                    progressBarRef.current.style.width = "0%";
                }
            }, 1000)
        }
    };

    useEffect(() => {
        if (oficio) {
            setStateFunction(oficio);
        }
    }, [oficio]);

    const swal = UseMySwal();

    return (
        <div className="flex w-full justify-end">
            <div className="relative flex w-full cursor-pointer flex-col items-center py-4">
                <label
                    htmlFor="dropzone-file"
                    className={`${loading && "glow-effect"} relative flex h-20 w-full flex-col items-center justify-center rounded-lg border bg-slate-50 cursor-pointer hover:text-strokedark dark:bg-boxdark-2  dark:hover:text-white`}
                >
                    <div className="relative z-2 text-center text-sm">
                        <AiOutlineCloudUpload
                            className={`text-4xl mx-auto`}
                        />
                        <p className="p-1">
                            <b>Clique</b>, ou arraste um ofício em PDF
                        </p>
                    </div>
                    <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={2}
                    />
                    <input
                        type="file"
                        id="dropzone-file"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        {...register('pdfBase64')}
                        accept=".pdf"
                        onChange={async (e) => {
                            if (e.target.files) {
                                const file = e.target.files[0];
                                const base64 = await convertToBase64(file);
                                loadOficio(base64);
                            }
                        }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files) {
                                const file = e.dataTransfer.files[0];
                                const base64 = await convertToBase64(file);
                                loadOficio(base64);
                            }
                        }}
                    />
                    <div
                        ref={progressBarRef}
                        style={{ width: `0%`, maxWidth: "100%" }}
                        className='absolute inset-0 z-1 bg-slate-200 dark:bg-slate-700/30 rounded-md transition-width ease-in-out duration-300'>

                    </div>
                </label>
                <span
                    className="apexcharts-legend-text mt-2 w-full text-center text-gray-400"
                    style={{ fontSize: '10px', fontWeight: '400', fontFamily: 'Satoshi' }}
                >
                    {loading ? (
                        <>
                            <strong>CelerAI</strong> está pensando...
                        </>
                    ) : (
                        <>
                            TRF1 ao TRF4 (beta)
                        </>
                    )}
                </span>
            </div>
        </div>
    );
};
