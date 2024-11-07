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
import ReactInputMask from 'react-input-mask';
import { toast } from 'sonner';

type FormValuesForPF = {
  nome_completo: string;
  cpf: string;
  identidade: string;
  cep: string;
  bairro: string;
  celular: string;
  email: string;
  estado: string;
  data_nascimento: string;
  profissao: string;
  logradouro: string;
  numero: number | string;
  complemento?: string;
  municipio: string;
  orgao_exp: string;
  nome_pai: string;
  nome_mae: string;
  nacionalidade: string;
  relacionado_a: string;
}


const PFform = ({ id, mode, cedenteId = null }: { id: string, mode: "edit" | "create", cedenteId: string | null }) => {

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValuesForPF>({
    shouldFocusError: false,
    defaultValues: {
      nacionalidade: "Brasileiro"
    }
  });

  const { setCedenteModal } = useContext(BrokersContext);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUnlinking, setIsUnlinking] = useState<boolean>(false);
  const [openUnlinkModal, setOpenUnlinkModal] = useState<boolean>(false);

  /* ====> tan stack requests and datas ====> */
  const { data: cedentePfData, isPending: pendingCedentePfData = false } = useQuery<NotionPage>({
    queryKey: ["broker_card_cedente_data", cedenteId],
    staleTime: 1000,
    queryFn: async () => {
      if (cedenteId === null) return;
      const req = await api.get(`/api/cedente/show/pf/${cedenteId}/`)

      if (req.data === null) return;

      return req.data;
    },
    enabled: cedenteId !== null
  })

  // mutations
  const createCedente = useMutation({
    mutationFn: async (data: FormValuesForPF) => {
      const req = await api.post(`/api/cedente/create/pf/`, data);
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
                  "Cedente PF": {
                    ...item.properties["Cedente PF"],
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
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  })

  // função que desvincula o cedente do ofício
  const unlinkCedente = async () => {
    if (!cedenteId) return;

    setIsUnlinking(true);

    try {
      const req = await api.delete(`/api/cedente/unlink/pf/${cedenteId}/precatorio/${id}/`);
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

    if (data.data_nascimento) {
      data.data_nascimento = data.data_nascimento.split("/").reverse().join("-");
    }

    if (data.numero) {
      data.numero = parseInt(data.numero);
    }

    await createCedente.mutateAsync(data);

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
    if (mode === "edit" && cedentePfData) {

      // valores obrigatórios em um cadastro
      setValue("nome_completo", cedentePfData.properties["Nome Completo"].title[0].text.content);
      setValue("cpf", cedentePfData.properties["CPF"].rich_text![0].text.content);
      setValue("identidade", cedentePfData.properties["Identidade"].rich_text![0].text.content);
      setValue("cep", cedentePfData.properties["CEP"].rich_text![0].text.content);

      //valores opcionais
      setValue("orgao_exp", cedentePfData.properties["Órgão Expedidor"].rich_text?.[0]?.text.content || "");
      setValue("bairro", cedentePfData.properties["Bairro"].rich_text?.[0]?.text.content || "");
      setValue("celular", cedentePfData.properties["Celular"].phone_number || "");
      setValue("email", cedentePfData.properties["Email"].email || "");
      setValue("estado", cedentePfData.properties["Estado (UF)"].select?.name || "");
      setValue("data_nascimento", cedentePfData.properties["Nascimento"].date?.start.split("-").reverse().join("/") || "");
      setValue("profissao", cedentePfData.properties["Profissão"].rich_text?.[0]?.text.content || "");
      setValue("logradouro", cedentePfData.properties["Rua/Av/Logradouro"].rich_text?.[0]?.text.content || "");
      setValue("numero", cedentePfData.properties["Número"].number || "");
      setValue("complemento", cedentePfData.properties["Complemento"].rich_text?.[0]?.text.content || "");
      setValue("municipio", cedentePfData.properties["Município"].select?.name || "");
      setValue("nome_pai", cedentePfData.properties["Nome do Pai"].rich_text?.[0]?.text.content || "");
      setValue("nome_mae", cedentePfData.properties["Nome da Mãe"].rich_text?.[0]?.text.content || "");
      setValue("nacionalidade", cedentePfData.properties["Nacionalidade"].select?.name || "");

    }
  }, [cedentePfData]);

  console.log(cedentePfData)

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
          <label htmlFor="nome_completo" className='flex items-center justify-center gap-2'>
            <FaUserLarge />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Nome Completo</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("nome_completo", {
              required: {
                value: true,
                message: "Campo obrigatório"
              }
            })}
            className={`${errors.nome_completo ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
          />
          {errors.nome_completo && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{errors.nome_completo.message}</span>}
        </div>

        {/* CPF */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="cpf" className='flex items-center justify-center gap-2'>
            <HiMiniIdentification className='text-lg' />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>CPF</span>
          </label>
          <Controller
            name="cpf"
            control={control}
            rules={{
              required: "Campo obrigatório",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Cleave
                  {...field}
                  placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  className={`${error ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                  options={{
                    delimiters: [".", ".", "-"],
                    blocks: [3, 3, 3, 2]
                  }}
                />
                {error && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{error.message}</span>}
              </>
            )}
          />
        </div>

        {/* Identidade */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="identidade" className='flex items-center justify-center gap-2'>
            <HiMiniIdentification className='text-lg' />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Identidade</span>
          </label>
          <Controller
            name="identidade"
            control={control}
            rules={{
              required: "Campo obrigatório",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Cleave
                  {...field}
                  placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  className={`${error ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                  options={{
                    delimiters: [".", "."],
                    blocks: [1, 3, 3]
                  }}
                />
                {error && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{error.message}</span>}
              </>
            )}
          />
        </div>

        {/* Órgão expedidor */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="orgao_exp" className='flex items-center justify-center gap-2'>
            <FaUniversity />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Órgão expedidor</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("orgao_exp")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
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
                  placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
                  placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("estado")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* data de nascimento */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="data_nascimento" className='flex items-center justify-center gap-2'>
            <BsFillCalendar2WeekFill className='text-sm' />
            <span title='Data de nascimento' className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Data de nascimento</span>
          </label>
          <Controller
            name="data_nascimento"
            control={control}
            render={({ field }) => (
              <>
                <Cleave
                  {...field}
                  placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  className="border-stroke dark:border-strokedark flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                  options={{
                    delimiters: ["/", "/"],
                    blocks: [2, 2, 4]
                  }}
                />
              </>
            )}
          />
        </div>

        {/* Profissão */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="profissao" className='flex items-center justify-center gap-2'>
            <FaBriefcase className='text-sm' />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Profissão</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("profissao")}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("municipio")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* Nome do pai */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="nome_pai" className='flex items-center justify-center gap-2'>
            <FaMale />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Nome do Pai</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("nome_pai")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* Nome da mãe */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="nome_mae" className='flex items-center justify-center gap-2'>
            <FaFemale />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Nome da Mãe</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("nome_mae")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        {/* Nacionalidade */}
        <div className='relative col-span-2 flex items-center gap-4 max-h-12'>
          <label htmlFor="nacionalidade" className='flex items-center justify-center gap-2'>
            <FaFlag />
            <span className='w-33 text-ellipsis overflow-hidden whitespace-nowrap'>Nacionalidade</span>
          </label>
          <input
            type="text"
            placeholder={(pendingCedentePfData && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
            {...register("nacionalidade")}
            className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
          />
        </div>

        <div className='col-span-2 flex items-center justify-center my-4'>
          <Button type='submit'>
            {isUpdating ? "Realizando cadastro..." : "Finalizar Cadastro"}
          </Button>
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

export default PFform;
