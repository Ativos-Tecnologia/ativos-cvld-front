import { Button } from '@/components/Button';
import ConfirmModal from '@/components/CrmUi/ConfirmModal';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import CedenteModalSkeleton from '@/components/Skeletons/CedenteModalSkeleton';
import { BrokersContext } from '@/context/BrokersContext';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import queryClient from '@/utils/queryClient';
import { useMutation } from '@tanstack/react-query';
import Cleave from 'cleave.js/react';
import { useContext, useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiCheck, BiPlus, BiSolidBank, BiTrash, BiX } from 'react-icons/bi';
import { BsBank2 } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';
import { FaUserLarge } from 'react-icons/fa6';
import { HiMiniBanknotes, HiMiniIdentification } from 'react-icons/hi2';
import { LuLink } from 'react-icons/lu';
import { MdAlternateEmail, MdPhone, MdPinDrop } from 'react-icons/md';
import { PiCityFill, PiScalesFill } from 'react-icons/pi';
import { RiBankCardFill, RiRoadMapLine } from 'react-icons/ri';
import { TbBuildingEstate } from 'react-icons/tb';
import { toast } from 'sonner';
import PFform from './PFform';

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
  agencia: string;
  conta: string;
  pix: string;
  banco: string;
};

export type CedenteProps = {
  data: NotionPage | null;
  isFetching: boolean;
}

export type CedenteListResponse = {
  isFetching: boolean;
  listPf?: CedenteListProps[];
  listPj?: CedenteListProps[];
}

export type CedenteListProps = {
  id: string;
  name: string;
  type: string;
}

const FormForCedentePjList = ({ registeredCedentesList, idPrecatorio }:
  {
    registeredCedentesList: CedenteListResponse;
    idPrecatorio: string;
  }
) => {
  const {
    register,
    handleSubmit
  } = useForm<{ cedente_a_vincular: string }>();

  const { setCedenteModal, fetchDetailCardData, setIsFetchAllowed } = useContext(BrokersContext);
  const [isLinkingRegisteredCedente, setIsLinkingRegisteredCedente] = useState<boolean>(false);

  const onSubmit = async (data: { cedente_a_vincular: string }) => {

    setIsLinkingRegisteredCedente(true);
    setIsFetchAllowed(false);

    try {

      const req = await api.patch(`/api/cedente/link/pj/${data.cedente_a_vincular}/to/precatorio/${idPrecatorio}/`);

      if (req.status === 202) {
        toast.success("Cedente vinculado com sucesso.", {
          classNames: {
            toast: "bg-white dark:bg-boxdark",
            title: "text-black-2 dark:text-white",
            actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
          },
          icon: <BiCheck className="text-lg fill-green-400" />,
          action: {
            label: "OK",
            onClick() {
              toast.dismiss();
            },
          }
        });

        setIsFetchAllowed(true);
        await fetchDetailCardData(idPrecatorio);
        setCedenteModal(null);
      }

    } catch (error) {

      toast.error('Erro ao vincular cedente', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });

      setIsFetchAllowed(true);

    } finally {

      setIsLinkingRegisteredCedente(false);

    }

  }

  return (
    <div className='flex flex-col gap-1'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='cedente_a_vincular'>Selecione um cedente já cadastrado</label>
        <div className='flex gap-3 items-center'>
          <select
            {...register("cedente_a_vincular")}
            className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
          >
            {registeredCedentesList.listPj && registeredCedentesList.listPj.map((cedente) => (
              <option key={cedente.id} value={cedente.id}>{cedente.name}</option>
            ))}
          </select>
          <CRMTooltip text="Vincular Cedente" placement='right' >
            <Button type='submit'>
              {isLinkingRegisteredCedente ? (
                <AiOutlineLoading className='text-snow animate-spin' />
              ) : (
                <LuLink className='text-snow' />
              )}
            </Button>
          </CRMTooltip>
        </div>
      </form>
    </div>
  )
};

