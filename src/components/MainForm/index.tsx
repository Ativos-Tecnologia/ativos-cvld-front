import { ACCESS_TOKEN } from '@/constants/constants';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import numberFormat from '@/functions/formaters/numberFormat';
import UseMySwal from '@/hooks/useMySwal';
import { JWTToken } from '@/types/jwtToken';
import api from '@/utils/api';
import Cleave from 'cleave.js/react';
import { jwtDecode } from 'jwt-decode';
import { Slash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineLoading, AiOutlineReload, AiOutlineWarning } from 'react-icons/ai';
import { BiChevronRight, BiLineChart, BiLogoUpwork, BiMinus, BiPlus } from 'react-icons/bi';
import { TableNotionContext } from '@/context/NotionTableContext';

import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { CvldFormInputsProps } from '@/types/cvldform';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePrecatorioButton } from '../Button/UpdatePrecatorioButton';
import CustomCheckbox from '../CrmUi/Checkbox';
import { DrawerConta } from '../Drawer/DrawerConta';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { ShadSelect } from '../ShadSelect';
import { SelectItem } from '../ui/select';
import CalcForm from '../Forms/CalcForm';
import { applyMaskCpfCnpj } from '@/functions/formaters/maskCpfCnpj';

interface ChartTwoState {
    series: {
        name: string;
        data: number[];
    }[];
}

type CVLDFormProps = {
    dataCallback: (data: any) => void;
    setCalcStep: (stage: string) => void;
    setDataToAppend: (data: any) => void;
};

