import { ACCESS_TOKEN } from '@/constants/constants';
import UseMySwal from '@/hooks/useMySwal';
import { JWTToken } from '@/types/jwtToken';
import api from '@/utils/api';
import { jwtDecode } from 'jwt-decode';
import { Slash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiChevronRight } from 'react-icons/bi';
import { TableNotionContext } from '@/context/NotionTableContext';

import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { CvldFormInputsProps } from '@/types/cvldform';
import CalcForm from '../Forms/CalcForm';
import { isCPFOrCNPJValid } from '@/functions/verifiers/isCPFOrCNPJValid';
import { getCurrentFormattedDate } from '@/functions/getCurrentFormattedDate';

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

    const MySwal = UseMySwal();

    const { setSaveInfoToNotion } = useContext(TableNotionContext);

    const mySwal = UseMySwal();
    const [loading, setLoading] = useState<boolean>(false);

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
        

        if (data.tipo_do_oficio === 'CREDITÓRIO') {

            const formattedDate = getCurrentFormattedDate().split('/').reverse().join('-');
            data.data_requisicao = formattedDate;
        }

        if (!data.data_limite_de_atualizacao_check) {

            const formattedDate = getCurrentFormattedDate().split('/').reverse().join('-');
            data.data_limite_de_atualizacao = formattedDate;
        }

        if (data.gerar_cvld) {
            if (!isCPFOrCNPJValid(form.watch('cpf_cnpj') || "")) {
                MySwal.fire({
                    title: 'Ok, Houston...Temos um problema!',
                    text: 'O CPF ou CNPJ inserido é inválido. Por favor, tente novamente.',
                    icon: 'error',
                    showConfirmButton: true,
                });
                return;
            }

            data.cpf_cnpj = form.watch("cpf_cnpj");
        }

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
            data.percentual_de_honorarios = typeof data.percentual_de_honorarios === 'string'
                ? Number(data.percentual_de_honorarios.replace("%", "").replace(",", ".")) / 100
                : data.percentual_de_honorarios / 100;
        }

        if (data.valor_aquisicao_total) {
            data.percentual_a_ser_adquirido = 1;
        } else {
            data.percentual_a_ser_adquirido = typeof data.percentual_a_ser_adquirido === 'string'
                ? Number(data.percentual_a_ser_adquirido.replace("%", "").replace(",", ".")) / 100
                : data.percentual_a_ser_adquirido / 100;
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
