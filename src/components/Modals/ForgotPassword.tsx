"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { BiEnvelope, BiMailSend, BiX } from 'react-icons/bi';
import { AiOutlineLoading } from 'react-icons/ai';
import api from '@/utils/api';
import UseMySwal from '@/hooks/useMySwal';

type ChangePasswordProps = {
  state: boolean;
  setState: (state: boolean) => void;
  recovery_email?: string;
};


const ForgotPassword = ({ state, setState }: ChangePasswordProps) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangePasswordProps>();

  const [isSending, setIsSending] = useState<boolean>(false);
  const MySwal = UseMySwal();
  const modalRef = useRef<any>(null);

  const onCloseModal = () => {
    reset();
    setIsSending(false);
    setState(false);
  };

  const onSubmit = async (data: ChangePasswordProps) => {
    setIsSending(true);

    const response = await api.post('/api/reset-password/', {
      email: data.recovery_email
    });

    if (response.status === 200) {
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Em até 5min, um e-mail com o link de alteração de senha será enviado para o e-mail informado.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#1A56DB"
      }).then((result) => {
        if (result.isConfirmed) {
          reset();
          setState(false);
        }
      })
    } else {
      console.error('Aconteceu um problema ao enviar a requisição');
      MySwal.fire({
        icon: "error",
        title: "Oops!",
        text: "Ocorreu um erro ao enviar a solicitação",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#1A56DB"
      })
    }

    setIsSending(false);

  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modalRef.current) return;
      if (modalRef?.current?.contains(target)) return;
      setState(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });


  return (
    <div className={`${state ? 'opacity-100 visible' : 'opacity-0 invisible'} 
      fixed top-0 left-0 flex items-center justify-center w-screen h-screen z-1 bg-black-2/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-all duration-300 ease-in-out`}>
      <div ref={modalRef} className='relative w-11/12 xsm:w-100 h-fit rounded-lg bg-white p-10 border border-stroke dark:border-strokedark dark:bg-boxdark'>
        <span className='absolute top-4 right-4 cursor-pointer'>
          <BiX style={{ width: '26px', height: '26px', fill: '#BAC1CB' }} onClick={onCloseModal} />
        </span>
        <h2 className='text-graydark font-bold text-xl text-center mb-4 dark:text-white'>
          Informe o e-mail para a recuperação de senha
        </h2>
        <p className='block mx-auto text-sm  text-center mb-6'>
          Enviaremos um e-mail com um link para definir uma nova senha
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10">
            <div className="relative">
              <input
                type="email"
                placeholder="Digite seu email"
                className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.recovery_email && '!border-rose-400 border-2 !ring-0 dark:!border-meta-1'}`}
                id="email"
                {
                ...register("recovery_email", {
                  required: "Campo obrigatório",
                })
                }
              />

              <ErrorMessage errors={errors} field='recovery_email' />

              <span className="absolute right-4 top-4">
                <BiEnvelope style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
              </span>
            </div>
          </div>
          <Button type='submit' className={`${status === 'request_success' && 'bg-green-500'} flex items-center justify-center w-full cursor-pointer rounded-lg text-white hover:bg-opacity-90`}>
            <span className='text-[16px] font-medium'>
              {isSending ? "Enviando e-mail" : "Enviar"}
            </span>
          </Button>
        </form>
      </div>
      {/* <Modal show={state} size="sm" position='bottom-center' onClose={() => setState(false)} popup className='bg-black'>
        <Modal.Header />
        <Modal.Body>
          <h2 className='text-graydark font-medium text-xl text-center mb-2'>
            Informe o e-mail para a recuperação de senha
          </h2>
          <p className='block mx-auto text-sm  text-center mb-6'>
            enviaremos um e-mail com um link para definir uma nova senha
          </p>
          <form id='recovery_form' onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-10">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  id="email"
                  {
                  ...register("recovery_email", {
                    required: "Campo obrigatório",
                  })
                  }
                />

                <ErrorMessage errors={errors} field='recovery_email' />

                <span className="absolute right-4 top-4">
                  <BiEnvelope style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                </span>
              </div>
            </div>
            <Button gradientDuoTone="purpleToBlue" type='submit' className='flex items-center justify-center w-full cursor-pointer rounded-lg p-1 text-white hover:bg-opacity-90 dark:border-primary dark:bg-primary dark:hover:bg-opacity-90'>
              <span className="text-[16px] font-medium" aria-disabled={loading}>
                {loading ? "Definindo nova senha..." : "Confirmar"}
              </span>
              {
                !loading ? (<BiMailSend className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
              }
            </Button>
          </form>
        </Modal.Body>
      </Modal> */}
    </div>
  )
}

export default ForgotPassword
