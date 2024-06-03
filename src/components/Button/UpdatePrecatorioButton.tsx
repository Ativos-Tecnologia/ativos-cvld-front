import React, { useEffect } from 'react'
import { FileInput, Label } from "flowbite-react";
import api from '@/utils/api';
import {
  Controller,
  useForm,
} from "react-hook-form";
import UseMySwal from '@/hooks/useMySwal';

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

  useEffect(() => {
    if (oficio) {
      setStateFunction(oficio);
    }
  }, [oficio]);

  const swal = UseMySwal();

  return (
    <div className="flex w-full items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
        <FileInput id="dropzone-file" className="hidden" {...register("pdf_file")} accept='.pdf' onChange={async (e) => {
          if (e.target.files) {
            if (e.target.files[0].size > 10000000) {
              swal.fire({
                title: "Erro ao carregar ofício",
                text: "O arquivo não pode ser maior que 10MB",
                icon: "error",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                position: "bottom-right",
                confirmButtonText: "Ok",
              });
              const formData = new FormData();
              formData.append("pdf_file", e.target.files[0]);

              try {
                const response = await api.post("api/oficio/upload/extraction/", formData, {
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
          }
        }} />
      </Label>
    </div>
  )
}
