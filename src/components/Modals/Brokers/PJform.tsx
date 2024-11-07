import { Button } from '@/components/Button';
import { BrokersContext } from '@/context/BrokersContext';
import { NotionPage, NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import queryClient from '@/utils/queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cleave from 'cleave.js/react';
import React, { useContext, useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal';
import { Controller, useForm } from 'react-hook-form';
import { BiCheck, BiTrash, BiX } from 'react-icons/bi';
import { BsFillCalendar2WeekFill } from 'react-icons/bs';
import { FaFemale, FaHome, FaMale, FaUniversity } from 'react-icons/fa';
import { FaBriefcase, FaFlag, FaUserLarge } from 'react-icons/fa6';
import { HiMiniIdentification } from 'react-icons/hi2';
import { MdAlternateEmail, MdPhone, MdPinDrop } from 'react-icons/md';
import { PiCityFill } from 'react-icons/pi';
import { RiRoadMapLine } from 'react-icons/ri';
import { TbBuildingEstate } from 'react-icons/tb';
import { TiWarning } from 'react-icons/ti';
import { toast } from 'sonner';

type FormValuesForPJ = {
  razao_social: string;
  cnpj: string;
  cep: string;
  bairro: string;
  celular: string;
  email: string;
  estado: string;
  logradouro: string;
  numero: number | string;
  complemento?: string;
  municipio: string;
  socio_representante: any;
  relacionado_a: string;
}


const PJform = ({ id, mode, cedenteId = null }: { id: string, mode: "edit" | "create", cedenteId: string | null }) => {

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValuesForPJ>({
    shouldFocusError: false
  });

  const { setCedenteModal } = useContext(BrokersContext);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUnlinking, setIsUnlinking] = useState<boolean>(false);
  const [openUnlinkModal, setOpenUnlinkModal] = useState<boolean>(false);

  /* ====> tan stack requests and datas ====> */
  const { data: cedentePjData, isPending: pendingCedentePjData = false } = useQuery<NotionPage>({
    queryKey: ["broker_card_cedente_data", cedenteId],
    staleTime: 1000,
    queryFn: async () => {
      if (cedenteId === null) return;
      const req = await api.get(`/api/cedente/show/pj/${cedenteId}/`)

      if (req.data === null) return;

      return req.data;
    },
    enabled: cedenteId !== null
  })

  // mutations
  const createCedente = useMutation({
    mutationFn: async (data: FormValuesForPJ) => {
      const req = await api.post(`/api/cedente/create/pj/`, data);
      return req.data;
    },
    onMutate: async () => {
      setIsUpdating(true);
      await queryClient.cancelQueries({ queryKey: ["broker_list"] });
      await queryClient.cancelQueries({ queryKey: ["broker_list_cedente_check", id] });
      await queryClient.cancelQueries({ queryKey: ["broker_list_precatorio_check", id] });
      const previousData = queryClient.getQueryData(["broker_list"]);
      queryClient.setQueryData(['broker_list'], (old: NotionResponse) => {
        return {
          ...old,
          results: old?.results.map((item: NotionPage) => {
            if (item.id === id) {
              return {
                ...item,
                properties: {
                  ...item.properties,
                  "Cedente PJ": {
                    ...item.properties["Cedente PJ"],
                    relation: [
                      {
                        id: "",
                      }
                    ]
                  }
                }
              }
            } else {
              return item
            }
          })
        }
      })
      return { previousData };
    },
    onError: async (error, data, context) => {
      await queryClient.setQueryData(["broker_list"], context?.previousData);
      toast.error('Erro ao realizar cadastro', {
        icon: <BiX className="text-lg fill-red-500" />
      });
    },
    onSuccess: async () => {
      toast.success("Cadastro realizado com sucesso", {
        icon: <BiCheck className="text-lg fill-green-400" />
      });
      await queryClient.invalidateQueries({ queryKey: ["broker_list"] });
      await queryClient.invalidateQueries({ queryKey: ["broker_list_cedente_check", id] });
      await queryClient.invalidateQueries({ queryKey: ["broker_list_precatorio_check", id] });
      setCedenteModal(null);
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  })

  const updateCedente = useMutation({
    mutationFn: async (data: FormValuesForPJ) => {
      const req = await api.patch(`/api/cedente/update/pj/${cedenteId}/`, data);
      return req.data;
    },
    onMutate: async () => {
      setIsUpdating(true);
      await queryClient.cancelQueries({ queryKey: ["broker_list"] });
      await queryClient.cancelQueries({ queryKey: ["broker_list_cedente_check", id] });
      await queryClient.cancelQueries({ queryKey: ["broker_list_precatorio_check", id] });
      const previousData = queryClient.getQueryData(["broker_card_cedente_data"]);
      return {previousData}
    },
    onError: async (error, data, context) => {
      await queryClient.setQueryData(["broker_card_cedente_data"], context?.previousData);
      toast.error('Erro ao atualizar dados', {
        icon: <BiX className="text-lg fill-red-500" />
      });
    },
    onSuccess: async () => {
      toast.success("Cedente atualizado com sucesso", {
        icon: <BiCheck className="text-lg fill-green-400" />
      });
      await queryClient.invalidateQueries({ queryKey: ["broker_list"] });
      await queryClient.invalidateQueries({ queryKey: ["broker_list_cedente_check", id] });
      await queryClient.invalidateQueries({ queryKey: ["broker_list_precatorio_check", id] });
      setCedenteModal(null);
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // função que desvincula o cedente do ofício
  const unlinkCedente = async () => {
    if (!cedenteId) return;

    setIsUnlinking(true);

    try {
      const req = await api.delete(`/api/cedente/unlink/pj/${cedenteId}/precatorio/${id}/`);
      if (req.status === 204) {
        toast.success("Cedente desvinculado com sucesso", {
          icon: <BiCheck className="text-lg fill-green-400" />
        })
        setCedenteModal(null);
        queryClient.invalidateQueries({ queryKey: ["broker_list"] });
        queryClient.invalidateQueries({ queryKey: ["broker_list_cedente_check", id] });
      }
    } catch (error) {
      toast.error('Erro ao desvincular cedente', {
        icon: <BiX className="text-lg fill-red-500" />
      });
    } finally {
      setIsUnlinking(false);
    }

  };

  // função de submit para o formulário
  const onSubmit = async (data: any) => {

    setIsUpdating(true);

    if (data.celular) {
      data.celular = data.celular.replace(/\D/g, ''); // remove tudo que não for dígito
    }

    if (mode === "edit") {
      await updateCedente.mutateAsync(data);
    } else {
      await createCedente.mutateAsync(data);
    }

    // try {
    //   const req = await api.post("/api/cedente/create/pf/", data)

    //   if (req.status === 200 || req.status === 201) {
    //     toast.success("Cadastro realizado com sucesso", {
    //       icon: <BiCheck className="text-lg fill-green-400" />
    //     })
    //     queryClient.invalidateQueries({ queryKey: ["broker_list"] });
    //     queryClient.invalidateQueries({ queryKey: ["broker_list_cedente_check", id] });
    //   }

    // } catch (error) {
    //   toast.error('Erro ao realizar cadastro', {
    //     icon: <BiX className="text-lg fill-red-500" />
    //   });
    // } finally {
    //   setIsUpdating(false)
    // }

  };

  useEffect(() => {
    if (mode === "edit" && cedentePjData) {

      // valores obrigatórios em um cadastro
      setValue("razao_social", cedentePjData.properties["Razão Social"].title[0].text.content);
      setValue("cnpj", cedentePjData.properties["CNPJ"].rich_text![0].text.content);
      setValue("cep", cedentePjData.properties["CEP"].rich_text![0].text.content);

      //valores opcionais
      setValue("bairro", cedentePjData.properties["Bairro"].rich_text?.[0]?.text.content || "");
      setValue("celular", cedentePjData.properties["Celular"].phone_number || "");
      setValue("email", cedentePjData.properties["Email"].email || "");
      setValue("estado", cedentePjData.properties["Estado (UF)"].select?.name || "");
      setValue("logradouro", cedentePjData.properties["Rua/Av/Logradouro"].rich_text?.[0]?.text.content || "");
      setValue("numero", cedentePjData.properties["Número"].rich_text?.[0]?.text.content || "");
      setValue("complemento", cedentePjData.properties["Complemento"].rich_text?.[0]?.text.content || "");
      setValue("municipio", cedentePjData.properties["Município"].select?.name || "");

    }
  }, [cedentePjData]);

  return (
    <div className='max-h-[480px] overflow-y-scroll px-3'>

      {mode === "edit" && (
        <Button
          variant="danger"
          className="group absolute left-3 top-3 flex items-center justify-center overflow-hidden rounded-full px-0 py-0 w-[32px] h-[32px] hover:w-[159px] transition-all duration-300 ease-in-out"
          onClick={() => setOpenUnlinkModal(true)}
        >
          <Fade className="group-hover:hidden">
            <BiTrash />
          </Fade>
          <Fade className="hidden group-hover:block whitespace-nowrap text-sm">
            <div >
              Desvincular Cedente
            </div>
          </Fade>
        </Button>
      )}

      <h2 className='text-center text-2xl font-medium mb-10'>Cadastro de Cedente</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-2 w-full'>

        {/* relacionado ao oficio */}
        <input
          type="hidden"
          value={id}
          {...register("relacionado_a", {
            required: true,
          })} />

        {/* nome completo */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="razao_social" className='flex items-center justify-center gap-2'>
            <FaUserLarge />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Razão Social</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("razao_social", {
              required: {
                value: true,
                message: "Campo obrigatório"
              }
            })}
            className={`${errors.razao_social ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
          />
          {errors.razao_social && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{errors.razao_social.message}</span>}
        </div>

        {/* CPF */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="cpf" className='flex items-center justify-center gap-2'>
            <HiMiniIdentification className='text-lg' />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>CNPJ</span>
          </label>
          <Controller
            name="cnpj"
            control={control}
            rules={{
              required: "Campo obrigatório",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Cleave
                  {...field}
                  placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  className={`${error ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                  options={{
                    delimiters: [".", ".", "/", "-"],
                    blocks: [2, 3, 3, 4, 2]
                  }}
                />
                {error && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{error.message}</span>}
              </>
            )}
          />
        </div>

        {/* CEP */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="cep" className='flex items-center justify-center gap-2'>
            <MdPinDrop />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>CEP</span>
          </label>
          <Controller
            name="cep"
            control={control}
            rules={{
              required: "Campo obrigatório",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Cleave
                  {...field}
                  placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  className={`${error ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                  options={{
                    delimiter: "-",
                    blocks: [5, 3]
                  }}
                />
                {error && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{error.message}</span>}
              </>
            )}
          />
        </div>

        {/* bairro */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="bairro" className='flex items-center justify-center gap-2'>
            <PiCityFill />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Bairro</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("bairro")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* Celular */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="celular" className='flex items-center justify-center gap-2'>
            <MdPhone />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Celular</span>
          </label>
          <Controller
            name="celular"
            control={control}
            render={({ field }) => (
              <>
                <Cleave
                  {...field}
                  placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  className="border-stroke dark:border-strokedark flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                  options={{
                    delimiters: [" ", " ", "-"],
                    blocks: [2, 1, 4, 4]
                  }}
                />
              </>
            )}
          />
        </div>

        {/* email */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="email" className='flex items-center justify-center gap-2'>
            <MdAlternateEmail />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Email</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("email")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* estado */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="estado" className='flex items-center justify-center gap-2'>
            <MdPinDrop />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Estado</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("estado")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* Logradouro */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="logradouro" className='flex items-center justify-center gap-2'>
            <RiRoadMapLine />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Logradouro</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("logradouro")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* numero */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="numero" className='flex items-center justify-center gap-2'>
            <FaHome />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Número</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("numero")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* Complemento */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="complemento" className='flex items-center justify-center gap-2'>
            <FaHome />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Complemento</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("complemento")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* municipio */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="municipio" className='flex items-center justify-center gap-2'>
            <TbBuildingEstate />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Municipio</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePjData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("municipio")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        <div className='col-span-2 flex items-center justify-center my-4'>
          {mode === "edit" ? (
            <Button type='submit'>
              {isUpdating ? "Salvando Edição..." : "Finalizar Edição"}
            </Button>
          ) : (
            <Button type='submit'>
              {isUpdating ? "Realizando cadastro..." : "Finalizar Cadastro"}
            </Button>
          )}
        </div>
      </form>

      {/* ====> unlink modal <==== */}
      {openUnlinkModal && (
        <div className='absolute bg-black-2/50 flex flex-col items-center justify-center w-full h-full top-0 left-0 rounded-md'>
          <div className="relative h-fit w-3/5 rounded-lg border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark">
            {/* close buttom */}
            <button className='group absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors duration-300 cursor-pointer'>
              <BiX
                className="group-hover:text-white transition-colors duration-300 text-2xl"
                onClick={() => setOpenUnlinkModal(false)}
              />
            </button>

            <div className='flex flex-col gap-4 items-center justify-center'>
              <TiWarning className='text-amber-300 text-5xl' />

              <p className='text-center'>Tem certeza? Essa ação não pode ser desfeita.</p>

              <div className='flex gap-4 items-center justify-center my-5'>
                <Button onClick={unlinkCedente}>
                  {isUnlinking ? "Desvinculando..." : "Desvincular"}
                </Button>

                <Button variant='danger'>
                  Cancelar
                </Button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PJform;
