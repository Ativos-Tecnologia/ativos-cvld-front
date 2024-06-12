"use client";
import { Button, Modal } from 'flowbite-react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { BiEnvelope, BiMailSend } from 'react-icons/bi';
import { AiOutlineLoading } from 'react-icons/ai';

type ChangePasswordProps = {
  recovery_email: string;
};


const ForgotPassword = () => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ChangePasswordProps>();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const a = watch("recovery_email");
  console.log(a);

  const onCloseModal = () => setOpenModal(false);
  const onSubmit = (data: ChangePasswordProps) => {
    setLoading(true);
    console.log(data);
  };


  return (
    <div className='mb-6'>
      <p onClick={() => setOpenModal(true)} className="text-primary text-sm font-medium mb-6 cursor-pointer">
        Esqueci a senha
      </p>
      <Modal show={openModal} size="sm" position='bottom-center' onClose={onCloseModal} popup className='bg-black'>
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

                {/* <ErrorMessage errors={errors} field='recovery_email' /> */}

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
      </Modal>
    </div>
  )
}

export default ForgotPassword
