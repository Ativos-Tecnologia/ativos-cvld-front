import React from 'react'
import { Button, variants } from '../Button';
import { MdOutlineArchive, MdOutlineDownloading } from 'react-icons/md';
import { BiX } from 'react-icons/bi';
import { CgArrowsH } from 'react-icons/cg';
import UseMySwal from '@/hooks/useMySwal';
import api from '@/utils/api';
import { NotionPage } from '@/interfaces/INotion';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { TiArrowBack, TiArrowForward } from 'react-icons/ti';

type ActionButtonsProps = {
    name: string;
    icon: React.ReactNode;
    onClick: any;
    diligenceStatusRange: string[];
    buttonVariant: string;
}

const DetalhesActionButtons = ({ data, refetch }: {
    data: NotionPage,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<NotionPage, Error>>,
}) => {
    const swal = UseMySwal();

    const handleRepactuacao = () => {
        swal.fire({
            title: 'Repactuação',
            text: 'Deseja mesmo Enviar para Repactuação?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await api.patch(`api/notion-api/update/${data.id}/`, {
                    "Status Diligência": {
                        "select": {
                            "name": "Repactuação"
                        }
                    }
                });
                if (response.status !== 202) {
                    swal.fire({
                        title: 'Erro',
                        text: 'Houve um erro ao enviar para Repactuação',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }

                refetch();

                swal.fire({
                    title: 'Registro Salvo.',
                    text: 'O Oficio seguiu para a Repactuação.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        })
    }

    const handleUpdateDuePhase = async (phase: string, fieldsCheck?: (boolean | undefined)[]) => {
        const requiredInputsCheck = fieldsCheck ? fieldsCheck.every((value) => value === true) : true;
        if (requiredInputsCheck) {
            swal.fire({
                title: 'Mudança de Etapa',
                text: 'Deseja enviar ofício para ' + phase + '?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#F44336',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await api.patch(`api/notion-api/update/${data?.id}/`, {
                        "Status Diligência": {
                            "select": {
                                "name": phase
                            }
                        }
                    });
                    if (response.status !== 202) {
                        swal.fire({
                            title: 'Erro',
                            text: 'Houve um erro ao enviar para ' + phase,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }

                    refetch();

                    swal.fire({
                        title: 'Registro Salvo.',
                        text: 'O Oficio seguiu para a ' + phase,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            })
        } else {
            swal.fire({
                icon: "warning",
                title: "Aviso",
                text: "Existem campos obrigatórios que ainda não foram preenchidos. Por favor, revise o formulário.",
            });
            // setRequiredInputsErrorType(data?.properties["Status Diligência"].select?.name as InputErrorTypes);
        }
    }

    // const handleDueAndamento = () => {
    //     const requiredInputsCheck = verifyRequiredInputsToDue(data && data, credorIdentificationType === "CPF" ? cedenteDataPF : socioData);
    //     if (requiredInputsCheck) {

    //         swal.fire({
    //             title: 'Due em Andamento',
    //             text: 'Deseja mesmo alterar para Due em Andamento?',
    //             icon: 'question',
    //             showCancelButton: true,
    //             confirmButtonText: 'Sim',
    //             cancelButtonText: 'Não',
    //             confirmButtonColor: '#4CAF50',
    //             cancelButtonColor: '#F44336',
    //         }).then(async (result) => {
    //             if (result.isConfirmed) {
    //                 const response = await api.patch(`api/notion-api/update/${data?.id}/`, {
    //                     "Status Diligência": {
    //                         "select": {
    //                             "name": "Due em Andamento"
    //                         }
    //                     }
    //                 });
    //                 if (response.status !== 202) {
    //                     swal.fire({
    //                         title: 'Erro',
    //                         text: 'Houve um erro ao deixar a Due em Andamento',
    //                         icon: 'error',
    //                         confirmButtonText: 'OK'
    //                     });
    //                 }

    //                 refetch();

    //                 swal.fire({
    //                     title: 'Registro Salvo',
    //                     text: 'A diligência está em andamento!.',
    //                     icon: 'success',
    //                     confirmButtonText: 'OK'
    //                 });
    //             }
    //         });

    //     } else {
    //         swal.fire({
    //             icon: "warning",
    //             title: "Aviso",
    //             text: "Existem campos obrigatórios que ainda não foram preenchidos. Por favor, revise o formulário.",
    //         });
    //         setRequiredInputsErrorType("Due em Andamento");
    //     }
    // }

    const buttons: ActionButtonsProps[] = [
        {
            name: "Repactuação",
            icon: <CgArrowsH className="h-4 w-4" />,
            onClick: handleRepactuacao,
            diligenceStatusRange: [
                "Pré-Due Cedente",
                "Pré-Due Ativo",
                "Revisão Valor/LOA"
            ],
            buttonVariant: "info"
        },
        {
            name: "Seguir para Pré-Due Ativo",
            icon: <TiArrowForward className="h-4 w-4" />,
            onClick: () => handleUpdateDuePhase("Pré-Due Ativo", [data?.properties["Preenchimento Correto"].checkbox, data?.properties["Memória de Cálculo"].checkbox]),
            diligenceStatusRange: ["Pré-Due Ativo"],
            buttonVariant: "success"
        },
        {
            name: "Voltar para Revisão de Preço e Tempo",
            icon: <TiArrowBack className="h-4 w-4" />,
            onClick: () => handleUpdateDuePhase("Revisão Valor/LOA"),
            diligenceStatusRange: ["Pré-Due Ativo"],
            buttonVariant: "warning"
        },
        {
            name: "Seguir para Pré-Due Cedente",
            icon: <TiArrowForward className="h-4 w-4" />,
            onClick: () => handleUpdateDuePhase("Pré-Due Cedente", [
                data?.properties["Autos do Ativo Judicial Baixado"].checkbox,
                data?.properties["Há algum recurso?"].select?.name ? true : false
            ]),
            diligenceStatusRange: ["Pré-Due Ativo"],
            buttonVariant: "success"
        },
        {
            name: "Voltar para Pré-Due do Ativo",
            icon: <TiArrowBack className="h-4 w-4" />,
            onClick: () => handleUpdateDuePhase("Pré-Due Ativo"),
            diligenceStatusRange: ["Pré-Due Cedente"],
            buttonVariant: "warning"
        },
        {
            name: "Seguir para Due Diligence",
            icon: <TiArrowForward className="h-4 w-4" />,
            onClick: () => handleUpdateDuePhase("Due Diligence"),
            diligenceStatusRange: ["Pré-Due Cedente"],
            buttonVariant: "success"
        },
        {
            name: "Pendência Sanada",
            icon: <MdOutlineDownloading className="h-4 w-4" />,
            onClick: null,
            diligenceStatusRange: ["Pré-Due Cedente"],
            buttonVariant: "info"
        },
    ]

    return (
        <div className="flex items-center 2xsm:flex-col md:flex-row justify-center gap-6 bg-white dark:bg-boxdark p-4 rounded-md">
            <Button
                variant="danger"
                className="py-2 px-4 rounded-md 2xsm:w-full md:w-fit flex items-center gap-3 uppercase text-sm font-medium"
            // onClick={() => handleArchiving()}
            >
                <MdOutlineArchive className="h-4 w-4" />
                <span>Arquivar</span>
            </Button>

            <Button
                variant="danger"
                className="py-2 px-4 rounded-md 2xsm:w-full md:w-fit flex items-center gap-3 uppercase text-sm font-medium"
            // onClick={() => handlePendencia()}
            >
                <BiX className="h-4 w-4" />
                <span>Pendência a Sanar</span>
            </Button>

            {buttons.map(button => (
                <React.Fragment key={button.name}>
                    {button.diligenceStatusRange.includes(data?.properties["Status Diligência"].select?.name || "") && (
                        <Button
                            variant={button.buttonVariant as keyof typeof variants}
                            className="py-2 px-4 rounded-md 2xsm:w-full md:w-fit flex items-center gap-3 uppercase text-sm font-medium"
                            onClick={() => button.onClick()}
                        >
                            {button.icon}
                            <span>{button.name}</span>
                        </Button>
                    )}
                </React.Fragment>
            ))}

        </div>
    )
}

export default DetalhesActionButtons;
