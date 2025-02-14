import UseMySwal from '@/hooks/useMySwal';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { GlowingEffect } from '../Effects/Glowing';
import { convertToBase64 } from '@/utils/pdf';
import '/src/css/animations/glow-effect.css';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    setStateFunction: React.Dispatch<React.SetStateAction<any>>;
}

type RequestOficioProps = "requestPassed" | "requestFailed" | null;


const DropzoneContent = ({ requestOficioState }: { requestOficioState: RequestOficioProps }) => {
    return (
        <div className="relative z-2 text-center text-sm">
            {requestOficioState === "requestPassed" && (
                <>
                    <AiOutlineCheckCircle
                        className={`text-4xl mx-auto text-strokedark dark:text-white`}
                    />
                    <p className="p-1 text-strokedark dark:text-white">
                        Ofício carregado com sucesso.
                    </p>
                </>
            )}
            {requestOficioState === "requestFailed" && (
                <>
                    <AiOutlineCloseCircle
                        className={`text-4xl mx-auto text-strokedark dark:text-white`}
                    />
                    <p className="p-1 text-strokedark dark:text-white">
                        Houve um erro ao carregar o ofício.
                    </p>
                </>
            )}
            {requestOficioState === null && (
                <>
                    <AiOutlineCloudUpload
                        className={`text-4xl mx-auto text-strokedark dark:text-white`}
                    />
                    <p className="p-1 text-strokedark dark:text-white">
                        <b>Clique</b>, ou arraste um ofício em PDF
                    </p>
                </>
            )}
        </div>
    )
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
    const [requestOficioState, setRequestOficioState] = React.useState<RequestOficioProps>(null);

    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const updateProgress = () => {
        if (progressBarRef.current) {
            progressRef.current += 0.1 // Incremento menor para animação mais suave
            if (progressRef.current > 100) {
                progressRef.current = 100
                cancelAnimationFrame(rafRef.current!)
                return
            }

            progressBarRef.current.style.width = `${progressRef.current}%`;

            rafRef.current = requestAnimationFrame(updateProgress)
        }
    }

    const loadOficio = async (pdf: any) => {
        setLoading(true);

        rafRef.current = requestAnimationFrame(updateProgress);

        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pdfBase64: pdf }),
            });

            if (response.status === 200) {

                progressBarRef.current!.style.backgroundColor = "#0e9f6e";
                progressRef.current = 99;
                setRequestOficioState("requestPassed");
                setOficio(await response.json().then((data) => data));
                
            }
        } catch (error: any) {

            progressBarRef.current!.style.backgroundColor = "#cc4b4c";
            progressRef.current = 99;
            setRequestOficioState("requestFailed");

        } finally {
            // Aguarda antes de cancelar a animação
            await new Promise(resolve => setTimeout(resolve, 500))
            cancelAnimationFrame(rafRef.current!)
            setLoading(false);

            // Aguarda 2 segundos antes de resetar o progresso
            await new Promise(resolve => setTimeout(resolve, 2000))
            if (progressBarRef.current) {
                setRequestOficioState(null)
                progressBarRef.current.style.backgroundColor = "#212c39";
                progressBarRef.current.style.width = "0%";
                progressRef.current = 0;
            }
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
                    <DropzoneContent requestOficioState={requestOficioState} />

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
                    {loading && (
                        <>
                            <strong>CelerAI</strong> está pensando...
                        </>
                    )}
                </span>
            </div>
        </div>
    );
};
