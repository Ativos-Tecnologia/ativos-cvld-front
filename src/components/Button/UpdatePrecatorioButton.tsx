import React, { useEffect } from 'react'
import { CustomFlowbiteTheme, FileInput, Flowbite, Label } from "flowbite-react";
import api from '@/utils/api';
import {
  Controller,
  useForm,
} from "react-hook-form";
import UseMySwal from '@/hooks/useMySwal';
import { BiCloudUpload } from 'react-icons/bi';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode,
  setStateFunction: React.Dispatch<React.SetStateAction<any>>,
}

export const UpdatePrecatorioButton: React.FC<SubmitButtonProps> = ({
  setStateFunction,
  children,
  ...props
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getFieldState,
    setValue,
    formState: { errors },
  } = useForm();

  const [oficio, setOficio] = React.useState<any>(null);

  const loadOficio = async (data: FormData) => {

    try {
      const response = await api.post("api/oficio/upload/extraction/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (response.status === 200) {
        swal.fire({
          title: "Ofício carregado com sucesso",
          icon: "success",
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          position: "bottom-right",
          confirmButtonText: "Ok",
        });
        setOficio(response.data);
      }
    } catch (error: any) {
      swal.fire({
        title: "Erro ao carregar ofício",
        text: error.message,
        icon: "error",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        position: "bottom-right",
        confirmButtonText: "Ok",
      });
    }
  }

  useEffect(() => {
    if (oficio) {
      setStateFunction(oficio);
    }
  }, [oficio]);

  const swal = UseMySwal();

  return (
    <div className="relative flex w-full items-center justify-center cursor-pointer">
      <label htmlFor="dropzone-file" className='relative flex h-18 flex-col items-center justify-center w-full bg-slate-50 dark:bg-black/50 border-2 border-dashed rounded-lg hover:border-strokedark hover:text-strokedark dark:hover:border-white dark:hover:text-white transition-all duration-150 ease-in-out'>
        <BiCloudUpload className='w-full h-8' />
        <div className='text-center text-sm'>
          <p><b>Clique</b>, ou arraste um ofício</p>
          <p>PDF</p>
        </div>
        <input type='file' id="dropzone-file" className='absolute opacity-0 w-full h-full inset-0 cursor-pointer' {...register("pdf_file")} accept='.pdf' onChange={(e) => {
          if (e.target.files) {
            const formData = new FormData();
            formData.append("pdf_file", e.target.files[0]);
            loadOficio(formData);
          }
        }}
          onDrop={e => {
            e.preventDefault();
            if (e.dataTransfer.files) {
              const formData = new FormData();
              formData.append("pdf_file", e.dataTransfer.files[0]);
              loadOficio(formData);
            }
          }}
        />
      </label>
      {/* <Label
        htmlFor="dropzone-file"
        className="flex h-24 w-full cursor-pointer flex-col items-center text-slate-500/90 justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-2 pt-2">
          <svg
            className="mb-0 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400 px-2" style={{ textAlign: "center" }}>
            <span className="font-semibold">Clique</span>, arraste ou solte um ofício
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
        </div>
        <FileInput id="dropzone-file" className='absolute w-full h-full inset-0' {...register("pdf_file")} accept='.pdf' onChange={(e) => {
          if (e.target.files) {
            loadOficio(e);
          }
        }}
          onDragEnter={e => {
            e.preventDefault()
            console.log('drag enter')
          }}
          onDrop={e => {
            e.preventDefault();
            console.log(e.dataTransfer.files);
          }}
        />
      </Label> */}
    </div>
  )
}
