import { Button } from '@/components/Button';
import ConfirmModal from '@/components/CrmUi/ConfirmModal';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import CedenteModalSkeleton from '@/components/Skeletons/CedenteModalSkeleton';
import { BrokersContext } from '@/context/BrokersContext';
import { GeneralUIContext } from '@/context/GeneralUIContext';
import { validationSelectPix } from '@/functions/formaters/validationPix';
import UseMySwal from '@/hooks/useMySwal';
import { PixOption } from '@/types/pix';
import api from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import Cleave from 'cleave.js/react';
import React, { use, useContext, useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiArrowBack, BiCheck, BiSolidBank, BiTrash, BiX } from 'react-icons/bi';
import { BsBank2, BsFillCalendar2WeekFill } from 'react-icons/bs';
import { FaFemale, FaHome, FaMale, FaUniversity } from 'react-icons/fa';
import { FaBriefcase, FaFlag, FaUserLarge } from 'react-icons/fa6';
import { HiMiniBanknotes, HiMiniIdentification } from 'react-icons/hi2';
import { LuLink } from 'react-icons/lu';
import { MdAlternateEmail, MdPhone, MdPinDrop } from 'react-icons/md';
import { PiCityFill } from 'react-icons/pi';
import { RiBankCardFill, RiRoadMapLine } from 'react-icons/ri';
import { TbBuildingEstate } from 'react-icons/tb';
import { toast } from 'sonner';
import { CedenteListProps, CedenteListResponse, CedenteProps } from './PJform';
import { bancos } from '@/constants/bancos';
import CelerAppCombobox from '@/components/CrmUi/Combobox';

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
    agencia: string;
    conta: string;
    pix: string;
    banco: string;
};