const MainForm: React.FC<CVLDFormProps> = ({ dataCallback, setCalcStep, setDataToAppend }) => {

    const form = useForm<Partial<CvldFormInputsProps>>({
        defaultValues: {
            ja_possui_destacamento: true,
            percentual_a_ser_adquirido: 100,
            esfera: 'FEDERAL',
            tipo_do_oficio: 'PRECATÓRIO',
            especie: 'PRINCIPAL',
        },
    });

    const queryClient = useQueryClient();
    const enumOficiosList = Object.values(statusOficio);
    const enumTipoOficiosList = Object.values(tipoOficio);

    const { data } = useContext<UserInfoContextType>(UserInfoAPIContext);
    const { setSaveInfoToNotion, usersList } = useContext(TableNotionContext);

    const estados = [
        { id: 'AC', nome: 'Acre' },
        { id: 'AL', nome: 'Alagoas' },
        { id: 'AP', nome: 'Amapá' },
        { id: 'AM', nome: 'Amazonas' },
        { id: 'BA', nome: 'Bahia' },
        { id: 'CE', nome: 'Ceará' },
        { id: 'DF', nome: 'Distrito Federal' },
        { id: 'ES', nome: 'Espírito Santo' },
        { id: 'GO', nome: 'Goiás' },
        { id: 'MA', nome: 'Maranhão' },
        { id: 'MT', nome: 'Mato Grosso' },
        { id: 'MS', nome: 'Mato Grosso do Sul' },
        { id: 'MG', nome: 'Minas Gerais' },
        { id: 'PA', nome: 'Pará' },
        { id: 'PB', nome: 'Paraíba' },
        { id: 'PR', nome: 'Paraná' },
        { id: 'PE', nome: 'Pernambuco' },
        { id: 'PI', nome: 'Piauí' },
        { id: 'RJ', nome: 'Rio de Janeiro' },
        { id: 'RN', nome: 'Rio Grande do Norte' },
        { id: 'RS', nome: 'Rio Grande do Sul' },
        { id: 'RO', nome: 'Rondônia' },
        { id: 'RR', nome: 'Roraima' },
        { id: 'SC', nome: 'Santa Catarina' },
        { id: 'SP', nome: 'São Paulo' },
        { id: 'SE', nome: 'Sergipe' },
        { id: 'TO', nome: 'Tocantins' },
    ];

    const tribunais = [
        { id: 'TRF1', nome: 'Tribunal Regional Federal - 1ª Região' },
        { id: 'TRF2', nome: 'Tribunal Regional Federal - 2ª Região' },
        { id: 'TRF3', nome: 'Tribunal Regional Federal - 3ª Região' },
        { id: 'TRF4', nome: 'Tribunal Regional Federal - 4ª Região' },
        { id: 'TRF5', nome: 'Tribunal Regional Federal - 5ª Região' },
        { id: 'TRF6', nome: 'Tribunal Regional Federal - 6ª Região' },
        { id: 'STF', nome: 'Supremo Tribunal Federal' },
        { id: 'STJ', nome: 'Superior Tribunal de Justiça' },
        { id: 'TST', nome: 'Tribunal Superior do Trabalho' },
        { id: 'TSE', nome: 'Tribunal Superior Eleitoral' },
        { id: 'STM', nome: 'Superior Tribunal Militar' },
        { id: 'TJAC', nome: 'Tribunal de Justiça do Acre' },
        { id: 'TJAL', nome: 'Tribunal de Justiça de Alagoas' },
        { id: 'TJAP', nome: 'Tribunal de Justiça do Amapá' },
        { id: 'TJAM', nome: 'Tribunal de Justiça do Amazonas' },
        { id: 'TJBA', nome: 'Tribunal de Justiça da Bahia' },
        { id: 'TJCE', nome: 'Tribunal de Justiça do Ceará' },
        {
            id: 'TJDFT',
            nome: 'Tribunal de Justiça do Distrito Federal e dos Territórios',
        },
        { id: 'TJES', nome: 'Tribunal de Justiça do Espírito Santo' },
        { id: 'TJGO', nome: 'Tribunal de Justiça de Goiás' },
        { id: 'TJMA', nome: 'Tribunal de Justiça do Maranhão' },
        { id: 'TJMT', nome: 'Tribunal de Justiça do Mato Grosso' },
        { id: 'TJMS', nome: 'Tribunal de Justiça do Mato Grosso do Sul' },
        { id: 'TJMG', nome: 'Tribunal de Justiça de Minas Gerais' },
        { id: 'TJPA', nome: 'Tribunal de Justiça do Pará' },
        { id: 'TJPB', nome: 'Tribunal de Justiça da Paraíba' },
        { id: 'TJPE', nome: 'Tribunal de Justiça de Pernambuco' },
        { id: 'TJPI', nome: 'Tribunal de Justiça do Piauí' },
        { id: 'TJPR', nome: 'Tribunal de Justiça do Paraná' },
        { id: 'TJRJ', nome: 'Tribunal de Justiça do Rio de Janeiro' },
        { id: 'TJRN', nome: 'Tribunal de Justiça do Rio Grande do Norte' },
        { id: 'TJRO', nome: 'Tribunal de Justiça de Rondônia' },
        { id: 'TJRR', nome: 'Tribunal de Justiça de Roraima' },
        { id: 'TJRS', nome: 'Tribunal de Justiça do Rio Grande do Sul' },
        { id: 'TJSC', nome: 'Tribunal de Justiça de Santa Catarina' },
        { id: 'TJSE', nome: 'Tribunal de Justiça de Sergipe' },
        { id: 'TJSP', nome: 'Tribunal de Justiça de São Paulo' },
        { id: 'TJTO', nome: 'Tribunal de Justiça do Tocantins' },
        { id: 'TRT1', nome: 'Tribunal Regional do Trabalho da 1ª Região' },
        { id: 'TRT2', nome: 'Tribunal Regional do Trabalho da 2ª Região' },
        { id: 'TRT3', nome: 'Tribunal Regional do Trabalho da 3ª Região' },
        { id: 'TRT4', nome: 'Tribunal Regional do Trabalho da 4ª Região' },
        { id: 'TRT5', nome: 'Tribunal Regional do Trabalho da 5ª Região' },
        { id: 'TRT6', nome: 'Tribunal Regional do Trabalho da 6ª Região' },
        { id: 'TRT7', nome: 'Tribunal Regional do Trabalho da 7ª Região' },
        { id: 'TRT8', nome: 'Tribunal Regional do Trabalho da 8ª Região' },
        { id: 'TRT9', nome: 'Tribunal Regional do Trabalho da 9ª Região' },
        { id: 'TRT10', nome: 'Tribunal Regional do Trabalho da 10ª Região' },
        { id: 'TRT11', nome: 'Tribunal Regional do Trabalho da 11ª Região' },
        { id: 'TRT12', nome: 'Tribunal Regional do Trabalho da 12ª Região' },
        { id: 'TRT13', nome: 'Tribunal Regional do Trabalho da 13ª Região' },
        { id: 'TRT14', nome: 'Tribunal Regional do Trabalho da 14ª Região' },
        { id: 'TRT15', nome: 'Tribunal Regional do Trabalho da 15ª Região' },
        { id: 'TRT16', nome: 'Tribunal Regional do Trabalho da 16ª Região' },
        { id: 'TRT17', nome: 'Tribunal Regional do Trabalho da 17ª Região' },
        { id: 'TRT18', nome: 'Tribunal Regional do Trabalho da 18ª Região' },
        { id: 'TRT19', nome: 'Tribunal Regional do Trabalho da 19ª Região' },
        { id: 'TRT20', nome: 'Tribunal Regional do Trabalho da 20ª Região' },
        { id: 'TRT21', nome: 'Tribunal Regional do Trabalho da 21ª Região' },
        { id: 'TRT22', nome: 'Tribunal Regional do Trabalho da 22ª Região' },
        { id: 'TRT23', nome: 'Tribunal Regional do Trabalho da 23ª Região' },
        { id: 'TRT24', nome: 'Tribunal Regional do Trabalho da 24ª Região' },
    ].sort((a, b) => a.nome.localeCompare(b.nome));

    const [oficioForm, setOficioForm] = useState<any>(null);
    const mySwal = UseMySwal();
    const [loading, setLoading] = useState<boolean>(false);
    const [toggleNovaConta, setToggleNovaConta] = useState<boolean>(false);

    const [contatoNumberCount, setContatoNumberCount] = useState<number>(1);

    const [state, setState] = useState<ChartTwoState>({
        series: [
            {
                name: 'Valor Principal',
                data: [0, 0],
            },
            {
                name: 'Valor Juros',
                data: [0, 0],
            },
        ],
    });

    const vincularUsuario = form.watch('vincular_usuario');
    useEffect(() => {
        if (vincularUsuario) {
            setSaveInfoToNotion(true);
        } else {
            setSaveInfoToNotion(false);
        }
    }, [setSaveInfoToNotion, vincularUsuario]);

    const isUserAdmin = () => {
        const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
        const decoded: JWTToken = jwtDecode(token!);
        return decoded.is_staff;
    };

    const postNotionData = async (data: any) => {
        const response = await api.post('/api/extrato/create/', data);
        return response;
    };

    const onSubmit = async (data: any) => {
        data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
        data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
        data.outros_descontos = backendNumberFormat(data.outros_descontos) || 0;
        data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
        data.percentual_a_ser_adquirido /= 100;

        //#TODO colocar essa condicional dentro de uma função utilitária
        if (!data.data_limite_de_atualizacao_check) {
            const dateInSaoPaulo = new Date().toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            const formattedDate = dateInSaoPaulo.split('/').reverse().join('-');
            data.data_limite_de_atualizacao = formattedDate;
        }

        data.cpf_cnpj = applyMaskCpfCnpj(data.cpf_cnpj);

        if (!data.status) {
            data.status = 'Realizar Primeiro Contato';
        }

        if (!data.natureza) {
            data.natureza = 'NÃO TRIBUTÁRIA';
        }

        if (!data.esfera) {
            data.esfera = 'FEDERAL';
        }

        if (!data.regime) {
            data.regime = 'GERAL';
        }

        if (!data.ir_incidente_rra) {
            data.numero_de_meses = undefined;
        }

        if (!data.incidencia_pss) {
            data.valor_pss = 0;
        }

        if (data.gerar_cvld) {
            data.upload_notion = true;
        }

        if (!data.npu) {
            data.npu = '0000000-00.0000.0.00.0000';
        }

        if (!data.numero_de_meses) {
            data.numero_de_meses = 0;
        }

        if (data.upload_notion) {
            data.notion_db_id = 'notion_central_de_prec_db_id';
        }

        if (!data.vincular_usuario) {
            data.username = undefined;
        }

        if (data.ja_possui_destacamento) {
            data.percentual_de_honorarios = 0;
        } else {
            data.percentual_de_honorarios /= 100;
        }

        if (data.valor_aquisicao_total) {
            data.percentual_a_ser_adquirido = 1;
        } else {
            data.percentual_a_ser_adquirido = data.percentual_a_ser_adquirido / 100
        }

        if (!data.estado_ente_devedor) {
            data.estado_ente_devedor = null;
        }

        if (!data.tribunal) {
            data.tribunal = 'TRF1';
        }

        setLoading(true);
        try {
            setCalcStep('calculating');

            const response = data.gerar_cvld
                ? await postNotionData(data)
                : await api.post('/api/extrato/query/', data);

            response.status === 200
                ? dataCallback(response.data)
                : (setDataToAppend(response.data), dataCallback(response.data));

            if (response.status === 201 || response.status === 200) {
                // setCredits({
                //   ...credits,
                //   available_credits:
                //     credits.available_credits - response.data.result[0].price,
                // });

                dataCallback(response.data);

                setCalcStep('done');

                const formatedPrincipal = parseFloat(data.valor_principal).toFixed(2);
                const formatedUpdatedPrincipal = parseFloat(
                    response.data.result[0].principal_atualizado_requisicao,
                ).toFixed(2);

                if (data.natureza === 'TRIBUTÁRIA') {
                    const series = [
                        {
                            name: 'Valor Principal',
                            data: [
                                Number(parseFloat(formatedPrincipal)),
                                Number(parseFloat(formatedPrincipal)),
                            ],
                        },
                        {
                            name: 'Valor Juros',
                            data: [
                                Number(parseFloat(data.valor_juros).toFixed(2)),
                                Number(
                                    parseFloat(response.data.result[0].juros_atualizado).toFixed(2),
                                ),
                            ],
                        },
                        {
                            name: 'Total',
                            data: [
                                Number(
                                    parseFloat(response.data.result[0].valor_inscrito).toFixed(2),
                                ),
                                Number(
                                    parseFloat(
                                        response.data.result[0].valor_liquido_disponivel,
                                    ).toFixed(2),
                                ),
                            ],
                        },
                    ];

                    setState({ series });
                } else {
                    const series = [
                        {
                            name: 'Valor Principal',
                            data: [
                                Number(parseFloat(formatedPrincipal)),
                                Number(parseFloat(formatedUpdatedPrincipal)),
                            ],
                        },
                        {
                            name: 'Valor Juros',
                            data: [
                                Number(parseFloat(data.valor_juros).toFixed(2)),
                                Number(
                                    parseFloat(
                                        response.data.result[0].juros_atualizados_requisicao,
                                    ).toFixed(2),
                                ),
                            ],
                        },
                        {
                            name: 'Total',
                            data: [
                                Number(
                                    parseFloat(response.data.result[0].valor_inscrito).toFixed(2),
                                ),
                                Number(
                                    parseFloat(
                                        response.data.result[0].valor_liquido_disponivel,
                                    ).toFixed(2),
                                ),
                            ],
                        },
                    ];
                    setState({ series });
                }
            }
            setLoading(false);
        } catch (error: any) {
            if (error.response?.status === 401 && error.response?.data.code === 'token_not_valid') {
                mySwal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Sua sessão expirou. Faça login novamente.',
                });
                localStorage.clear();
                window.location.href = 'auth/signin';
            } else if (
                error.response?.status === 400 &&
                (error.response.data.subject == 'NO_CASH' ||
                    error.response.data.subject == 'INSUFFICIENT_CASH')
            ) {
                mySwal.fire({
                    icon: 'warning',
                    title: 'Saldo insuficiente',
                    showConfirmButton: false,
                    showCloseButton: true,
                    html: (
                        <div className="flex flex-col rounded-md border border-stroke dark:border-strokedark dark:bg-boxdark">
                            <div className="my-2 flex items-center justify-center">
                                <p className="text-md font-semibold dark:text-white">
                                    Escolha uma das opções de recarga e continue utilizando a
                                    plataforma
                                </p>
                            </div>
                            <div className="mt-2 flex flex-col rounded-md border border-stroke p-4 dark:border-strokedark dark:bg-boxdark">
                                <Link
                                    href="#"
                                    className="text-md group flex flex-row items-center justify-center font-semibold text-primary dark:text-white"
                                >
                                    Adquirir Créditos
                                    <BiChevronRight
                                        style={{
                                            width: '22px',
                                            height: '22px',
                                        }}
                                        className="ml-1 inline-block transition-all duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </div>
                    ),
                });
            } else if (error.response?.status === 403) {
                mySwal.fire({
                    icon: 'warning',
                    title: 'Erro',
                    text: 'Alguns campos estão incorretos. Verifique e tente novamente.',
                });
            } else {
                mySwal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: error.response?.data.detail,
                });

                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-span-12 rounded-md border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="flex-col flex-wrap items-start justify-between gap-3 pb-0 sm:flex-nowrap">
                <div className="flex w-full justify-center align-middle">
                    <h2 className="mt-1.5 flex select-none flex-col justify-center font-nexa text-3xl font-normal text-primary antialiased">
                        Celer
                    </h2>
                    <p className="flex flex-col justify-center text-xs font-semibold text-primary">
                        <Slash className="-mr-3 mt-1 h-5 w-5 -rotate-45 text-gray-200" />
                    </p>
                    <Image
                        src="/images/logo/celer-ia-only-logo.svg"
                        alt="Celer IA Engine"
                        width={56}
                        height={50}
                        className="mt-[6.1px] select-none antialiased"
                        aria-selected={false}
                        draggable={false}
                    />
                </div>
                <p className="apexcharts-legend-text mt-0 text-center text-sm font-normal">
                    Nosso modelo de atualização de valores de precatórios e RPVs
                </p>
            </div>
            <CalcForm
                onSubmitForm={onSubmit}
                formConfigs={form}
                isLoading={loading}
            />
        </div>
    );
};

export default MainForm;
