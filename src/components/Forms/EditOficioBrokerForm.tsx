'use client';
import { BrokersContext } from '@/context/BrokersContext';
import { NotionPage } from '@/interfaces/INotion';
import { CvldFormInputsProps } from '@/types/cvldform';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiCheck, BiX } from 'react-icons/bi';
import backendNumberFormat from '@/functions/formaters/backendNumberFormat';
import { useMutation } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { verifyUpdateFields } from '@/functions/verifiers/verifyValues';
import CalcForm from './CalcForm';
import { isCPFOrCNPJValid } from '@/functions/verifiers/isCPFOrCNPJValid';
import UseMySwal from '@/hooks/useMySwal';
import { getCurrentFormattedDate } from '@/functions/getCurrentFormattedDate';

interface IFormBroker {
    mainData: NotionPage | null;
}

/**
 * Componente de formulário para edição do oficio (dashbrokers)
 *
 * @param {IFormBroker} props - Interface com propriedades do componente
 * @returns {React.JSX.Element} - O formulário renderizado
 *
 */

const EditOficioBrokerForm = ({ mainData }: IFormBroker): React.JSX.Element => {
    const MySwal = UseMySwal();

    /* ====> dados inicias do formulário */
    const [defaultFormValues, setDefaultFormValues] = useState<any>(null);

    /* ====> form imports <==== */
    const form = useForm<Partial<CvldFormInputsProps>>();

    const { editModalId, setEditModalId, setIsFetchAllowed, fetchDetailCardData } =
        useContext(BrokersContext);
    const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

    // mutation de alteração dos dados do oficio
    const updateOficio = useMutation({
        mutationFn: async (data) => {
            const req = await api.patch(`/api/lead-magnet/update/${mainData!.id}/`, data);
            return req.status;
        },
        onMutate: async () => {
            setIsSavingEdit(true);
            setIsFetchAllowed(false);
        },
        onError: () => {
            toast.error('Erro ao atualizar ofício', {
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
            await fetchDetailCardData(mainData!.id);
            setEditModalId(null);
            toast.success('Dados do ofício atualizados.', {
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
        },
        onSettled: () => {
            setIsSavingEdit(false);
            setIsFetchAllowed(true);
        },
    });

    // função para alterar os dados do oficio (submit)
    async function onSubmit(data: any) {

        if (verifyUpdateFields(defaultFormValues, data)) {
            data.need_to_recalculate_proposal = true;
        } else {
            data.need_to_recalculate_proposal = false;
        }

        if (data.tipo_do_oficio === 'CREDITÓRIO') {

            const formattedDate = getCurrentFormattedDate().split('/').reverse().join('-');
            data.data_requisicao = formattedDate;
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

        if (data.valor_aquisicao_total) {
            data.percentual_a_ser_adquirido = 1;
        } else {
            data.percentual_a_ser_adquirido = typeof data.percentual_a_ser_adquirido === 'string'
                ? Number(data.percentual_a_ser_adquirido.replace("%", "").replace(",", ".")) / 100
                : data.percentual_a_ser_adquirido / 100;
        }

        if (data.ja_possui_destacamento) {
            data.percentual_de_honorarios = 0;
        } else {
            data.percentual_de_honorarios = typeof data.percentual_de_honorarios === 'string'
                ? Number(data.percentual_de_honorarios.replace("%", "").replace(",", ".")) / 100
                : data.percentual_de_honorarios / 100;
        }

        if (typeof data.valor_principal === 'string') {
            data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
            data.valor_principal = parseFloat(data.valor_principal);
        }

        if (typeof data.valor_juros === 'string') {
            data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
            data.valor_juros = parseFloat(data.valor_juros);
        }

        if (typeof data.outros_descontos === 'string') {
            data.outros_descontos = backendNumberFormat(data.outros_descontos) || 0;
            data.outros_descontos = parseFloat(data.outros_descontos);
        }

        if (typeof data.valor_pss) {
            data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
            data.valor_pss = parseFloat(data.valor_pss);
        }

        if (!data.ir_incidente_rra) {
            data.numero_de_meses = 0;
        }

        if (!data.incidencia_pss) {
            data.valor_pss = 0;
        }

        if (!data.data_limite_de_atualizacao_check) {

            const formattedDate = getCurrentFormattedDate().split('/').reverse().join('-');
            data.data_limite_de_atualizacao = formattedDate;
        }

        await updateOficio.mutateAsync(data);
    }

    return (
        <div
            className={`absolute left-0 top-0 z-3 w-full bg-white dark:bg-boxdark ${editModalId === mainData?.id ? 'max-h-full overflow-y-scroll rounded-md border border-snow' : 'max-h-0 overflow-hidden'} grid grid-cols-2 gap-2 transition-all duration-300`}
        >
            <div className="col-span-2 p-5">
                <h2 className="mb-8 text-center text-xl font-medium">
                    Edite as informações do ofício
                </h2>

                {/* ----> close button <---- */}
                <button
                    onClick={() => setEditModalId(null)}
                    className="absolute right-0 top-0 rounded-bl-sm p-1 transition-colors duration-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                    <BiX className="text-2xl" />
                </button>
                {/* ----> end close button <---- */}

                {/* TODO: possibilidade de implementar um componente para esse form */}
                <CalcForm
                    data={mainData}
                    hasDropzone={false}
                    onSubmitForm={onSubmit}
                    formConfigs={form}
                    formMode="update"
                    isLoading={isSavingEdit}
                    auxDataSetter={setDefaultFormValues}
                />
            </div>
        </div>
    );
};

export default EditOficioBrokerForm;