const FormForCedentePfList = ({
    registeredCedentesList,
    idPrecatorio,
}: {
    registeredCedentesList: CedenteListResponse;
    idPrecatorio: string;
}) => {
    const { register, handleSubmit } = useForm<{ cedente_a_vincular: string }>();

    const { setCedenteModal, fetchDetailCardData } = useContext(BrokersContext);
    const [isLinkingRegisteredCedente, setIsLinkingRegisteredCedente] = useState<boolean>(false);

    const onSubmit = async (data: { cedente_a_vincular: string }) => {
        setIsLinkingRegisteredCedente(true);

        try {
            const req = await api.patch(
                `/api/cedente/link/pf/${data.cedente_a_vincular}/to/precatorio/${idPrecatorio}/`,
            );

            if (req.status === 202) {
                toast.success('Cedente vinculado com sucesso.', {
                    classNames: {
                        toast: 'bg-white dark:bg-boxdark',
                        title: 'text-black-2 dark:text-white',
                        actionButton:
                            'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                    },
                    icon: <BiCheck className="fill-green-400 text-lg" />,
                    action: {
                        label: 'OK',
                        onClick() {
                            toast.dismiss();
                        },
                    },
                });

                await fetchDetailCardData(idPrecatorio);
                setCedenteModal(null);
            }
        } catch (error) {
            toast.error('Erro ao vincular cedente', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiX className="fill-red-500 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });
        } finally {
            setIsLinkingRegisteredCedente(false);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="cedente_a_vincular">Selecione um cedente já cadastrado</label>
                <div className="flex items-center gap-3">
                    <select
                        {...register('cedente_a_vincular')}
                        className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                    >
                        {registeredCedentesList.listPf &&
                            registeredCedentesList.listPf.map((cedente) => (
                                <option key={cedente.id} value={cedente.id}>
                                    {cedente.name}
                                </option>
                            ))}
                    </select>
                    <CRMTooltip text="Vincular Cedente" placement="right">
                        <Button type="submit">
                            {isLinkingRegisteredCedente ? (
                                <AiOutlineLoading className="animate-spin text-snow" />
                            ) : (
                                <LuLink className="text-snow" />
                            )}
                        </Button>
                    </CRMTooltip>
                </div>
            </form>
        </div>
    );
};

const PFform = ({
    id,
    mode,
    cedenteId = null,
    fromFormPJ,
    openModal,
}: {
    id: string;
    mode: 'edit' | 'create' | 'editFromPj';
    cedenteId: string | null;
    fromFormPJ?: boolean;
    openModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValuesForPF>({
        shouldFocusError: false,
        defaultValues: {
            nacionalidade: 'Brasileiro',
            celular: '',
            cep: '',
            cpf: '',
            data_nascimento: '',
            identidade: '',
            bairro: '',
            municipio: '',
            estado: '',
            complemento: '',
            email: '',
            logradouro: '',
            nome_completo: '',
            nome_mae: '',
            nome_pai: '',
            numero: '',
            orgao_exp: '',
            profissao: '',
            relacionado_a: id,
            agencia: '',
            conta: '',
            pix: '',
            banco: '',
        },
    });

    const { setCedenteModal, fetchDetailCardData, setIsFetchAllowed, setIsEditingPfFromPj } = useContext(BrokersContext);

    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isUnlinking, setIsUnlinking] = useState<boolean>(false);
    const [openUnlinkModal, setOpenUnlinkModal] = useState<boolean>(false);
    const [openRegisterForm, setOpenRegisterForm] = useState<boolean>(false);
    const [registeredCedentesList, setRegisteredCedentesList] = useState<CedenteListResponse>({
        isFetching: true,
        listPf: [],
    });
    const [cedentePfData, setCedentePfData] = useState<CedenteProps>({
        data: null,
        isFetching: false,
    });
    const pfFormModal = React.useRef<HTMLDivElement>(null);
    const formValues = watch();
    const isFormModified = Object.values(formValues).some(
        (value) => value !== '' && value !== 'Brasileiro' && value !== id,
    );
    const [pixOption, setPixOption] = useState<PixOption>('celular');
    const swal = UseMySwal();
    const { theme } = useContext(GeneralUIContext);
    const [banco, setBanco] = useState<string[]>([]);

    // função que faz fetch na lista de cedentes
    // OBS: é chamada somente se o mode for create
    const fetchRegisteredCedentesList = async () => {
        setRegisteredCedentesList((old) => ({
            ...old,
            isFetching: true,
        }));

        try {
            const req = await api.get(`api/cedente/list/`);
            if (req.status === 200) {
                const list = req.data.response;
                const filteredPjList = list.filter(
                    (cedente: CedenteListProps) => cedente.type === 'PF',
                );
                setRegisteredCedentesList((old) => ({
                    ...old,
                    listPf: filteredPjList,
                }));
            }
        } catch (error) {
            throw new Error('Erro ao buscar lista de cedentes');
        } finally {
            setRegisteredCedentesList((old) => ({
                ...old,
                isFetching: false,
            }));
        }
    };

    // mutations
    const createCedente = useMutation({
        mutationFn: async (data: FormValuesForPF) => {
            const req = await api.post(`/api/cedente/create/pf/`, data);
            return req.data;
        },
        onMutate: async () => {
            setIsUpdating(true);
            setIsFetchAllowed(false);
        },
        onError: () => {
            toast.error('Erro ao atualizar cadastro', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiX className="fill-red-500 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });
        },
        onSuccess: async () => {
            await fetchDetailCardData(id);
            toast.success('Cadastro realizado com sucesso!', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiCheck className="fill-green-400 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });

            if (fromFormPJ) {
                openModal && openModal(false);
            } else {
                fetchCedente();
            }
        },
        onSettled: () => {
            setIsUpdating(false);
            setIsFetchAllowed(true);
        },
    });

    const updateCedente = useMutation({
        mutationFn: async (data: FormValuesForPF) => {
            const req = await api.patch(`/api/cedente/update/pf/${cedenteId}/`, data);
            return req.data;
        },
        onMutate: async () => {
            setIsUpdating(true);
            setIsFetchAllowed(false);
        },
        onError: () => {
            toast.error('Erro ao atualizar dados', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiX className="fill-red-500 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });
        },
        onSuccess: async () => {
            await fetchDetailCardData(id);
            toast.success('Cedente atualizado com sucesso!', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiCheck className="fill-green-400 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });

            if (mode === 'editFromPj') {
                setIsEditingPfFromPj(false);
            } else {
                fetchCedente()
            }

        },
        onSettled: () => {
            setIsUpdating(false);
            setIsFetchAllowed(true);
        },
    });

    // função que desvincula o cedente do ofício
    const unlinkCedente = async () => {
        if (!cedenteId) return;

        setIsUnlinking(true);
        setIsFetchAllowed(false);

        try {
            const req = await api.delete(`/api/cedente/unlink/pf/${cedenteId}/precatorio/${id}/`);
            if (req.status === 204) {
                toast.success('Cedente desvinculado com sucesso!', {
                    classNames: {
                        toast: 'bg-white dark:bg-boxdark',
                        title: 'text-black-2 dark:text-white',
                        actionButton:
                            'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                    },
                    icon: <BiCheck className="fill-green-400 text-lg" />,
                    action: {
                        label: 'OK',
                        onClick() {
                            toast.dismiss();
                        },
                    },
                });
                await fetchDetailCardData(id);
                fetchCedente();
            }
        } catch (error) {
            toast.error('Erro ao desvincular cedente', {
                classNames: {
                    toast: 'bg-white dark:bg-boxdark',
                    title: 'text-black-2 dark:text-white',
                    actionButton:
                        'bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300',
                },
                icon: <BiX className="fill-red-500 text-lg" />,
                action: {
                    label: 'OK',
                    onClick() {
                        toast.dismiss();
                    },
                },
            });
        } finally {
            setIsUnlinking(false);
            setIsFetchAllowed(true);
        }
    };

    // função que atualiza dados do formulário pelo CEP digitado
    const searchCep = async (cep: string) => {
        const formattedCep = cep.replace(/\D/g, '');

        if (formattedCep.length !== 8) return;

        const request = (await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)).json();
        const result = await request;
        setValue('municipio', result.city);
        setValue('estado', result.state);
        setValue('bairro', result.neighborhood);
        setValue('logradouro', result.street);
    };

    // função de fetch para pegar dados do cedente cadastrado
    const fetchCedente = async () => {
        setCedentePfData((old) => ({
            ...old,
            isFetching: true,
        }));

        const req = await api.get(`/api/cedente/show/pf/${cedenteId}/`);

        if (req.data === null) return;

        setCedentePfData((old) => ({
            data: req.data,
            isFetching: false,
        }));
    };

    // função de mostrar confirm para fechar modal no modo create
    const confirmClose = () => {
        if (isFormModified && mode === 'create') {
            swal.fire({
                title: 'Você tem certeza?',
                text: 'Você possui alterações não salvas no formulário',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#1a56db',
                confirmButtonText: 'Sim, fechar',
                cancelButtonText: 'Cancelar',
                color: `${theme === 'light' ? '#64748B' : '#AEB7C0'}`,
                background: `${theme === 'light' ? '#FFF' : '#24303F'}`,
            }).then((result) => {
                if (result.isConfirmed && fromFormPJ) {
                    openModal && openModal(false);
                } else if (result.isConfirmed && !fromFormPJ) {
                    setCedenteModal(null);
                } else if (result.isDenied) {
                    return;
                }
            });
        } else if (mode === 'create' && fromFormPJ) {
            openModal && openModal(false);
        } else {
            setCedenteModal(null);
        }
    };

    // função de submit para o formulário
    const onSubmit = async (data: any) => {
        setIsUpdating(true);

        if (data.celular) {
            data.celular = data.celular.replace(/\D/g, ''); // remove tudo que não for dígito
        }

        if (data.data_nascimento) {
            data.data_nascimento = data.data_nascimento.split('/').reverse().join('-');
        }

        if (data.numero) {
            data.numero = parseInt(data.numero);
        }

        if (mode === 'edit' || mode === 'editFromPj') {
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
        if (mode === 'create' && cedentePfData.data === null) {
            fetchRegisteredCedentesList();
        }
    }, [mode]);

    useEffect(() => {
        if (mode === 'edit' || mode === 'editFromPj' && cedentePfData) {
            setPixOption(
                validationSelectPix(
                    cedentePfData.data?.properties['Pix'].rich_text?.[0]?.text.content || '',
                ) as PixOption,
            );
            // valores obrigatórios em um cadastro
            setValue(
                'nome_completo',
                cedentePfData.data?.properties['Nome Completo'].title[0].text.content,
            );
            setValue('cpf', cedentePfData.data?.properties['CPF'].rich_text![0].text.content || '');
            setValue(
                'identidade',
                cedentePfData.data?.properties['Identidade'].rich_text![0].text.content || '',
            );
            setValue('cep', cedentePfData.data?.properties['CEP'].rich_text![0].text.content || '');

            //valores opcionais
            setValue(
                'orgao_exp',
                cedentePfData.data?.properties['Órgão Expedidor'].rich_text?.[0]?.text.content ||
                '',
            );
            setValue(
                'bairro',
                cedentePfData.data?.properties['Bairro'].rich_text?.[0]?.text.content || '',
            );
            setValue('celular', cedentePfData.data?.properties['Celular'].phone_number || '');
            setValue('email', cedentePfData.data?.properties['Email'].email || '');
            setValue('estado', cedentePfData.data?.properties['Estado (UF)'].select?.name || '');
            setValue(
                'data_nascimento',
                cedentePfData.data?.properties['Nascimento'].date?.start
                    .split('-')
                    .reverse()
                    .join('/') || '',
            );
            setValue(
                'profissao',
                cedentePfData.data?.properties['Profissão'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'logradouro',
                cedentePfData.data?.properties['Rua/Av/Logradouro'].rich_text?.[0]?.text.content ||
                '',
            );
            setValue('numero', cedentePfData.data?.properties['Número'].number || '');
            setValue(
                'complemento',
                cedentePfData.data?.properties['Complemento'].rich_text?.[0]?.text.content || '',
            );
            setValue('municipio', cedentePfData.data?.properties['Município'].select?.name || '');
            setValue(
                'nome_pai',
                cedentePfData.data?.properties['Nome do Pai'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'nome_mae',
                cedentePfData.data?.properties['Nome da Mãe'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'nacionalidade',
                cedentePfData.data?.properties['Nacionalidade'].select?.name || '',
            );
            setValue(
                'agencia',
                cedentePfData.data?.properties['Agência'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'conta',
                cedentePfData.data?.properties['Conta'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'pix',
                cedentePfData.data?.properties['Pix'].rich_text?.[0]?.text.content || '',
            );
            setValue(
                'banco',
                cedentePfData.data?.properties['Banco'].rich_text?.[0]?.text.content || '',
            );
        }
    }, [cedentePfData]);

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

    useEffect(() => {
        const bancolist = bancos.map(
            (banco) => `${banco.codigo + ' - ' + banco.nome_da_instituicao}`,
        );
        setBanco(bancolist);
    }, []);

    return (
        <div className="max-h-[480px] w-full px-3" ref={pfFormModal}>
            {mode === 'edit' && (
                <Button
                    variant="danger"
                    className="group absolute left-3 top-3 flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full px-0 py-0 transition-all duration-300 ease-in-out hover:w-[159px]"
                    onClick={() => setOpenUnlinkModal(true)}
                >
                    <Fade className="group-hover:hidden">
                        <BiTrash />
                    </Fade>
                    <Fade className="hidden whitespace-nowrap text-sm group-hover:block">
                        <div>Desvincular Cedente</div>
                    </Fade>
                </Button>
            )}

            {mode === 'editFromPj' && (
                <Button 
                variant='ghost'
                title="Voltar"
                className="group absolute left-3 top-3flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-slate-700">
                    <BiArrowBack
                        className="text-2xl transition-colors duration-300 group-hover:text-white"
                        onClick={() => setIsEditingPfFromPj(false)}
                    />
                </Button>
            )}

            {mode !== "editFromPj" && (
                <Button 
                variant='ghost'
                className="group absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-slate-700">
                    <BiX
                        className="text-2xl transition-colors duration-300 group-hover:text-white"
                        onClick={() => confirmClose()}
                    />
                </Button>
            )}

            <h2 className="mb-10 text-center text-2xl font-medium">
                {mode === 'create' && "Cadastro de Cedente"}
                {mode === 'edit' && "Editar Cedente"}
                {mode === 'editFromPj' && "Editar Representante Social"}
            </h2>

            {mode === 'create' && !cedentePfData.data && !openRegisterForm && (
                <>
                    <div className="mt-7">
                        {registeredCedentesList.isFetching ? (
                            <CedenteModalSkeleton />
                        ) : (
                            <>
                                {registeredCedentesList.listPf &&
                                    registeredCedentesList.listPf.length > 0 ? (
                                    <>
                                        <div className="flex flex-col gap-1">
                                            <FormForCedentePfList
                                                registeredCedentesList={registeredCedentesList}
                                                idPrecatorio={id}
                                            />
                                        </div>

                                        <div className="relative my-6 border-t border-stroke dark:border-form-strokedark">
                                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-3 dark:bg-boxdark">
                                                ou
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-20 text-center">
                                            Nenhum cedente cadastrado.
                                        </p>
                                    </>
                                )}
                            </>
                        )}

                        <Button onClick={() => setOpenRegisterForm(true)} className="mx-auto block">
                            Cadastrar novo cedente
                        </Button>
                    </div>
                </>
            )}

            {(mode === 'edit' || cedentePfData.data !== null || openRegisterForm) && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid h-[70vh] w-full grid-cols-2 overflow-y-auto pr-5 2xsm:gap-6 md:gap-2"
                >
                    {/* relacionado ao oficio */}
                    <input
                        type="hidden"
                        value={id}
                        {...register('relacionado_a', {
                            required: true,
                        })}
                    />

                    {/* nome completo */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="nome_completo"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaUserLarge />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Nome Completo
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('nome_completo', {
                                required: {
                                    value: true,
                                    message: 'Campo obrigatório',
                                },
                            })}
                            className={`${errors.nome_completo ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                        />
                        {errors.nome_completo && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                {errors.nome_completo.message}
                            </span>
                        )}
                    </div>

                    {/* CPF */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="cpf" className="flex items-center justify-center gap-2">
                            <HiMiniIdentification className="text-lg" />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                CPF
                            </span>
                        </label>
                        <Controller
                            name="cpf"
                            control={control}
                            rules={{
                                required: 'Campo obrigatório',
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Campo Vazio'
                                        }
                                        className={`${error ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                                        options={{
                                            delimiters: ['.', '.', '-'],
                                            blocks: [3, 3, 3, 2],
                                        }}
                                    />
                                    {error && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                            {error.message}
                                        </span>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Identidade */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="identidade"
                            className="flex items-center justify-center gap-2"
                        >
                            <HiMiniIdentification className="text-lg" />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Identidade
                            </span>
                        </label>
                        <Controller
                            name="identidade"
                            control={control}
                            rules={{
                                required: 'Campo obrigatório',
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Campo Vazio'
                                        }
                                        className={`${error ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                                        options={{}}
                                    />
                                    {error && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                            {error.message}
                                        </span>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Órgão expedidor */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="orgao_exp"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaUniversity />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Órgão expedidor
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('orgao_exp')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* CEP */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="cep" className="flex items-center justify-center gap-2">
                            <MdPinDrop />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                CEP
                            </span>
                        </label>
                        <Controller
                            name="cep"
                            control={control}
                            rules={{
                                required: 'Campo obrigatório',
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        onBlur={(e) => searchCep(e.target.value)}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Campo Vazio'
                                        }
                                        className={`${error ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                                        options={{
                                            delimiter: '-',
                                            blocks: [5, 3],
                                        }}
                                    />
                                    {error && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                            {error.message}
                                        </span>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* bairro */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="bairro" className="flex items-center justify-center gap-2">
                            <PiCityFill />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Bairro
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('bairro')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Celular */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="celular" className="flex items-center justify-center gap-2">
                            <MdPhone />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Celular
                            </span>
                        </label>
                        <Controller
                            name="celular"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Campo Vazio'
                                        }
                                        className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                                        options={{
                                            delimiters: [' ', ' ', '-'],
                                            blocks: [2, 1, 4, 4],
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* email */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="email" className="flex items-center justify-center gap-2">
                            <MdAlternateEmail />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Email
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('email')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* estado */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="estado" className="flex items-center justify-center gap-2">
                            <MdPinDrop />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Estado
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('estado')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* data de nascimento */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="data_nascimento"
                            className="flex items-center justify-center gap-2"
                        >
                            <BsFillCalendar2WeekFill className="text-sm" />
                            <span
                                title="Data de nascimento"
                                className="w-33 overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                                Data de nascimento
                            </span>
                        </label>
                        <Controller
                            name="data_nascimento"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Campo Vazio'
                                        }
                                        className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                                        options={{
                                            delimiters: ['/', '/'],
                                            blocks: [2, 2, 4],
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* Profissão */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="profissao"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaBriefcase className="text-sm" />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Profissão
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('profissao')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Logradouro */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="logradouro"
                            className="flex items-center justify-center gap-2"
                        >
                            <RiRoadMapLine />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Logradouro
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('logradouro')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* numero */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="numero" className="flex items-center justify-center gap-2">
                            <FaHome />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Número
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('numero')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Complemento */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="complemento"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaHome />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Complemento
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('complemento')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* municipio */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="municipio"
                            className="flex items-center justify-center gap-2"
                        >
                            <TbBuildingEstate />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Municipio
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('municipio')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Nome do pai */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="nome_pai"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaMale />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Nome do Pai
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('nome_pai')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Nome da mãe */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="nome_mae"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaFemale />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Nome da Mãe
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('nome_mae')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Nacionalidade */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label
                            htmlFor="nacionalidade"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaFlag />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Nacionalidade
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder={
                                cedentePfData.isFetching && mode === 'edit'
                                    ? 'Carregando...'
                                    : 'Campo Vazio'
                            }
                            {...register('nacionalidade')}
                            className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                        />
                    </div>

                    {/* Dados Bancários */}

                    {/* Banco */}
                    <div className="relative col-span-2 flex w-full 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="banco" className="flex items-center justify-center gap-2">
                            <BsBank2 />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Banco
                            </span>
                        </label>
                        <Controller
                            name="banco"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <CelerAppCombobox
                                        list={banco}
                                        className="w-full"
                                        placeholder="Selecione o Banco"
                                        value={field.value}
                                        onChangeValue={(value) => {
                                            if (!banco.includes(value)) {
                                                setBanco([value, ...banco]);
                                            }
                                            setValue('banco', value);
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* Agência */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="agencia" className="flex items-center justify-center gap-2">
                            <BiSolidBank />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Agência
                            </span>
                        </label>
                        <Controller
                            name="agencia"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Código do Agência'
                                        }
                                        className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                                        options={{
                                            delimiters: [' '],
                                            blocks: [5],
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* Conta */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="conta" className="flex items-center justify-center gap-2">
                            <RiBankCardFill />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Conta
                            </span>
                        </label>
                        <Controller
                            name="conta"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Cleave
                                        {...field}
                                        placeholder={
                                            cedentePfData.isFetching && mode === 'edit'
                                                ? 'Carregando...'
                                                : 'Código da Conta'
                                        }
                                        className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                                        options={{
                                            delimiters: ['-'],
                                            blocks: [12, 1],
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* Pix */}
                    <div className="relative col-span-2 flex 2xsm:flex-col 2xsm:items-start 2xsm:gap-2 md:max-h-12 md:flex-row md:items-center md:gap-4">
                        <label htmlFor="pix" className="flex items-center justify-center gap-2">
                            <HiMiniBanknotes />
                            <span className="w-33 overflow-hidden text-ellipsis whitespace-nowrap">
                                Pix
                            </span>
                        </label>

                        <div className="grid items-center gap-4 2xsm:w-full 2xsm:grid-cols-1 md:grid-cols-2">
                            <select
                                id="pix"
                                className={`rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-primary focus-visible:shadow-none dark:bg-boxdark sm:w-1/4 md:w-full`}
                                value={pixOption}
                                onChange={(e) => setPixOption(e.target.value as PixOption)}
                            >
                                <option
                                    className="rounded-lg border bg-white dark:bg-boxdark"
                                    value="celular"
                                >
                                    Celular
                                </option>
                                <option
                                    className="rounded-lg border bg-white dark:bg-boxdark"
                                    value="cpf"
                                >
                                    CPF
                                </option>
                                <option
                                    className="rounded-lg border bg-white dark:bg-boxdark"
                                    value="cnpj"
                                >
                                    CNPJ
                                </option>
                                <option
                                    className="rounded-lg border bg-white dark:bg-boxdark"
                                    value="email"
                                >
                                    Email
                                </option>
                                <option
                                    className="rounded-lg border bg-white dark:bg-boxdark"
                                    value="chave"
                                >
                                    Chave Aleatória
                                </option>
                            </select>

                            {pixOption === 'celular' ? (
                                <Controller
                                    name="pix"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                placeholder={
                                                    cedentePfData.isFetching && mode === 'edit'
                                                        ? 'Carregando...'
                                                        : '99 99999-9999'
                                                }
                                                className="col-span-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                                                options={{
                                                    delimiters: [' ', ' ', '-'],
                                                    blocks: [2, 5, 4],
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            ) : null}

                            {pixOption === 'cpf' ? (
                                <Controller
                                    name="pix"
                                    control={control}
                                    rules={{
                                        required: 'Campo obrigatório',
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                placeholder={
                                                    cedentePfData.isFetching && mode === 'edit'
                                                        ? 'Carregando...'
                                                        : '999.999.999-99'
                                                }
                                                className={`${error ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} col-span-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                                                options={{
                                                    delimiters: ['.', '.', '-'],
                                                    blocks: [3, 3, 3, 2],
                                                }}
                                            />
                                            {error && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                                    {error.message}
                                                </span>
                                            )}
                                        </>
                                    )}
                                />
                            ) : null}

                            {pixOption === 'cnpj' ? (
                                <Controller
                                    name="pix"
                                    control={control}
                                    rules={{
                                        required: 'Campo obrigatório',
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                placeholder={
                                                    cedentePfData.isFetching && mode === 'edit'
                                                        ? 'Carregando...'
                                                        : '99.999.999/9999-99'
                                                }
                                                className={`${error ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} col-span-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                                                options={{
                                                    delimiters: ['.', '.', '/', '-'],
                                                    blocks: [2, 3, 3, 4, 2],
                                                }}
                                            />
                                            {error && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                                    {error.message}
                                                </span>
                                            )}
                                        </>
                                    )}
                                />
                            ) : null}

                            {pixOption === 'email' ? (
                                <input
                                    type="email"
                                    placeholder={
                                        cedentePfData.isFetching && mode === 'edit'
                                            ? 'Carregando...'
                                            : 'nome@email.com'
                                    }
                                    {...register('pix')}
                                    className="col-span-1 border-b border-l-0 border-r-0 border-t-0 border-stroke bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 dark:border-strokedark"
                                />
                            ) : null}

                            {pixOption === 'chave' ? (
                                <Controller
                                    name="pix"
                                    control={control}
                                    rules={{
                                        required: 'Campo obrigatório',
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Cleave
                                                {...field}
                                                placeholder={
                                                    cedentePfData.isFetching && mode === 'edit'
                                                        ? 'Carregando...'
                                                        : 'Chave Aleatória'
                                                }
                                                className={`${error ? 'border-2 !border-red ring-0' : 'border-stroke dark:border-strokedark'} col-span-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0`}
                                                options={{
                                                    delimiters: ['-'],
                                                    blocks: [8, 4, 4, 4, 12],
                                                }}
                                            />
                                            {error && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-red">
                                                    {error.message}
                                                </span>
                                            )}
                                        </>
                                    )}
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="col-span-2 my-4 flex items-center justify-center">
                        {mode === 'edit' || mode === 'editFromPj' ? (
                            <Button type="submit">
                                {isUpdating ? 'Salvando Edição...' : 'Finalizar Edição'}
                            </Button>
                        ) : (
                            <Button type="submit">
                                {isUpdating ? 'Realizando cadastro...' : 'Finalizar Cadastro'}
                            </Button>
                        )}
                    </div>
                </form>
            )}

            {/* comentado para um possível uso posterior */}
            {/* {(cedentePfData.isFetching && fromFormPJ && openRegisterForm) && (
          <div className='flex flex-col gap-2'>
            <MiniLoader />
          </div>
      )} */}

            {/* ====> unlink modal <==== */}
            <ConfirmModal
                size="md"
                isOpen={openUnlinkModal}
                onClose={() => setOpenUnlinkModal(false)}
                onConfirm={unlinkCedente}
                isLoading={isUnlinking}
            />
        </div>
    );
};

export default PFform;