const PJform = ({ id, mode, cedenteId = null }: { id: string, mode: "edit" | "create", cedenteId: string | null }) => {

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValuesForPJ>({
    shouldFocusError: false,
    defaultValues: {
      celular: "",
      cep: "",
      cnpj: "",
      razao_social: "",
      socio_representante: "",
      bairro: "",
      email: "",
      estado: "",
      logradouro: "",
      numero: "",
      complemento: "",
      municipio: "",
      agencia: "",
      conta: "",
      pix: "",
      banco: "",
    }
  });

  const { setCedenteModal, fetchDetailCardData, setIsFetchAllowed, specificCardData } = useContext(BrokersContext);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUnlinking, setIsUnlinking] = useState<boolean>(false);
  const [openUnlinkModal, setOpenUnlinkModal] = useState<boolean>(false);
  const [openRegisterForm, setOpenRegisterForm] = useState<boolean>(false);
  const [openRegisterPfModal, setOpenRegisterPfModal] = useState<boolean>(false);
  const [registeredCedentesList, setRegisteredCedentesList] = useState<CedenteListResponse>({
    isFetching: true,
    listPf: [],
    listPj: []
  });
  const [cedentePjData, setCedentePjData] = useState<CedenteProps>({
    data: null,
    isFetching: true
  });
  const [pixOption, setPixOption] = useState<PixOption>("celular");

  const formValues = watch();
  const isFormModified: boolean = Object.values(formValues).some(value => (
    value !== '' &&
    value !== id
  ));

  // função que faz fetch na lista de cedentes
  // OBS: é chamada somente se o mode for create
  const fetchRegisteredCedentesList = async () => {

    setRegisteredCedentesList(old => (
      {
        ...old,
        isFetching: true
      }
    ));

    try {

      const req = await api.get(`api/cedente/list/`);
      if (req.status === 200) {
        const list = req.data.response;

        const filteredPjList = list.filter((cedente: CedenteListProps) => cedente.type === "PJ");
        const filteredPfList = list.filter((cedente: CedenteListProps) => cedente.type === "PF");

        setRegisteredCedentesList(old => ({
          ...old,
          listPj: filteredPjList,
          listPf: filteredPfList,
        }));
      }

    } catch (error) {

      throw new Error("Erro ao buscar lista de cedentes");

    } finally {

      setRegisteredCedentesList(old => (
        {
          ...old,
          isFetching: false
        }
      ));

    }

  };

  // função de retorno do representante legal (caso haja)
  const getRepresentanteLegal = (socioID: string | null): string => {
    if (registeredCedentesList.listPf!.length > 0) {
      const socioRepresentanteInfo = registeredCedentesList.listPf?.filter(cedente => cedente.id === socioID);
      return socioRepresentanteInfo ? socioRepresentanteInfo?.[0]?.name : "Não Informado"
    }

    return "Não Informado"

  };

  // função para desvicular o representante legal
  const handleUnlinkRepresentante = async () => {
    setIsUnlinking(true);

    try {
      const req = await api.delete(`/api/cedente/unlink/socio-representante/pj/${cedenteId}/`);
      if (req.status === 204) {
        toast.success("Representante desvinculado.", {
          classNames: {
            toast: "bg-white dark:bg-boxdark",
            title: "text-black-2 dark:text-white",
            actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
          },
          icon: <BiCheck className="text-lg fill-green-400" />,
          action: {
            label: "OK",
            onClick() {
              toast.dismiss();
            },
          }
        });
        setCedenteModal(null);
      }
    } catch (error) {
      toast.error('Erro ao desvincular representante', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });
    } finally {
      setIsUnlinking(false);
    }
  };

  // mutations
  const createCedente = useMutation({
    mutationFn: async (data: FormValuesForPJ) => {
      const req = await api.post(`/api/cedente/create/pj/`, data);
      return req.data;
    },
    onMutate: async () => {
      setIsUpdating(true);
      setIsFetchAllowed(false);
    },
    onError: () => {
      toast.error('Erro ao realizar cadastro', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });
    },
    onSuccess: async () => {
      await fetchDetailCardData(id);
      toast.success("Cadastro realizado com sucesso.", {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiCheck className="text-lg fill-green-400" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });
      setCedenteModal(null);
    },
    onSettled: () => {
      setIsUpdating(false);
      setIsFetchAllowed(true);
    }
  })

  const updateCedente = useMutation({
    mutationFn: async (data: FormValuesForPJ) => {
      const req = await api.patch(`/api/cedente/update/pj/${cedenteId}/`, data);
      return req.data;
    },
    onMutate: async () => {
      setIsUpdating(true);
      setIsFetchAllowed(false);
      await queryClient.cancelQueries({ queryKey: ["broker_list"] });
      await queryClient.cancelQueries({ queryKey: ["broker_list_cedente_check", id] });
      await queryClient.cancelQueries({ queryKey: ["broker_list_precatorio_check", id] });
      const previousData = queryClient.getQueryData(["broker_card_cedente_data"]);
      return { previousData }
    },
    onError: async (error, data, context) => {
      await queryClient.setQueryData(["broker_card_cedente_data"], context?.previousData);
      toast.error('Erro ao atualizar dados', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["broker_list"] });
      await queryClient.invalidateQueries({ queryKey: ["broker_list_cedente_check", id] });
      await queryClient.invalidateQueries({ queryKey: ["broker_list_precatorio_check", id] });
      toast.success("Cedente atualizado com sucesso.", {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiCheck className="text-lg fill-green-400" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });
      setCedenteModal(null);
    },
    onSettled: () => {
      setIsUpdating(false);
      setIsFetchAllowed(true);
    }
  });

  // função que desvincula o cedente do ofício
  const unlinkCedente = async () => {
    if (!cedenteId) return;

    setIsUnlinking(true);
    setIsFetchAllowed(false);

    try {
      const req = await api.delete(`/api/cedente/unlink/pj/${cedenteId}/precatorio/${id}/`);
      if (req.status === 204) {
        toast.success("Cedente desvinculado com sucesso!", {
          classNames: {
            toast: "bg-white dark:bg-boxdark",
            title: "text-black-2 dark:text-white",
            actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
          },
          icon: <BiCheck className="text-lg fill-green-400" />,
          action: {
            label: "OK",
            onClick() {
              toast.dismiss();
            },
          }
        });
        setIsFetchAllowed(true);
        await fetchDetailCardData(id);
        setCedenteModal(null);
      }
    } catch (error) {
      toast.error('Erro ao desvincular cedente', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });
      setIsFetchAllowed(true);
    } finally {
      setIsUnlinking(false);
    }

  };

  // função que atualiza dados do formulário pelo CEP digitado
  const searchCep = async (cep: string) => {

    const formattedCep = cep.replace(/\D/g, '');

    if (formattedCep.length !== 8) return;

    const request = (await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)).json()
    const result = await request;
    setValue("municipio", result.city);
    setValue("estado", result.state);
    setValue("bairro", result.neighborhood);
    setValue("logradouro", result.street);

  };

  // função de fetch para pegar dados do cedente cadastrado
  const fetchCedente = async () => {
    const req = await api.get(`/api/cedente/show/pj/${cedenteId}/`);
    if (req.data === null) return
    setCedentePjData(old => ({
      data: req.data,
      isFetching: false
    }))
  }

  // função de mostrar confirm para fechar modal no modo create
  const confirmClose = () => {
    if (isFormModified && mode === "create") {
      const confirmClose = window.confirm("Você tem alterações não salvas. Tem certeza de que deseja fechar?");
      if (confirmClose) {
        setCedenteModal(null);
      }
    } else {
      setCedenteModal(null);
    }
  };

  // função de submit para o formulário de criação de cedente
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

  };

  useEffect(() => {

    if (!cedenteId) return;
    fetchCedente();

  }, [cedenteId]);

  useEffect(() => {
    if (mode === "create" && cedentePjData.data === null) {
      fetchRegisteredCedentesList();
    }
  }, [mode])

  useEffect(() => {
    if (specificCardData !== null) {
      console.log("fetching list...")
      fetchRegisteredCedentesList();
    }
  }, [specificCardData])

  useEffect(() => {
    if (mode === "edit" && cedentePjData.data) {

      // valores obrigatórios em um cadastro
      setValue("relacionado_a", id);
      setValue("razao_social", cedentePjData.data?.properties["Razão Social"].title[0].text.content);
      setValue("cnpj", cedentePjData.data!.properties["CNPJ"].rich_text![0].text.content);
      setValue("socio_representante", getRepresentanteLegal(cedentePjData.data?.properties["Sócio Representante"].relation?.[0]?.id || null))
      setValue("cep", cedentePjData.data!.properties["CEP"].rich_text![0].text.content);

      //valores opcionais
      setValue("bairro", cedentePjData.data?.properties["Bairro"].rich_text?.[0]?.text.content || "");
      setValue("celular", cedentePjData.data?.properties["Celular"].phone_number || "");
      setValue("email", cedentePjData.data?.properties["Email"].email || "");
      setValue("estado", cedentePjData.data?.properties["Estado (UF)"].select?.name || "");
      setValue("logradouro", cedentePjData.data?.properties["Rua/Av/Logradouro"].rich_text?.[0]?.text.content || "");
      setValue("numero", cedentePjData.data?.properties["Número"].rich_text?.[0]?.text.content || "");
      setValue("complemento", cedentePjData.data?.properties["Complemento"].rich_text?.[0]?.text.content || "");
      setValue("municipio", cedentePjData.data?.properties["Município"].select?.name || "");
      setValue("agencia", cedentePjData.data?.properties["Agência"].rich_text?.[0]?.text.content || "");
      setValue("conta", cedentePjData.data?.properties["Conta"].rich_text?.[0]?.text.content || "");
      setValue("pix", cedentePjData.data?.properties["Pix"].rich_text?.[0]?.text.content || "");
      setValue("banco", cedentePjData.data?.properties["Banco"].rich_text?.[0]?.text.content || "");


    } else {
      setValue("relacionado_a", id);
    }
  }, [cedentePjData, registeredCedentesList]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        confirmClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFormModified]);

  return (
    <div className='max-h-[480px] px-3'>

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

      <button className='group absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors duration-300 cursor-pointer'>
        <BiX className="group-hover:text-white transition-colors duration-300 text-2xl" onClick={() => confirmClose()} />
      </button>

      <h2 className='text-center text-2xl font-medium mb-10'>Cadastro de Cedente</h2>
      {(mode === "create" && !cedentePjData.data && !openRegisterForm) && (
        <>
          <div className='mt-7'>
            {registeredCedentesList.isFetching ? (
              <CedenteModalSkeleton />
            ) : (
              <>
                {registeredCedentesList.listPj && registeredCedentesList.listPj.length > 0 ? (
                  <>
                    <div className='flex flex-col gap-1'>
                      <FormForCedentePjList
                        registeredCedentesList={registeredCedentesList}
                        idPrecatorio={id}
                      />
                    </div>

                    <div className='relative border-t border-stroke dark:border-form-strokedark my-6'>
                      <div className='absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 bg-white dark:bg-boxdark'>
                        ou
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className='text-center mb-20'>Nenhum cedente cadastrado.</p>
                  </>
                )}
              </>
            )}

            <Button
              onClick={() => setOpenRegisterForm(true)}
              className='block mx-auto'
            >
              Cadastrar novo cedente
            </Button>
          </div>
        </>
      )}

      {(mode === "edit" || cedentePjData.data !== null || openRegisterForm) && (
        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 w-full max-h-100 overflow-y-auto pr-5 2xsm:gap-6 md:gap-2'>

          {/* relacionado ao oficio */}
          <input
            type="hidden"
            value={id ? id : ""}
            {...register("relacionado_a", {
              required: true,
            })} />

          {/* razão social */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="razao_social" className='flex items-center justify-center gap-2'>
              <FaUserLarge />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Razão Social</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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

          {/* CNPJ */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="cnpj" className='flex items-center justify-center gap-2'>
              <HiMiniIdentification className='text-lg' />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>CNPJ</span>
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
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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

          {/* Representante Legal */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="socio_representante" className='flex items-center justify-center gap-2'>
              <PiScalesFill className='text-lg' />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Representante Legal</span>
            </label>
            <div className='flex items-center gap-3 w-full'>
              {cedentePjData.data?.properties["Sócio Representante"].relation?.[0]?.id ? (
                <input
                  type="text"
                  placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
                  {...register("socio_representante", {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    }
                  })}
                  className={`border-stroke dark:border-strokedark flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                />
              ) : (
                <select
                  {...register("socio_representante")}
                  className="w-full border-b border-l-0 border-t-0 border-r-0 bg-white dark:bg-boxdark border-stroke dark:border-strokedark py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                >
                  <option value="">Selecione</option>
                  {registeredCedentesList.listPf && registeredCedentesList.listPf.map((cedente) => (
                    <option key={cedente.id} value={cedente.id}>{cedente.name}</option>
                  ))}
                </select>
              )}

              {(cedentePjData.data && cedentePjData.data.properties["Sócio Representante"].relation!.length > 0) ? (
                <button
                  type='button'
                  title='Desvincular representante'
                  onClick={handleUnlinkRepresentante}
                  className='p-1 flex bg-red-500 items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 rounded-md'>
                  {isUnlinking ? (
                    <AiOutlineLoading className='text-lg text-snow animate-spin' />
                  ) : (
                    <BiTrash className='text-lg text-snow' />
                  )}
                </button>
              ) : (
                <button
                  type='button'
                  title='Cadastrar novo representante'
                  onClick={() => setOpenRegisterPfModal(true)}
                  className='p-1 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 rounded-md'>
                  <BiPlus className='text-lg' />
                </button>
              )}

            </div>
          </div>

          {/* CEP */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="cep" className='flex items-center justify-center gap-2'>
              <MdPinDrop />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>CEP</span>
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
                    onBlur={(e) => searchCep(e.target.value)}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="bairro" className='flex items-center justify-center gap-2'>
              <PiCityFill />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Bairro</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("bairro")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>

          {/* Celular */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="celular" className='flex items-center justify-center gap-2'>
              <MdPhone />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Celular</span>
            </label>
            <Controller
              name="celular"
              control={control}
              render={({ field }) => (
                <>
                  <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
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
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="email" className='flex items-center justify-center gap-2'>
              <MdAlternateEmail />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Email</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("email")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>

          {/* estado */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="estado" className='flex items-center justify-center gap-2'>
              <MdPinDrop />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Estado</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("estado")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>

          {/* Logradouro */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="logradouro" className='flex items-center justify-center gap-2'>
              <RiRoadMapLine />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Logradouro</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("logradouro")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>

          {/* numero */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="numero" className='flex items-center justify-center gap-2'>
              <FaHome />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Número</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("numero")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>

          {/* Complemento */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="complemento" className='flex items-center justify-center gap-2'>
              <FaHome />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Complemento</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("complemento")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>

          {/* municipio */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="municipio" className='flex items-center justify-center gap-2'>
              <TbBuildingEstate />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Municipio</span>
            </label>
            <input
              type="text"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Campo Vazio"}
              {...register("municipio")}
              className="flex-1 w-full border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
          </div>
        
           {/* Dados Bancários */}

          {/* Banco */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="banco" className='flex items-center justify-center gap-2'>
              <BsBank2 />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Banco</span>
            </label>
            <Controller
              name="banco"
              control={control}
              render={({ field }) => (
                <>
                  <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Código do Banco"}
                    className="border-stroke dark:border-strokedark flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                    options={{
                      delimiters: [" "],
                      blocks: [3]
                    }}
                  />
                </>
              )}
            />
          </div>

          {/* Agência */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="agencia" className='flex items-center justify-center gap-2'>
              <BiSolidBank />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Agência</span>
            </label>
            <Controller
              name="agencia"
              control={control}
              render={({ field }) => (
                <>
                  <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Código do Agência"}
                    className="border-stroke dark:border-strokedark flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                    options={{
                      delimiters: [" "],
                      blocks: [5]
                    }}
                  />
                </>
              )}
            />
          </div>

          {/* Conta */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="conta" className='flex items-center justify-center gap-2'>
              <RiBankCardFill />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Conta</span>
            </label>
            <Controller
              name="conta"
              control={control}
              render={({ field }) => (
                <>
                  <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Código da Conta"}
                    className="border-stroke dark:border-strokedark flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                    options={{
                      delimiters: [" ", "-"],
                      blocks: [8,1]
                    }}
                  />
                </>
              )}
            />
          </div>

          {/* Pix */}
          <div className='relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:flex-row md:items-center md:max-h-12 md:gap-4'>
            <label htmlFor="pix_type" className='flex items-center justify-center gap-2'>
              <HiMiniBanknotes />
              <span className='w-39 text-ellipsis overflow-hidden whitespace-nowrap'>Pix</span>
            </label>

            <div className='grid 2xsm:grid-cols-1 2xsm:w-full md:grid-cols-2 gap-4 items-center'>

            <select
              id="pix"
              className={`rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-primary focus-visible:shadow-none sm:w-1/4 md:w-full dark:bg-boxdark`}
              value={pixOption}
              onChange={(e) => setPixOption(e.target.value as PixOption)}
            >
              <option className='dark:bg-boxdark bg-white rounded-lg border' value="celular">Celular</option>
              <option className='dark:bg-boxdark bg-white rounded-lg border' value="cpf">CPF</option>
              <option className='dark:bg-boxdark bg-white rounded-lg border' value="email">Email</option>
              <option className='dark:bg-boxdark bg-white rounded-lg border' value="chave">Chave Aleatória</option>
            </select>

            {pixOption === "celular" ? (
              
              <Controller
              name="pix"
              control={control}
              render={({ field }) => (
                <>
                  <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "99 99999-9999"}
                    className="col-span-1 border-stroke dark:border-strokedark border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
                    options={{
                      delimiters: [" ", " ", "-"],
                      blocks: [2, 5, 4]
                    }}
                  />
                </>
              )}
            />
              
            ) : null}

            {pixOption === "cpf" ? (
              <Controller
              name="pix"
              control={control}
              rules={{
                required: "Campo obrigatório",
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "999.999.999-99"}
                    className={`${error ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} col-span-1 border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                    options={{
                      delimiters: [".", ".", "-"],
                      blocks: [3, 3, 3, 2]
                    }}
                  />
                  {error && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{error.message}</span>}
                </>
              )}
            />
              
            ) : null}
            
            {pixOption === "email" ? (
              
            <input
              type="email"
              placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "nome@email.com"}
              {...register("pix")}
              className="col-span-1 border-b border-stroke dark:border-strokedark border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic"
            />
            
            ) : null}

            {pixOption === "chave" ? (
              <Controller
              name="pix"
              control={control}
              rules={{
                required: "Campo obrigatório",
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                <Cleave
                    {...field}
                    placeholder={(cedentePjData.isFetching && mode === "edit") ? 'Carregando...' : "Chave Aleatória"}
                    className={`${error ? "border-2 !border-red ring-0" : "border-stroke dark:border-strokedark"} col-span-1 border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic`}
                    options={{
                      delimiters: ["-"],
                      blocks: [8, 4, 4, 4, 12]
                    }}
                  />
                  {error && <span className='absolute top-1/2 -translate-y-1/2 right-3 text-red text-xs font-medium'>{error.message}</span>}
                </>
              )}
            />
              
            ) : null}
            </div>

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
      )}

      {/* ====> link representante legal modal <==== */}
      {openRegisterPfModal && (
        <div className='absolute bg-boxdark flex flex-col items-center w-full h-full p-10 top-0 left-0 rounded-md'>

          <button className='group absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors duration-300 cursor-pointer'>
            <BiX className="group-hover:text-white transition-colors duration-300 text-2xl" onClick={() => setOpenRegisterPfModal(false)} />
          </button>

          <PFform
            id={id}
            mode="create"
            cedenteId={cedenteId}
            fromFormPJ={true}
            openModal={setOpenRegisterPfModal}
          />
        </div>
      )}

      {/* ====> unlink modal <==== */}
      <ConfirmModal
        size='md'
        isOpen={openUnlinkModal}
        onClose={() => setOpenUnlinkModal(false)}
        onConfirm={unlinkCedente}
        isLoading={isUnlinking}
      />
    </div>
  )
}

export default PJform;
